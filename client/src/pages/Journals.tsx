import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
    Box,
    Typography,
    Button,
    Paper,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import JournalCard from "../components/journals/JournalCard";
import JournalDetail from "../components/journals/JournalDetail";
import JournalEditor from "../components/journals/JournalEditor";
import {
    GET_JOURNALS,
    CREATE_JOURNAL,
    UPDATE_JOURNAL,
    DELETE_JOURNAL,
    type Journal,
    type JournalInput,
} from "../graphql/journals";

export default function Journals() {
    const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
    const [editorOpen, setEditorOpen] = useState(false);
    const [editingJournal, setEditingJournal] = useState<Journal | undefined>();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const { data, loading, error } = useQuery<{ getJournals: Journal[] }>(GET_JOURNALS);

    const [createJournal, { loading: creating }] = useMutation(CREATE_JOURNAL, {
        refetchQueries: [{ query: GET_JOURNALS }],
        onCompleted: () => {
            setEditorOpen(false);
            setEditingJournal(undefined);
        },
    });

    const [updateJournal, { loading: updating }] = useMutation<{ updateJournal: Journal }>(UPDATE_JOURNAL, {
        refetchQueries: [{ query: GET_JOURNALS }],
        onCompleted: (data) => {
            setEditorOpen(false);
            setEditingJournal(undefined);
            setSelectedJournal(data.updateJournal);
        },
    });

    const [deleteJournal, { loading: deleting }] = useMutation(DELETE_JOURNAL, {
        refetchQueries: [{ query: GET_JOURNALS }],
        onCompleted: () => {
            setDeleteDialogOpen(false);
            setSelectedJournal(null);
        },
    });

    const handleCreate = () => {
        setEditingJournal(undefined);
        setEditorOpen(true);
    };

    const handleEdit = () => {
        if (selectedJournal) {
            setEditingJournal(selectedJournal);
            setEditorOpen(true);
        }
    };

    const handleDelete = () => {
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedJournal) {
            deleteJournal({ variables: { id: selectedJournal.id } });
        }
    };

    const handleSave = (input: JournalInput) => {
        if (editingJournal) {
            updateJournal({ variables: { id: editingJournal.id, input } });
        } else {
            createJournal({ variables: { input } });
        }
    };

    const journals = data?.getJournals || [];

    return (
        <Box sx={{ display: "flex", height: "calc(100vh - 48px)", gap: 3 }}>
            {/* Left Panel - Journal List */}
            <Paper
                elevation={0}
                sx={{
                    width: 400,
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "transparent",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                    }}
                >
                    <Typography variant="h5" fontWeight={700}>
                        My Journals
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                        sx={{ borderRadius: 2 }}
                    >
                        New
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">Failed to load journals</Typography>
                ) : journals.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: "center",
                            py: 8,
                            px: 3,
                        }}
                    >
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                            No journals yet
                        </Typography>
                        <Typography color="text.disabled" sx={{ mb: 3 }}>
                            Start writing to capture your thoughts and memories
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleCreate}
                        >
                            Create Your First Journal
                        </Button>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            flex: 1,
                            overflow: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            pr: 1,
                        }}
                    >
                        {journals.map((journal) => (
                            <JournalCard
                                key={journal.id}
                                journal={journal}
                                isSelected={selectedJournal?.id === journal.id}
                                onClick={() => setSelectedJournal(journal)}
                            />
                        ))}
                    </Box>
                )}
            </Paper>

            {/* Right Panel - Journal Detail */}
            <Paper
                elevation={2}
                sx={{
                    flex: 1,
                    borderRadius: 3,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {selectedJournal ? (
                    <JournalDetail
                        journal={selectedJournal}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            color: "text.secondary",
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Select a journal to view
                        </Typography>
                        <Typography color="text.disabled">
                            Click on any journal from the list to see its contents
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* Floating Action Button (Mobile) */}
            <Fab
                color="primary"
                onClick={handleCreate}
                sx={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    display: { xs: "flex", sm: "none" },
                }}
            >
                <AddIcon />
            </Fab>

            {/* Journal Editor Modal */}
            <JournalEditor
                open={editorOpen}
                onClose={() => {
                    setEditorOpen(false);
                    setEditingJournal(undefined);
                }}
                onSave={handleSave}
                journal={editingJournal}
                loading={creating || updating}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Journal</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete "{selectedJournal?.topic}"? This
                        action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={confirmDelete}
                        color="error"
                        variant="contained"
                        disabled={deleting}
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
