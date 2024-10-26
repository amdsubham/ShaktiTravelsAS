import React, { useState, useEffect } from "react";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
} from "@mui/material";

const ContactForm = ({ open, handleClose, handleSubmit, initialData }) => {
    const [name, setName] = useState(initialData?.name || "");
    const [email, setEmail] = useState(initialData?.email || "");
    const [phone, setPhone] = useState(initialData?.phone || "");
    const [message, setMessage] = useState(initialData?.message || "");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setEmail(initialData.email);
            setPhone(initialData.phone);
            setMessage(initialData.message);
        } else {
            setName("");
            setEmail("");
            setPhone("");
            setMessage("");
        }
    }, [initialData]);

    const handleFormSubmit = async () => {
        setLoading(true);
        await handleSubmit({ name, email, phone, message });
        setLoading(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{initialData ? "Edit Contact" : "Create Contact"}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Phone"
                    type="text"
                    fullWidth
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Message"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleFormSubmit} color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : initialData ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ContactForm;
