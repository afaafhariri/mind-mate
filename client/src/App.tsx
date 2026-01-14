import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function App() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          className="text-3xl font-bold text-blue-600"
        >
          Mind Mate
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          React + TS + Tailwind + MUI
        </Typography>
        <Box className="mt-8 p-6 bg-white rounded-lg shadow-md w-full">
          <Typography paragraph>
            Welcome to the rewritten client. This setup uses Material UI for
            components and Tailwind CSS for utility styling.
          </Typography>
          <Button
            variant="contained"
            className="bg-blue-500 hover:bg-blue-700 w-full"
          >
            Get Started
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
