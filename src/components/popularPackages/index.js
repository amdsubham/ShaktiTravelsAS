import React, { useState, useEffect } from "react";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    CircularProgress,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { db, storage } from "../../firebase/firebase"; // Import the Firebase storage and firestore
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage"; // Import Firebase Storage functions
import PackageForm from "./PackageForm"; // Package form similar to ServiceForm

const PackagesSetup = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [currentPackage, setCurrentPackage] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [packageToDelete, setPackageToDelete] = useState(null);

    const packagesCollection = collection(db, "packages"); // Change collection to "packages"

    const fetchPackages = async () => {
        setLoading(true);
        const packageSnapshot = await getDocs(packagesCollection);
        const packageList = packageSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setPackages(packageList);
        setLoading(false);
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const handleFormSubmit = async (packageData) => {
        if (currentPackage) {
            // Update existing package
            const packageRef = doc(db, "packages", currentPackage.id);
            await updateDoc(packageRef, packageData);
        } else {
            // Create new package
            await addDoc(packagesCollection, packageData);
        }
        fetchPackages();
        setFormOpen(false);
    };

    const handleEdit = (pkg) => {
        setCurrentPackage(pkg);
        setFormOpen(true);
    };

    const handleDeleteClick = (pkg) => {
        setPackageToDelete(pkg);
        setDeleteConfirmOpen(true); // Show the delete confirmation dialog
    };

    const handleDeleteConfirm = async () => {
        try {
            // Step 1: Delete the image from Firebase Storage
            if (packageToDelete.image) {
                const imageRef = ref(storage, packageToDelete.image); // Reference to the image
                await deleteObject(imageRef); // Delete the image
            }

            // Step 2: Delete the package document from Firestore
            await deleteDoc(doc(db, "packages", packageToDelete.id));

            // Close the dialog and refresh the package list
            setDeleteConfirmOpen(false);
            setPackageToDelete(null);
            fetchPackages();
        } catch (error) {
            console.error("Error deleting package or image: ", error);
        }
    };

    const handleFormClose = () => {
        setCurrentPackage(null);
        setFormOpen(false);
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false);
        setPackageToDelete(null);
    };

    return (
        <div className="p-10 bg-gray-50" >
            <h2>Popular Packages Setup</h2>
            <Button variant="contained" color="primary" onClick={() => {
                setCurrentPackage(null);
                setFormOpen(true)
            }
            }>
                Add Package
            </Button>
            {loading ? (
                <CircularProgress />
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Content</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {packages.map((pkg) => (
                            <TableRow key={pkg.id}>
                                <TableCell>{pkg.title}</TableCell>
                                <TableCell>{pkg.content}</TableCell>
                                <TableCell>{pkg.price}</TableCell>
                                <TableCell>
                                    <img src={pkg.image} alt={pkg.title} style={{ width: "100px" }} />
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(pkg)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(pkg)}>
                                        <DeleteIcon color="secondary" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Package Form Dialog for Create/Edit */}
            <PackageForm
                open={formOpen}
                handleClose={handleFormClose}
                handleSubmit={handleFormSubmit}
                initialData={currentPackage}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the package titled "{packageToDelete?.title}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PackagesSetup;
