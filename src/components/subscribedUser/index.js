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
} from "@mui/material";
import { Delete, Edit, Refresh } from "@mui/icons-material"; // Import Refresh icon
import { db } from "../../firebase/firebase"; // Assuming Firebase is initialized
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";

const SubscribedUser = () => {
    const [users, setUsers] = useState([]);
    const [orderDirection, setOrderDirection] = useState("asc");
    const [orderByField, setOrderByField] = useState("email");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [open, setOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [newEmail, setNewEmail] = useState("");

    // Fetch users from Firestore
    const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "subscribedUsers"));
        const fetchedUsers = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setUsers(fetchedUsers);
    };

    useEffect(() => {
        fetchUsers();
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

    const handleOpen = (user = null) => {
        setCurrentUser(user);
        setNewEmail(user ? user.email : "");
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentUser(null);
    };

    const handleSave = async () => {
        if (currentUser) {
            // Update existing user
            const userDoc = doc(db, "subscribedUsers", currentUser.id);
            await updateDoc(userDoc, { email: newEmail });
        } else {
            // Create new user
            await addDoc(collection(db, "subscribedUsers"), { email: newEmail });
        }
        handleClose();
        fetchUsers(); // Refresh the list after adding/updating a user
    };

    const handleDelete = async (id) => {
        const userDoc = doc(db, "subscribedUsers", id);
        await deleteDoc(userDoc);
        fetchUsers(); // Refresh the list after deleting a user
    };

    const sortedUsers = users.sort((a, b) => {
        if (orderDirection === "asc") {
            return a[orderByField] < b[orderByField] ? -1 : 1;
        } else {
            return a[orderByField] > b[orderByField] ? -1 : 1;
        }
    });

    return (
        <div className="p-10 bg-gray-50">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" className="mb-4">
                    Subscribed Users
                </Typography>

                {/* Refresh Button */}
                <IconButton onClick={fetchUsers} color="primary" aria-label="refresh">
                    <Refresh />
                </IconButton>
            </div>

            {/* Toolbar for Add New User */}
            <Toolbar>
                <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                    Add New Subscribed User
                </Button>
            </Toolbar>

            {/* Table */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={orderByField === "email"}
                                direction={orderByField === "email" ? orderDirection : "asc"}
                                onClick={() => handleSort("email")}
                            >
                                Email
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedUsers
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleOpen(user)}
                                        aria-label="edit"
                                        color="primary"
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDelete(user.id)}
                                        aria-label="delete"
                                        color="secondary"
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
                count={users.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* Dialog for Create/Update User */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentUser ? "Edit User" : "Add User"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        {currentUser ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SubscribedUser;
