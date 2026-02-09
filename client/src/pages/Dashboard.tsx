import { useQuery } from "@apollo/client/react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  Skeleton,
} from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import InsightsIcon from "@mui/icons-material/Insights";
import LiveClock from "../components/LiveClock";
import { ME, type User } from "../graphql/user";
import { GET_JOURNALS, type Journal } from "../graphql/journals";

export default function Dashboard() {
  const { data: userData, loading: userLoading } = useQuery<{ me: User }>(ME);
  const { data: journalData, loading: journalsLoading } = useQuery<{
    getJournals: Journal[];
  }>(GET_JOURNALS);

  const user = userData?.me;
  const journals = journalData?.getJournals || [];

  // Calculate stats
  const totalJournals = journals.length;
  const thisWeekJournals = journals.filter((j) => {
    const journalDate = new Date(j.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return journalDate >= weekAgo;
  }).length;

  // Mock mental health score (will be replaced with RAG analysis)
  const mentalHealthScore = 78;
  const moodTrend = "Improving";

  return (
    <Box>
      {/* Header with Greeting and Clock */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
        }}
      >
        <Box>
          {userLoading ? (
            <Skeleton variant="text" width={300} height={48} />
          ) : (
            <Typography variant="h4" fontWeight={700}>
              Welcome back, {user?.firstName}! 👋
            </Typography>
          )}
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Here's your mental wellness overview
          </Typography>
        </Box>
        <LiveClock />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Journal Count Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <AutoStoriesIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h3" fontWeight={700}>
              {journalsLoading ? <Skeleton width={60} /> : totalJournals}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total Journals
            </Typography>
          </Paper>
        </Grid>

        {/* This Week Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <TrendingUpIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h3" fontWeight={700}>
              {journalsLoading ? <Skeleton width={60} /> : thisWeekJournals}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Journals This Week
            </Typography>
          </Paper>
        </Grid>

        {/* Mental Health Score Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <SentimentSatisfiedAltIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h3" fontWeight={700}>
              {mentalHealthScore}%
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Wellness Score
            </Typography>
          </Paper>
        </Grid>

        {/* Mood Trend Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <InsightsIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h3" fontWeight={700}>
              {moodTrend}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Mood Trend
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Mood Over Time Chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              height: 350,
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Mood Trend Over Time
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Your emotional wellness journey based on journal analysis
            </Typography>
            {/* Placeholder for chart - will be powered by RAG */}
            <Box
              sx={{
                height: 250,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "grey.50",
                borderRadius: 2,
                border: "2px dashed",
                borderColor: "grey.300",
              }}
            >
              <InsightsIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
              <Typography color="text.secondary">
                Chart will be powered by RAG analysis
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Write more journals to see your mood trends
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              height: 350,
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Wellness Breakdown
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                >
                  <Typography variant="body2">Emotional Balance</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    72%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={72}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "grey.200",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#667eea",
                    },
                  }}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                >
                  <Typography variant="body2">Stress Level</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    Low
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={28}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "grey.200",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#43e97b",
                    },
                  }}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                >
                  <Typography variant="body2">Journaling Consistency</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    85%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={85}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "grey.200",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#f5576c",
                    },
                  }}
                />
              </Box>
              <Box>
                <Box
                  sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                >
                  <Typography variant="body2">Self-awareness</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    68%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={68}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "grey.200",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#4facfe",
                    },
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
