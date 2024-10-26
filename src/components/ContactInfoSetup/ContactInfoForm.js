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

const ContactInfoForm = ({ open, handleClose, handleSubmit, initialData }) => {
    const [address, setAddress] = useState(initialData?.address || "");
    const [email, setEmail] = useState(initialData?.email || "");
    const [phone, setPhone] = useState(initialData?.phone || "");
    const [additionalNumber, setAdditionalNumber] = useState(initialData?.additionalNumber || "");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setAddress(initialData.address);
            setEmail(initialData.email);
            setPhone(initialData.phone);
            setAdditionalNumber(initialData.additionalNumber);
        } else {
            setAddress("");
            setEmail("");
            setPhone("");
            setAdditionalNumber("");
        }
    }, [initialData]);

    const handleFormSubmit = async () => {
        setLoading(true);
        await handleSubmit({ address, email, phone, additionalNumber });
        setLoading(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{initialData ? "Edit Contact Info" : "Create Contact Info"}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Address"
                    type="text"
                    fullWidth
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
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
                    label="Additional Number"
                    type="text"
                    fullWidth
                    value={additionalNumber}
                    onChange={(e) => setAdditionalNumber(e.target.value)}
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

export default ContactInfoForm;
