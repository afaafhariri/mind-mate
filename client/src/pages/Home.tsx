import { Typography, Paper, Grid } from "@mui/material";

export default function Home() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Welcome Back!
      </Typography>
      <Typography paragraph>Here is an overview of your activities.</Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              Recent Activity
            </Typography>
            <Typography component="div" variant="body1">
              - Logged in successfully
            </Typography>
            <Typography component="div" variant="body1">
              - Updated profile
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              Tasks
            </Typography>
            <Typography component="div" variant="body1">
              You have 0 pending tasks.
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              Stats
            </Typography>
            <Typography variant="h3" component="div">
              100%
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              Completion rate
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
