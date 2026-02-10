
import React, { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Tabs,
    Tab,
    CircularProgress,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SendIcon from "@mui/icons-material/Send";
import { RagService } from "../services/ragService";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            {...other}
            style={{ height: "100%", overflowY: "auto" }}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function Chat() {
    const [value, setValue] = useState(0);

    // Chat State
    const [query, setQuery] = useState("");
    const [chatHistory, setChatHistory] = useState<{ type: "user" | "ai"; text: string }[]>([]);
    const [chatLoading, setChatLoading] = useState(false);

    // Analysis State
    const [analysisResult, setAnalysisResult] = useState("");
    const [analysisLoading, setAnalysisLoading] = useState(false);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        setAnalysisResult(""); // Clear analysis on tab switch
    };

    const handleChat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        const userMessage = query;
        setChatHistory((prev) => [...prev, { type: "user", text: userMessage }]);
        setQuery("");
        setChatLoading(true);

        try {
            const response = await RagService.chat(userMessage);
            setChatHistory((prev) => [...prev, { type: "ai", text: response }]);
        } catch (error) {
            console.error(error);
            setChatHistory((prev) => [...prev, { type: "ai", text: "Sorry, I couldn't process that request." }]);
        } finally {
            setChatLoading(false);
        }
    };

    const handleAnalysis = async (type: "weekly" | "monthly" | "yearly" | "pattern" | "mood") => {
        setAnalysisLoading(true);
        setAnalysisResult("");
        try {
            let result = "";
            switch (type) {
                case "weekly":
                case "monthly":
                case "yearly":
                    result = await RagService.getSummary(type);
                    break;
                case "pattern":
                    result = await RagService.analyzePatterns();
                    break;
                case "mood":
                    result = await RagService.analyzeMood();
                    break;
            }
            setAnalysisResult(result);
        } catch (error) {
            setAnalysisResult("Failed to generate analysis.");
        } finally {
            setAnalysisLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ height: "85vh", display: "flex", flexDirection: "column", py: 2 }}>

            <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
                <AutoAwesomeIcon color="primary" sx={{ fontSize: 32 }} />
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                    AI Insights
                </Typography>
            </Box>

            <Paper sx={{ flexGrow: 1, display: "flex", flexDirection: "column", borderRadius: 3, overflow: "hidden", boxShadow: 3 }}>
                <Tabs value={value} onChange={handleChange} centered sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "white" }}>
                    <Tab label="Chat" />
                    <Tab label="Summaries" />
                    <Tab label="Patterns" />
                    <Tab label="Mood" />
                </Tabs>

                {/* Chat Tab */}
                <TabPanel value={value} index={0}>
                    <Box sx={{ display: "flex", flexDirection: "column", height: "60vh" }}>
                        <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 2, display: "flex", flexDirection: "column", gap: 2, px: 1 }}>
                            {chatHistory.length === 0 && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.6 }}>
                                    <AutoAwesomeIcon sx={{ fontSize: 48, mb: 2 }} />
                                    <Typography variant="h6" align="center">
                                        Ask me anything about your journals!
                                    </Typography>
                                    <Typography variant="body2" align="center">
                                        "What did I learn last week?"
                                    </Typography>
                                </Box>
                            )}
                            {chatHistory.map((msg, index) => (
                                <Paper
                                    key={index}
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        maxWidth: "70%",
                                        alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
                                        bgcolor: msg.type === "user" ? "primary.main" : "grey.100",
                                        color: msg.type === "user" ? "white" : "text.primary",
                                        borderRadius: 2,
                                        borderBottomRightRadius: msg.type === "user" ? 0 : 2,
                                        borderBottomLeftRadius: msg.type === "ai" ? 0 : 2,
                                    }}
                                >
                                    <Typography variant="body1">{msg.text}</Typography>
                                </Paper>
                            ))}
                            {chatLoading && <CircularProgress size={24} sx={{ alignSelf: "center" }} />}
                        </Box>
                        <form onSubmit={handleChat} style={{ display: "flex", gap: "10px", marginTop: "auto" }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Type your question..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                size="medium"
                                InputProps={{
                                    sx: { borderRadius: 2 }
                                }}
                            />
                            <Button type="submit" variant="contained" endIcon={<SendIcon />} sx={{ borderRadius: 2, px: 3 }}>
                                Send
                            </Button>
                        </form>
                    </Box>
                </TabPanel>

                {/* Summaries Tab */}
                <TabPanel value={value} index={1}>
                    <Box sx={{ display: "flex", gap: 2, mb: 4, justifyContent: "center" }}>
                        <Button variant={analysisResult && !analysisLoading ? "outlined" : "contained"} onClick={() => handleAnalysis("weekly")}>Weekly Session</Button>
                        <Button variant={analysisResult && !analysisLoading ? "outlined" : "contained"} onClick={() => handleAnalysis("monthly")}>Monthly Recap</Button>
                        <Button variant={analysisResult && !analysisLoading ? "outlined" : "contained"} onClick={() => handleAnalysis("yearly")}>Yearly Overview</Button>
                    </Box>
                    {analysisLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="40vh">
                            <CircularProgress />
                            <Typography sx={{ ml: 2 }}>Generating summary...</Typography>
                        </Box>
                    ) : (
                        <Paper elevation={0} sx={{ p: 3, bgcolor: "grey.50", borderRadius: 2, minHeight: "40vh" }}>
                            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                                {analysisResult || "Select a summary type to generate insights from your journals in that period."}
                            </Typography>
                        </Paper>
                    )}
                </TabPanel>

                {/* Patterns Tab */}
                <TabPanel value={value} index={2}>
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                        <Button variant="contained" size="large" onClick={() => handleAnalysis("pattern")} startIcon={<AutoAwesomeIcon />}>
                            Analyze Recurring Patterns
                        </Button>
                        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                            Analyzes your last 30 days of entries
                        </Typography>
                    </Box>
                    {analysisLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="40vh">
                            <CircularProgress />
                            <Typography sx={{ ml: 2 }}>Analyzing patterns...</Typography>
                        </Box>
                    ) : (
                        <Paper elevation={0} sx={{ p: 3, bgcolor: "grey.50", borderRadius: 2, minHeight: "40vh" }}>
                            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                                {analysisResult || "Click to identify deep behavioral patterns, triggers, and recurring themes in your recent journals."}
                            </Typography>
                        </Paper>
                    )}
                </TabPanel>

                {/* Mood Tab */}
                <TabPanel value={value} index={3}>
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                        <Button variant="contained" color="secondary" size="large" onClick={() => handleAnalysis("mood")} startIcon={<AutoAwesomeIcon />}>
                            Analyze Mood & Triggers
                        </Button>
                        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                            Analyzes emotional trends over 30 days
                        </Typography>
                    </Box>
                    {analysisLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="40vh">
                            <CircularProgress />
                            <Typography sx={{ ml: 2 }}>Analyzing mood...</Typography>
                        </Box>
                    ) : (
                        <Paper elevation={0} sx={{ p: 3, bgcolor: "grey.50", borderRadius: 2, minHeight: "40vh" }}>
                            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                                {analysisResult || "Click to understand your emotional baseline, what brings you joy, and what causes stress."}
                            </Typography>
                        </Paper>
                    )}
                </TabPanel>

            </Paper>
        </Container>
    );
}
