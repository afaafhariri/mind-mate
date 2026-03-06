import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { Box, Typography, Paper, Grid, Skeleton, FormControl, Select, MenuItem, Chip, Button, CircularProgress, Fade, Grow } from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InsightsIcon from "@mui/icons-material/Insights";
import TimelineIcon from "@mui/icons-material/Timeline";
import PsychologyIcon from "@mui/icons-material/Psychology";
import RefreshIcon from "@mui/icons-material/Refresh";
import LiveClock from "../components/LiveClock";
import { ME, type User } from "../graphql/user";
import { GET_JOURNALS, type Journal } from "../graphql/journals";
import { RagService, type MoodPoint } from "../services/ragService";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { data: userData, loading: userLoading } = useQuery<{ me: User }>(ME);
  const { data: journalData } = useQuery<{ getJournals: Journal[]; }>(GET_JOURNALS);

  const [moodPeriod, setMoodPeriod] = useState("7d");
  const [moodData, setMoodData] = useState<MoodPoint[]>([]);
  const [loadingMood, setLoadingMood] = useState(false);

  const [insights, setInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const [summaryPeriod, setSummaryPeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [summaryText, setSummaryText] = useState("");
  const [patternText, setPatternText] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  const user = userData?.me;
  const journals = journalData?.getJournals || [];

  const totalJournals = journals.length;
  const thisWeekJournals = journals.filter((j) => {
    const journalDate = new Date(j.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return journalDate >= weekAgo;
  }).length;

  const calculateStreak = () => {
    if (journals.length === 0) return 0;
    const sortedDates = [...new Set(
      journals.map((j) => new Date(j.createdAt).toDateString())
    )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const postedToday = sortedDates.length > 0 && sortedDates[0] === today.toDateString();

    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      if (sortedDates.includes(expectedDate.toDateString())) {
        streak++;
      } else if (i === 0 && !postedToday) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (sortedDates.includes(yesterday.toDateString())) {
        } else {
          break;
        }
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak();

  const fetchMoodData = async () => {
    setLoadingMood(true);
    try {
      const result = await RagService.analyzeMood(moodPeriod);
      if (result.moods) {
        setMoodData(result.moods);
      }
    } catch (error) {
      console.error("Failed to fetch mood data", error);
    } finally {
      setLoadingMood(false);
    }
  };

  const fetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const result = await RagService.getMentalHealthInsights();
      setInsights(result);
    } catch (error) {
      console.error("Failed to fetch insights", error);
    } finally {
      setLoadingInsights(false);
    }
  }

  const fetchSummaryAndPatterns = async () => {
    setLoadingSummary(true);
    try {
      const [summary, patterns] = await Promise.all([
        RagService.getSummary(summaryPeriod),
        RagService.analyzePatterns()
      ]);
      setSummaryText(summary);
      setPatternText(patterns);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummary(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchMoodData();
      fetchInsights();
      fetchSummaryAndPatterns();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchMoodData();
    }
  }, [moodPeriod]);

  const chartData = {
    labels: moodData.map(m => m.date),
    datasets: [
      {
        label: 'Mood Score',
        data: moodData.map(m => m.score),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const anxietyChartData = {
    labels: moodData.map(m => m.date),
    datasets: [
      {
        label: 'Anxiety Level',
        data: moodData.map(m => m.anxiety_level),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const sleepChartData = {
    labels: moodData.map(m => m.date),
    datasets: [
      {
        label: 'Sleep Quality',
        data: moodData.map(m => m.sleep_quality),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 10,
      }
    }
  };

  return (
    <Fade in timeout={800}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(145deg, #ffffff 0%, #f3f6f9 100%)', border: '1px solid #e0e0e0' }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 5 }}>
          <Box>
            <Typography variant="h3" fontWeight={800} color="primary.dark">
              Hello, {user?.firstName || "Friend"}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 1, fontWeight: 500 }}>
              Here's your mental wellness overview
            </Typography>
          </Box>
          <LiveClock />
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#f8f9fa' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PsychologyIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>Mental Health Insights</Typography>
                </Box>
                <Button startIcon={<RefreshIcon />} size="small" onClick={fetchInsights} disabled={loadingInsights}>
                  Refresh
                </Button>
              </Box>

              {loadingInsights ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>
              ) : insights ? (
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, textAlign: 'center', height: '100%' }}>
                      <Typography variant="subtitle2" color="text.secondary">Overall Condition</Typography>
                      <Typography variant="h3" fontWeight={800}
                        color={insights.condition === 'Great' ? 'success.main' :
                          insights.condition === 'Good' ? 'info.main' :
                            insights.condition === 'Bad' ? 'warning.main' : 'error.main'}
                        sx={{ my: 1 }}
                      >
                        {insights.condition}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Typography variant="body1" paragraph>{insights.summary}</Typography>
                    {insights.triggers && insights.triggers.length > 0 && (
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', color: 'text.secondary', display: 'block', mb: 1 }}>Potential Triggers</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {insights.triggers.map((t: string, i: number) => (
                            <Chip key={i} label={t} size="small" color="error" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              ) : (
                <Typography color="text.secondary">No insights available. Start journaling to get AI analysis.</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Grow in timeout={1000}>
          <Box sx={{ mb: 5 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 4, background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", color: "white", transition: 'transform 0.3s ease', '&:hover': { transform: 'translateY(-5px)' } }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AutoStoriesIcon sx={{ fontSize: 40 }} />
                  </Box>
                  <Typography variant="h2" fontWeight={800}>{userLoading ? <Skeleton width={80} /> : totalJournals}</Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>Total Journals</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 4, background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", color: "white", transition: 'transform 0.3s ease', '&:hover': { transform: 'translateY(-5px)' } }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <TrendingUpIcon sx={{ fontSize: 40 }} />
                  </Box>
                  <Typography variant="h2" fontWeight={800}>{userLoading ? <Skeleton width={80} /> : thisWeekJournals}</Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>Journals This Week</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 4, background: "linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)", color: "white", transition: 'transform 0.3s ease', '&:hover': { transform: 'translateY(-5px)' } }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <InsightsIcon sx={{ fontSize: 40 }} />
                  </Box>
                  <Typography variant="h2" fontWeight={800}>{userLoading ? <Skeleton width={80} /> : `${streak} day${streak !== 1 ? "s" : ""}`}</Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>Current Streak</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Grow>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimelineIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>Trends</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small">
                <Select value={moodPeriod} onChange={(e) => setMoodPeriod(e.target.value)} sx={{ borderRadius: 2 }}>
                  <MenuItem value="7d">Last 7 Days</MenuItem>
                  <MenuItem value="14d">Last 14 Days</MenuItem>
                  <MenuItem value="30d">Last 30 Days</MenuItem>
                  <MenuItem value="3m">Last 3 Months</MenuItem>
                  <MenuItem value="6m">Last 6 Months</MenuItem>
                  <MenuItem value="1y">Last Year</MenuItem>
                  <MenuItem value="3y">Last 3 Years</MenuItem>
                  <MenuItem value="5y">Last 5 Years</MenuItem>
                </Select>
              </FormControl>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchMoodData}>Refresh</Button>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: '#f8f9fa' }}>
                <Typography variant="subtitle1" fontWeight={600} align="center" sx={{ mb: 1 }}>Mood</Typography>
                <Box sx={{ height: 250 }}>
                  {loadingMood ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>
                  ) : moodData.length > 0 ? (
                    <Line data={chartData} options={chartOptions} />
                  ) : (
                    <Typography color="text.secondary" align="center" sx={{ mt: 5 }}>No data available.</Typography>
                  )}
                </Box>
              </Paper>
            </Grid>

            {moodData.length > 0 && moodData.some(m => m.anxiety_level !== undefined) && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: '#fcf8f8' }}>
                    <Typography variant="subtitle1" fontWeight={600} align="center" sx={{ mb: 1 }}>Anxiety Level</Typography>
                    <Box sx={{ height: 200 }}>
                      {loadingMood ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>
                      ) : (
                        <Line data={anxietyChartData} options={chartOptions} />
                      )}
                    </Box>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: '#f8f8fc' }}>
                    <Typography variant="subtitle1" fontWeight={600} align="center" sx={{ mb: 1 }}>Sleep Quality</Typography>
                    <Box sx={{ height: 200 }}>
                      {loadingMood ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>
                      ) : (
                        <Line data={sleepChartData} options={chartOptions} />
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </>
            )}
          </Grid>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoStoriesIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>Summaries & Patterns</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small">
                <Select value={summaryPeriod} onChange={(e) => setSummaryPeriod(e.target.value as any)} sx={{ borderRadius: 2 }}>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchSummaryAndPatterns}>Refresh</Button>
            </Box>
          </Box>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>Period Summary</Typography>
              {loadingSummary ? <CircularProgress size={24} /> : (
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>{summaryText || "No summary available."}</Typography>
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>Behavioral Patterns</Typography>
              {loadingSummary ? <CircularProgress size={24} /> : (
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>{patternText || "No patterns detected."}</Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Fade >
  );
}
