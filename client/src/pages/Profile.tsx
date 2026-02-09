import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
    Avatar,
    Divider,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import {
    ME,
    UPDATE_USER,
    REQUEST_EMAIL_CHANGE,
    CONFIRM_EMAIL_CHANGE,
    type User,
    type UpdateUserInput,
} from "../graphql/user";

export default function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UpdateUserInput>({});
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({ open: false, message: "", severity: "success" });

    // Email change state
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");

    const { data, loading, error, refetch } = useQuery<{ me: User }>(ME);

    const [updateUser, { loading: updating }] = useMutation(UPDATE_USER, {
        onCompleted: () => {
            setSnackbar({ open: true, message: "Profile updated successfully", severity: "success" });
            setIsEditing(false);
            refetch();
        },
        onError: (err) => {
            setSnackbar({ open: true, message: err.message, severity: "error" });
        },
    });

    const [requestEmailChange, { loading: requestingEmail }] = useMutation<{ requestEmailChange: string }>(REQUEST_EMAIL_CHANGE, {
        onCompleted: (res) => {
            setSnackbar({ open: true, message: res.requestEmailChange, severity: "success" });
            setOtpSent(true);
        },
        onError: (err) => {
            setSnackbar({ open: true, message: err.message, severity: "error" });
        },
    });

    const [confirmEmailChange, { loading: confirmingEmail }] = useMutation(CONFIRM_EMAIL_CHANGE, {
        onCompleted: () => {
            setSnackbar({ open: true, message: "Email updated successfully", severity: "success" });
            setEmailDialogOpen(false);
            setOtpSent(false);
            setNewEmail("");
            setOtp("");
            refetch();
        },
        onError: (err) => {
            setSnackbar({ open: true, message: err.message, severity: "error" });
        },
    });

    useEffect(() => {
        if (data?.me) {
            setFormData({
                firstName: data.me.firstName,
                lastName: data.me.lastName,
                dateOfBirth: data.me.dateOfBirth || "",
                city: data.me.city || "",
                country: data.me.country || "",
                profession: data.me.profession || "",
                maritalStatus: data.me.maritalStatus || "",
            });
        }
    }, [data]);

    const handleSave = () => {
        updateUser({ variables: { input: formData } });
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (data?.me) {
            setFormData({
                firstName: data.me.firstName,
                lastName: data.me.lastName,
                dateOfBirth: data.me.dateOfBirth || "",
                city: data.me.city || "",
                country: data.me.country || "",
                profession: data.me.profession || "",
                maritalStatus: data.me.maritalStatus || "",
            });
        }
    };

    const handleRequestEmailChange = () => {
        if (newEmail) {
            requestEmailChange({ variables: { newEmail } });
        }
    };

    const handleConfirmEmailChange = () => {
        if (newEmail && otp) {
            confirmEmailChange({ variables: { newEmail, otp } });
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">Failed to load profile: {error.message}</Alert>
            </Box>
        );
    }

    const user = data?.me;

    return (
        <Box sx={{ maxWidth: 800, mx: "auto" }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Profile
            </Typography>

            <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
                {/* Profile Header */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                    <Avatar
                        sx={{
                            width: 100,
                            height: 100,
                            bgcolor: "primary.main",
                            fontSize: 40,
                            mr: 3,
                        }}
                    >
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" fontWeight={600}>
                            {user?.firstName} {user?.lastName}
                        </Typography>
                        <Typography color="text.secondary">{user?.email}</Typography>
                        <Button
                            size="small"
                            onClick={() => setEmailDialogOpen(true)}
                            sx={{ mt: 1, textTransform: "none" }}
                        >
                            Change Email
                        </Button>
                    </Box>
                    {!isEditing ? (
                        <IconButton onClick={() => setIsEditing(true)} color="primary">
                            <EditIcon />
                        </IconButton>
                    ) : (
                        <Box>
                            <IconButton onClick={handleSave} color="primary" disabled={updating}>
                                <SaveIcon />
                            </IconButton>
                            <IconButton onClick={handleCancel} color="default">
                                <CancelIcon />
                            </IconButton>
                        </Box>
                    )}
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Profile Fields */}
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="First Name"
                            value={formData.firstName || ""}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            disabled={!isEditing}
                            InputProps={{ startAdornment: <PersonIcon sx={{ mr: 1, color: "text.secondary" }} /> }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            value={formData.lastName || ""}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            disabled={!isEditing}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Date of Birth"
                            value={formData.dateOfBirth || ""}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            disabled={!isEditing}
                            placeholder="YYYY-MM-DD"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Profession"
                            value={formData.profession || ""}
                            onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                            disabled={!isEditing}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="City"
                            value={formData.city || ""}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            disabled={!isEditing}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Country"
                            value={formData.country || ""}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            disabled={!isEditing}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Marital Status"
                            value={formData.maritalStatus || ""}
                            onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                            disabled={!isEditing}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Email Change Dialog */}
            <Dialog open={emailDialogOpen} onClose={() => setEmailDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Change Email Address</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="New Email Address"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        disabled={otpSent}
                        sx={{ mt: 2 }}
                    />
                    {otpSent && (
                        <TextField
                            fullWidth
                            label="Verification Code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            sx={{ mt: 2 }}
                            placeholder="Enter the code sent to your new email"
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setEmailDialogOpen(false); setOtpSent(false); setNewEmail(""); setOtp(""); }}>
                        Cancel
                    </Button>
                    {!otpSent ? (
                        <Button
                            variant="contained"
                            onClick={handleRequestEmailChange}
                            disabled={!newEmail || requestingEmail}
                        >
                            {requestingEmail ? "Sending..." : "Send Verification Code"}
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleConfirmEmailChange}
                            disabled={!otp || confirmingEmail}
                        >
                            {confirmingEmail ? "Confirming..." : "Confirm Change"}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
