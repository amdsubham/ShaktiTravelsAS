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
    Toolbar,
    Typography,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Refresh as RefreshIcon } from "@mui/icons-material"; // Import Refresh icon
import { db } from "../../firebase/firebase"; // Import Firestore
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import ContactForm from "./ContactForm"; // Contact form similar to ServiceForm or PackageForm

const ContactFormSetup = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [currentContact, setCurrentContact] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);

    const contactsCollection = collection(db, "contacts");

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
        if (currentContact) {
            // Update existing contact
            const contactRef = doc(db, "contacts", currentContact.id);
            await updateDoc(contactRef, contactData);
        } else {
            // Create new contact
            await addDoc(contactsCollection, contactData);
        }
        fetchContacts();
        setFormOpen(false);
    };

    const handleEdit = (contact) => {
        setCurrentContact(contact);
        setFormOpen(true);
    };

    const handleDeleteClick = (contact) => {
        setContactToDelete(contact);
        setDeleteConfirmOpen(true); // Show the delete confirmation dialog
    };

    const handleDeleteConfirm = async () => {
        try {
            // Delete the contact document from Firestore
            await deleteDoc(doc(db, "contacts", contactToDelete.id));

            // Close the dialog and refresh the contact list
            setDeleteConfirmOpen(false);
            setContactToDelete(null);
            fetchContacts();
        } catch (error) {
            console.error("Error deleting contact: ", error);
        }
    };

    const handleFormClose = () => {
        setCurrentContact(null);
        setFormOpen(false);
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false);
        setContactToDelete(null);
    };

    // New function to refresh contacts
    const handleRefresh = () => {
        fetchContacts(); // Refresh the contacts by fetching them again
    };

    return (
        <div className="p-10 bg-gray-50">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" className="mb-4">
                    Contact Form Submissions
                </Typography>

                {/* Refresh Button */}
                <IconButton onClick={handleRefresh} color="primary" aria-label="refresh">
                    <RefreshIcon />
                </IconButton>
            </div>

            <Button variant="contained" color="primary" onClick={() => setFormOpen(true)}>
                Add Contact
            </Button>

            {loading ? (
                <CircularProgress />
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Message</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contacts.map((contact) => (
                            <TableRow key={contact.id}>
                                <TableCell>{contact.name}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>{contact.phone}</TableCell>
                                <TableCell>{contact.message}</TableCell>
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

            {/* Contact Form Dialog for Create/Edit */}
            <ContactForm
                open={formOpen}
                handleClose={handleFormClose}
                handleSubmit={handleFormSubmit}
                initialData={currentContact}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the contact submission from "{contactToDelete?.name}"? This action cannot be undone.
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

export default ContactFormSetup;
