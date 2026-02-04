import { Box, Typography, IconButton, Chip, ImageList, ImageListItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Journal } from "../../graphql/journals";

interface JournalDetailProps {
    journal: Journal;
    onEdit: () => void;
    onDelete: () => void;
}

export default function JournalDetail({
    journal,
    onEdit,
    onDelete,
}: JournalDetailProps) {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const getFontFamily = (fontType?: string) => {
        switch (fontType) {
            case "serif":
                return "'Georgia', serif";
            case "mono":
                return "'Roboto Mono', monospace";
            case "handwriting":
                return "'Dancing Script', cursive";
            default:
                return "'Roboto', sans-serif";
        }
    };

    // Parse body content for formatting
    const renderBody = () => {
        const lines = journal.body.split("\n");
        return lines.map((line, index) => {
            // Check for bullet points
            if (line.trim().startsWith("• ") || line.trim().startsWith("- ")) {
                return (
                    <Box key={index} sx={{ display: "flex", pl: 2, mb: 0.5 }}>
                        <Typography sx={{ mr: 1 }}>•</Typography>
                        <Typography
                            sx={{
                                fontFamily: getFontFamily(journal.fontSettings?.body),
                            }}
                        >
                            {line.trim().substring(2)}
                        </Typography>
                    </Box>
                );
            }

            // Check for headings (lines starting with #)
            if (line.trim().startsWith("# ")) {
                return (
                    <Typography
                        key={index}
                        variant="h5"
                        sx={{
                            mt: 2,
                            mb: 1,
                            fontWeight: 600,
                            fontFamily: getFontFamily(journal.fontSettings?.heading),
                        }}
                    >
                        {line.trim().substring(2)}
                    </Typography>
                );
            }

            if (line.trim().startsWith("## ")) {
                return (
                    <Typography
                        key={index}
                        variant="h6"
                        sx={{
                            mt: 1.5,
                            mb: 0.5,
                            fontWeight: 500,
                            fontFamily: getFontFamily(journal.fontSettings?.subheading),
                        }}
                    >
                        {line.trim().substring(3)}
                    </Typography>
                );
            }

            // Check for monospace (backticks)
            if (line.includes("`")) {
                const parts = line.split(/(`[^`]+`)/g);
                return (
                    <Typography key={index} sx={{ mb: 0.5 }}>
                        {parts.map((part, i) =>
                            part.startsWith("`") && part.endsWith("`") ? (
                                <Box
                                    key={i}
                                    component="span"
                                    sx={{
                                        fontFamily: getFontFamily("mono"),
                                        bgcolor: "grey.100",
                                        px: 0.5,
                                        borderRadius: 0.5,
                                    }}
                                >
                                    {part.slice(1, -1)}
                                </Box>
                            ) : (
                                <Box
                                    key={i}
                                    component="span"
                                    sx={{ fontFamily: getFontFamily(journal.fontSettings?.body) }}
                                >
                                    {part}
                                </Box>
                            )
                        )}
                    </Typography>
                );
            }

            // Regular paragraph
            return (
                <Typography
                    key={index}
                    sx={{
                        mb: 0.5,
                        fontFamily: getFontFamily(journal.fontSettings?.body),
                    }}
                >
                    {line || "\u00A0"}
                </Typography>
            );
        });
    };

    return (
        <Box sx={{ height: "100%", overflow: "auto", p: 3 }}>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 3,
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{
                            mb: 1,
                            fontFamily: getFontFamily(journal.fontSettings?.heading),
                        }}
                    >
                        {journal.topic}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatDate(journal.createdAt)}
                    </Typography>
                </Box>
                <Box>
                    <IconButton onClick={onEdit} color="primary">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={onDelete} color="error">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Font Settings Chips */}
            {journal.fontSettings && (
                <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
                    {journal.fontSettings.heading && (
                        <Chip
                            size="small"
                            label={`Heading: ${journal.fontSettings.heading}`}
                            variant="outlined"
                        />
                    )}
                    {journal.fontSettings.body && (
                        <Chip
                            size="small"
                            label={`Body: ${journal.fontSettings.body}`}
                            variant="outlined"
                        />
                    )}
                </Box>
            )}

            {/* Body */}
            <Box sx={{ mb: 4 }}>{renderBody()}</Box>

            {/* Images Gallery */}
            {journal.images.length > 0 && (
                <Box>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        Attached Images
                    </Typography>
                    <ImageList cols={3} gap={12}>
                        {journal.images.map((image) => (
                            <ImageListItem key={image.id}>
                                <img
                                    src={`http://localhost:4000${image.url}`}
                                    alt=""
                                    loading="lazy"
                                    style={{
                                        borderRadius: 8,
                                        objectFit: "cover",
                                        aspectRatio: "1",
                                    }}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box>
            )}
        </Box>
    );
}
