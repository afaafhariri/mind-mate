import { useState, useRef } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    IconButton,
    ToggleButtonGroup,
    ToggleButton,
    Tooltip,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    ImageList,
    ImageListItem,
    ImageListItemBar,
} from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import TitleIcon from "@mui/icons-material/Title";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CodeIcon from "@mui/icons-material/Code";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import type { Journal, JournalInput } from "../../graphql/journals";

interface JournalEditorProps {
    open: boolean;
    onClose: () => void;
    onSave: (input: JournalInput) => void;
    journal?: Journal;
    loading?: boolean;
}

const fontOptions = [
    { value: "sans-serif", label: "Sans Serif" },
    { value: "serif", label: "Serif" },
    { value: "mono", label: "Monospace" },
    { value: "handwriting", label: "Handwriting" },
];

export default function JournalEditor({
    open,
    onClose,
    onSave,
    journal,
    loading,
}: JournalEditorProps) {
    const [topic, setTopic] = useState(journal?.topic || "");
    const [body, setBody] = useState(journal?.body || "");
    const [fontHeading, setFontHeading] = useState(
        journal?.fontSettings?.heading || "sans-serif"
    );
    const [fontBody, setFontBody] = useState(
        journal?.fontSettings?.body || "sans-serif"
    );
    const [images, setImages] = useState<string[]>(
        journal?.images.map((img) => img.url) || []
    );
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleFormat = (type: string) => {
        const textArea = textAreaRef.current;
        if (!textArea) return;

        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        const selectedText = body.substring(start, end);

        let newText = "";
        let cursorOffset = 0;

        switch (type) {
            case "heading":
                newText = `\n# ${selectedText || "Heading"}\n`;
                cursorOffset = 3;
                break;
            case "subheading":
                newText = `\n## ${selectedText || "Subheading"}\n`;
                cursorOffset = 4;
                break;
            case "bullet":
                newText = `\n• ${selectedText || "List item"}`;
                cursorOffset = 3;
                break;
            case "mono":
                newText = `\`${selectedText || "code"}\``;
                cursorOffset = 1;
                break;
            default:
                return;
        }

        const newBody =
            body.substring(0, start) + newText + body.substring(end);
        setBody(newBody);

        // Set cursor position after format
        setTimeout(() => {
            textArea.focus();
            const newPos = start + cursorOffset;
            textArea.setSelectionRange(newPos, newPos + selectedText.length || newPos);
        }, 0);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const uploadedUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append("file", files[i]);

            try {
                const response = await fetch("http://localhost:4000/api/media/upload", {
                    method: "POST",
                    body: formData,
                });
                const data = await response.json();
                if (data.url) {
                    uploadedUrls.push(data.url);
                }
            } catch (error) {
                console.error("Upload failed:", error);
            }
        }

        setImages([...images, ...uploadedUrls]);
        setUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        onSave({
            topic,
            body,
            fontHeading,
            fontSubheading: fontHeading,
            fontBody,
            fontMono: "mono",
            imageUrls: images,
        });
    };

    const isValid = topic.trim().length > 0 && body.trim().length > 0;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3, minHeight: "70vh" },
            }}
        >
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" fontWeight={600}>
                    {journal ? "Edit Journal" : "New Journal"}
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {/* Topic */}
                <TextField
                    fullWidth
                    label="Topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="What's on your mind?"
                    sx={{ mb: 3 }}
                    variant="outlined"
                />

                {/* Font Settings */}
                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Heading Font</InputLabel>
                        <Select
                            value={fontHeading}
                            label="Heading Font"
                            onChange={(e) => setFontHeading(e.target.value)}
                        >
                            {fontOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Body Font</InputLabel>
                        <Select
                            value={fontBody}
                            label="Body Font"
                            onChange={(e) => setFontBody(e.target.value)}
                        >
                            {fontOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Formatting Toolbar */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                        p: 1,
                        bgcolor: "grey.50",
                        borderRadius: 2,
                    }}
                >
                    <ToggleButtonGroup size="small">
                        <Tooltip title="Heading">
                            <ToggleButton value="heading" onClick={() => handleFormat("heading")}>
                                <TitleIcon />
                            </ToggleButton>
                        </Tooltip>
                        <Tooltip title="Subheading">
                            <ToggleButton value="subheading" onClick={() => handleFormat("subheading")}>
                                <FormatBoldIcon />
                            </ToggleButton>
                        </Tooltip>
                        <Tooltip title="Bullet Point">
                            <ToggleButton value="bullet" onClick={() => handleFormat("bullet")}>
                                <FormatListBulletedIcon />
                            </ToggleButton>
                        </Tooltip>
                        <Tooltip title="Monospace">
                            <ToggleButton value="mono" onClick={() => handleFormat("mono")}>
                                <CodeIcon />
                            </ToggleButton>
                        </Tooltip>
                    </ToggleButtonGroup>

                    <Box sx={{ flexGrow: 1 }} />

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                    />
                    <Button
                        startIcon={<ImageIcon />}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        variant="outlined"
                        size="small"
                    >
                        {uploading ? "Uploading..." : "Add Images"}
                    </Button>
                </Box>

                {/* Body */}
                <TextField
                    fullWidth
                    multiline
                    minRows={10}
                    maxRows={20}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Start writing your journal entry..."
                    inputRef={textAreaRef}
                    sx={{
                        mb: 3,
                        "& .MuiInputBase-input": {
                            fontFamily:
                                fontBody === "mono"
                                    ? "'Roboto Mono', monospace"
                                    : fontBody === "serif"
                                        ? "'Georgia', serif"
                                        : "'Roboto', sans-serif",
                        },
                    }}
                />

                {/* Image Preview */}
                {images.length > 0 && (
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Attached Images ({images.length})
                        </Typography>
                        <ImageList cols={4} gap={8}>
                            {images.map((url, index) => (
                                <ImageListItem key={index}>
                                    <img
                                        src={`http://localhost:4000${url}`}
                                        alt=""
                                        loading="lazy"
                                        style={{
                                            borderRadius: 8,
                                            objectFit: "cover",
                                            aspectRatio: "1",
                                        }}
                                    />
                                    <ImageListItemBar
                                        position="top"
                                        sx={{ background: "transparent" }}
                                        actionIcon={
                                            <IconButton
                                                size="small"
                                                onClick={() => removeImage(index)}
                                                sx={{
                                                    bgcolor: "error.main",
                                                    color: "white",
                                                    m: 0.5,
                                                    "&:hover": { bgcolor: "error.dark" },
                                                }}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        }
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={!isValid || loading}
                >
                    {loading ? "Saving..." : journal ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
