import React, { useState, useEffect } from "react";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    IconButton,
    Input,
    Typography,
} from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const ServiceForm = ({ open, handleClose, handleSubmit, initialData }) => {
    const [title, setTitle] = useState(initialData?.title || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [image, setImage] = useState(initialData?.image || "");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    const storage = getStorage();

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || ""); // Ensure fallback for undefined values
            setContent(initialData.content || "");
            setImage(initialData.image || "");
        } else {
            setTitle("");
            setContent("");
            setImage("");
        }
    }, [initialData]);

    const handleFormSubmit = async () => {
        if (uploading) return; // Prevent form submission during image upload

        setLoading(true);
        await handleSubmit({ title, content, image });
        setLoading(false);
    };

    const handleImageUpload = (file) => {
        const storageRef = ref(storage, `services/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        setUploading(true);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Progress can be shown if needed
            },
            (error) => {
                console.error("Image upload error:", error);
                setUploading(false);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                setImage(downloadURL); // Save image URL to state
                setUploading(false);
            }
        );
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            handleImageUpload(file);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{initialData ? "Edit Service" : "Create Service"}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Title"
                    type="text"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Content"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div style={{ marginTop: "16px" }}>
                    <Typography variant="subtitle1">Upload Image</Typography>
                    <Input
                        accept="image/*"
                        id="upload-image"
                        type="file"
                        onChange={handleImageChange}
                        disabled={uploading}
                    />
                    {uploading && <CircularProgress size={24} />}
                    {image && (
                        <Typography variant="body2" style={{ marginTop: "8px" }}>
                            Uploaded Image: <a href={image} target="_blank" rel="noopener noreferrer">View Image</a>
                        </Typography>
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleFormSubmit} color="primary" disabled={loading || uploading}>
                    {loading ? <CircularProgress size={24} /> : initialData ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ServiceForm;
