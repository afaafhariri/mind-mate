import { Box, Typography, Paper } from "@mui/material";
import type { Journal } from "../../graphql/journals";

interface JournalCardProps {
    journal: Journal;
    isSelected: boolean;
    onClick: () => void;
}

export default function JournalCard({
    journal,
    isSelected,
    onClick,
}: JournalCardProps) {
    const truncatedBody =
        journal.body.length > 100
            ? journal.body.substring(0, 100) + "..."
            : journal.body;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <Paper
            elevation={isSelected ? 4 : 1}
            onClick={onClick}
            sx={{
                display: "flex",
                p: 2,
                cursor: "pointer",
                borderRadius: 2,
                border: isSelected ? 2 : 1,
                borderColor: isSelected ? "primary.main" : "divider",
                bgcolor: isSelected ? "primary.50" : "background.paper",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 4,
                    borderColor: "primary.light",
                },
            }}
        >
            {/* Content */}
            <Box sx={{ flex: 1, minWidth: 0, pr: 2 }}>
                <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                        mb: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {journal.topic}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 1,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {truncatedBody}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                    {formatDate(journal.createdAt)}
                </Typography>
            </Box>

            {/* Stacked Images */}
            {journal.images.length > 0 && (
                <Box
                    sx={{
                        position: "relative",
                        width: 80,
                        height: 80,
                        flexShrink: 0,
                    }}
                >
                    {journal.images.slice(0, 3).map((image, index) => (
                        <Box
                            key={image.id}
                            component="img"
                            src={`http://localhost:4000${image.url}`}
                            alt=""
                            sx={{
                                position: "absolute",
                                width: 70,
                                height: 70,
                                objectFit: "cover",
                                borderRadius: 1.5,
                                border: "2px solid white",
                                boxShadow: 2,
                                top: index * 4,
                                left: index * 4,
                                zIndex: 3 - index,
                            }}
                        />
                    ))}
                    {journal.images.length > 3 && (
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                bgcolor: "primary.main",
                                color: "white",
                                px: 0.75,
                                py: 0.25,
                                borderRadius: 1,
                                fontSize: "0.7rem",
                                fontWeight: 600,
                            }}
                        >
                            +{journal.images.length - 3}
                        </Box>
                    )}
                </Box>
            )}
        </Paper>
    );
}
