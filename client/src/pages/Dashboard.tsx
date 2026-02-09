import { useQuery } from "@apollo/client/react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Skeleton,
} from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
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

  // Calculate streak (consecutive days with journals)
  const calculateStreak = () => {
    if (journals.length === 0) return 0;
    const sortedDates = [...new Set(
      journals.map((j) => new Date(j.createdAt).toDateString())
    )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      if (sortedDates[i] === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak();

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
            Here's your journaling overview
          </Typography>
        </Box>
        <LiveClock />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Journal Count Card */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
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
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #0288d1 0%, #4fc3f7 100%)",
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

        {/* Streak Card */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <InsightsIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h3" fontWeight={700}>
              {journalsLoading ? <Skeleton width={60} /> : `${streak} day${streak !== 1 ? "s" : ""}`}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Current Streak
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Coming Soon Section */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={2}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: "center",
            }}
          >
            <InsightsIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Mental Health Insights Coming Soon
            </Typography>
            <Typography color="text.secondary">
              AI-powered mood analysis and wellness tracking will be available in a future update.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
