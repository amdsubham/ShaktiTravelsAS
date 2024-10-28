import React, { useState, useEffect } from "react";
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    TablePagination,
    Button,
    IconButton,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Toolbar,
    Input,
    CircularProgress,
    DialogContentText,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { db, storage } from "../../firebase/firebase";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import imageCompression from 'browser-image-compression';

const TestimonialSetup = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [orderDirection, setOrderDirection] = useState("asc");
    const [orderByField, setOrderByField] = useState("authorName");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [open, setOpen] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(null);
    const [authorName, setAuthorName] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(""); // URL of the uploaded image
    const [loading, setLoading] = useState(false); // State for loading
    const [confirmOpen, setConfirmOpen] = useState(false); // Confirmation dialog state
    const [testimonialToDelete, setTestimonialToDelete] = useState(null); // State for testimonial to be deleted

    // Fetch testimonials from Firestore
    useEffect(() => {
        const fetchTestimonials = async () => {
            setLoading(true); // Start loading
            const querySnapshot = await getDocs(collection(db, "testimonials"));
            const fetchedTestimonials = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTestimonials(fetchedTestimonials);
            setLoading(false); // End loading
        };
        fetchTestimonials();
    }, []);

    const handleSort = (property) => {
        const isAsc = orderByField === property && orderDirection === "asc";
        setOrderDirection(isAsc ? "desc" : "asc");
        setOrderByField(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpen = (testimonial = null) => {
        setCurrentTestimonial(testimonial);
        setAuthorName(testimonial ? testimonial.authorName : "");
        setContent(testimonial ? testimonial.content : "");
        setImageUrl(testimonial ? testimonial.imageUrl : "");
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentTestimonial(null);
        setImage(null);
    };

    const handleSave = async () => {
        setLoading(true); // Start loading
        let uploadedImageUrl = imageUrl;

        if (image) {
            try {
                // Compress image before upload
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 800,
                    useWebWorker: true,
                };
                const compressedImage = await imageCompression(image, options);

                // Upload compressed image to Firebase Storage
                const imageRef = ref(storage, `testimonials/${compressedImage.name}`);
                await uploadBytes(imageRef, compressedImage);
                uploadedImageUrl = await getDownloadURL(imageRef);
            } catch (error) {
                console.error("Error compressing/uploading image:", error);
            }
        }

        const testimonialData = {
            authorName,
            content,
            imageUrl: uploadedImageUrl,
        };

        if (currentTestimonial) {
            // Update existing testimonial
            const testimonialDoc = doc(db, "testimonials", currentTestimonial.id);
            await updateDoc(testimonialDoc, testimonialData);
        } else {
            // Create new testimonial
            await addDoc(collection(db, "testimonials"), testimonialData);
        }

        setLoading(false); // End loading
        handleClose();
        window.location.reload();
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            // Delete the image from Firebase Storage if it exists
            if (testimonialToDelete.imageUrl) {
                const imageRef = ref(storage, testimonialToDelete.imageUrl);
                await deleteObject(imageRef);
            }

            // Delete the testimonial document
            const testimonialDoc = doc(db, "testimonials", testimonialToDelete.id);
            await deleteDoc(testimonialDoc);

        } catch (error) {
            console.error("Error deleting testimonial or image:", error);
        }

        setLoading(false);
        setConfirmOpen(false);
        window.location.reload();
    };

    const confirmDelete = (testimonial) => {
        setTestimonialToDelete(testimonial);
        setConfirmOpen(true); // Open confirmation dialog
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    return (
        <div className="p-10 bg-gray-50" style={{ marginLeft: "5%" }}>
            <Typography variant="h4" className="mb-4">
                Testimonial Setup
            </Typography>

            {/* Toolbar for Add New Testimonial */}
            <Toolbar>
                <Button variant="contained" color="primary" onClick={() => handleOpen()} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Add New Testimonial"}
                </Button>
            </Toolbar>

            {/* Table */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={orderByField === "authorName"}
                                direction={orderByField === "authorName" ? orderDirection : "asc"}
                                onClick={() => handleSort("authorName")}
                            >
                                Author Name
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderByField === "content"}
                                direction={orderByField === "content" ? orderDirection : "asc"}
                                onClick={() => handleSort("content")}
                            >
                                Content
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {testimonials
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((testimonial) => (
                            <TableRow key={testimonial.id}>
                                <TableCell>{testimonial.authorName}</TableCell>
                                <TableCell>{testimonial.content}</TableCell>
                                <TableCell>
                                    {testimonial.imageUrl ? (
                                        <img src={testimonial.imageUrl} alt={testimonial.authorName} style={{ maxWidth: "100px", maxHeight: "100px" }} />
                                    ) : (
                                        "No Image"
                                    )}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleOpen(testimonial)}
                                        aria-label="edit"
                                        color="primary"
                                        disabled={loading}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => confirmDelete(testimonial)}
                                        aria-label="delete"
                                        color="secondary"
                                        disabled={loading}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <TablePagination
                component="div"
                count={testimonials.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* Dialog for Create/Update Testimonial */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentTestimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Author Name"
                        type="text"
                        fullWidth
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
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
                    <Input
                        type="file"
                        onChange={handleImageChange}
                        margin="dense"
                        fullWidth
                        inputProps={{ accept: "image/*" }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : currentTestimonial ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Delete Testimonial</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this testimonial? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} color="primary" disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TestimonialSetup;
