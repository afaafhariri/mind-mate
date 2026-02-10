
import React, { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    CircularProgress,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SendIcon from "@mui/icons-material/Send";
import { RagService } from "../services/ragService";

export default function Chat() {
    // Chat State
    const [query, setQuery] = useState("");
    const [chatHistory, setChatHistory] = useState<{ type: "user" | "ai"; text: string }[]>([]);
    const [chatLoading, setChatLoading] = useState(false);

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

    return (
        <Container maxWidth="lg" sx={{ height: "85vh", display: "flex", flexDirection: "column", py: 2 }}>

            <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
                <AutoAwesomeIcon color="primary" sx={{ fontSize: 32 }} />
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                    Chat with Mind Mate
                </Typography>
            </Box>

            <Paper sx={{ flexGrow: 1, display: "flex", flexDirection: "column", borderRadius: 3, overflow: "hidden", boxShadow: 3 }}>
                <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3 }}>
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
            </Paper>
        </Container>
    );
}
