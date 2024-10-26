import React, { useState, useEffect } from "react";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    Input,
    Typography,
} from "@mui/material";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const PackageForm = ({ open, handleClose, handleSubmit, initialData }) => {
    const [title, setTitle] = useState(initialData?.title || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [price, setPrice] = useState(initialData?.price || "");
    const [image, setImage] = useState(initialData?.image || "");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const storage = getStorage();

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
            setPrice(initialData.price);
            setImage(initialData.image);
        } else {
            setTitle("");
            setContent("");
            setPrice("");
            setImage("");
        }
    }, [initialData]);

    const handleFormSubmit = async () => {
        if (uploading) return; // Prevent form submission during image upload

        setLoading(true);
        await handleSubmit({ title, content, price, image });
        setLoading(false);
    };

    const handleImageUpload = (file) => {
        const storageRef = ref(storage, `packages/${file.name}`);
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
            handleImageUpload(file);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{initialData ? "Edit Package" : "Create Package"}</DialogTitle>
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
                <TextField
                    margin="dense"
                    label="Price"
                    type="number"
                    fullWidth
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
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

export default PackageForm;
