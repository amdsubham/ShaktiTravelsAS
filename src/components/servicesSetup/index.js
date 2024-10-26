import React, { useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { db, storage } from "../../firebase/firebase"; // Import the Firebase storage
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage"; // Import Firebase Storage functions
import ServiceForm from "./ServiceForm";

const ServicesSetup = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);

    const servicesCollection = collection(db, "services");

    const fetchServices = async () => {
        setLoading(true);
        const serviceSnapshot = await getDocs(servicesCollection);
        const serviceList = serviceSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setServices(serviceList);
        setLoading(false);
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleFormSubmit = async (serviceData) => {
        if (currentService) {
            // Update existing service
            const serviceRef = doc(db, "services", currentService.id);
            await updateDoc(serviceRef, serviceData);
        } else {
            // Create new service
            await addDoc(servicesCollection, serviceData);
        }
        fetchServices();
        setFormOpen(false);
    };

    const handleEdit = (service) => {
        setCurrentService(service);
        setFormOpen(true);
    };

    const handleDeleteClick = (service) => {
        setServiceToDelete(service);
        setDeleteConfirmOpen(true); // Show the delete confirmation dialog
    };

    const handleDeleteConfirm = async () => {
        try {
            // Step 1: Delete the image from Firebase Storage
            if (serviceToDelete.image) {
                const imageRef = ref(storage, serviceToDelete.image); // Reference to the image
                await deleteObject(imageRef); // Delete the image
            }

            // Step 2: Delete the service document from Firestore
            await deleteDoc(doc(db, "services", serviceToDelete.id));

            // Close the dialog and refresh the service list
            setDeleteConfirmOpen(false);
            setServiceToDelete(null);
            fetchServices();
        } catch (error) {
            console.error("Error deleting service or image: ", error);
        }
    };

    const handleFormClose = () => {
        setCurrentService(null);
        setFormOpen(false);
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false);
        setServiceToDelete(null);
    };

    return (
        <div className="p-10 bg-gray-50" >
            <h2>Services Setup</h2>
            <Button variant="contained" color="primary" onClick={() => {
                setCurrentService(null);
                setFormOpen(true)
            }}>
                Add Service
            </Button>
            {loading ? (
                <CircularProgress />
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Content</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {services.map((service) => (
                            <TableRow key={service.id}>
                                <TableCell>{service.title}</TableCell>
                                <TableCell>{service.content}</TableCell>
                                <TableCell>
                                    <img src={service.image} alt={service.title} style={{ width: "100px" }} />
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(service)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(service)}>
                                        <DeleteIcon color="secondary" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Service Form Dialog for Create/Edit */}
            <ServiceForm
                open={formOpen}
                handleClose={handleFormClose}
                handleSubmit={handleFormSubmit}
                initialData={currentService}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the service titled "{serviceToDelete?.title}"? This action cannot be undone.
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

export default ServicesSetup;
