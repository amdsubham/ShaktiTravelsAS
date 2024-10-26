import React, { useState, useEffect } from "react";
import {
    Button,
    TextField,
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
    DialogTitle,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { db } from "../../firebase/firebase"; // Import Firestore
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import ContactInfoForm from "./ContactInfoForm"; // Similar to ContactForm

const ContactInfoSetup = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [currentContactInfo, setCurrentContactInfo] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [contactInfoToDelete, setContactInfoToDelete] = useState(null);

    const contactsCollection = collection(db, "contactInfo");

    const fetchContacts = async () => {
        setLoading(true);
        const contactSnapshot = await getDocs(contactsCollection);
        const contactList = contactSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setContacts(contactList);
        setLoading(false);
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleFormSubmit = async (contactData) => {
        if (currentContactInfo) {
            // Update existing contact info
            const contactInfoRef = doc(db, "contactInfo", currentContactInfo.id);
            await updateDoc(contactInfoRef, contactData);
        } else {
            // Create new contact info
            await addDoc(contactsCollection, contactData);
        }
        fetchContacts();
        setFormOpen(false);
    };

    const handleEdit = (contactInfo) => {
        setCurrentContactInfo(contactInfo);
        setFormOpen(true);
    };

    const handleDeleteClick = (contactInfo) => {
        setContactInfoToDelete(contactInfo);
        setDeleteConfirmOpen(true); // Show the delete confirmation dialog
    };

    const handleDeleteConfirm = async () => {
        try {
            // Delete the contact info document from Firestore
            await deleteDoc(doc(db, "contactInfo", contactInfoToDelete.id));

            // Close the dialog and refresh the contact info list
            setDeleteConfirmOpen(false);
            setContactInfoToDelete(null);
            fetchContacts();
        } catch (error) {
            console.error("Error deleting contact info: ", error);
        }
    };

    const handleFormClose = () => {
        setCurrentContactInfo(null);
        setFormOpen(false);
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false);
        setContactInfoToDelete(null);
    };

    return (
        <div className="p-10 bg-gray-50">
            <h2>Contact Information Setup</h2>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setFormOpen(true)}
                disabled={contacts.length > 0} // Disable button if there is already one contact info
            >
                {contacts.length > 0 ? "Contact Info Already Exists" : "Add Contact Info"}
            </Button>
            {loading ? (
                <CircularProgress />
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Address</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Additional Number</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contacts.map((contact) => (
                            <TableRow key={contact.id}>
                                <TableCell>{contact.address}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>{contact.phone}</TableCell>
                                <TableCell>{contact.additionalNumber}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(contact)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(contact)}>
                                        <DeleteIcon color="secondary" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Contact Info Form Dialog for Create/Edit */}
            <ContactInfoForm
                open={formOpen}
                handleClose={handleFormClose}
                handleSubmit={handleFormSubmit}
                initialData={currentContactInfo}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <p>
                        Are you sure you want to delete the contact info for "{contactInfoToDelete?.address}"? This action cannot be undone.
                    </p>
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

export default ContactInfoSetup;
