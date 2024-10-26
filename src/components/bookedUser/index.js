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
    Toolbar,
    IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh"; // Import Refresh icon
import { db } from "../../firebase/firebase"; // Assuming Firebase has been initialized
import { collection, getDocs, query, orderBy } from "firebase/firestore"; // Firestore imports

const BookedUser = () => {
    const [users, setUsers] = useState([]); // List of users
    const [orderDirection, setOrderDirection] = useState("asc");
    const [orderByField, setOrderByField] = useState("travellerName");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filter, setFilter] = useState(""); // Filter for today, yesterday, etc.

    // Function to fetch users from Firestore
    const fetchUsers = async () => {
        try {
            const q = query(collection(db, "bookings"), orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);

            const fetchedUsers = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                bookingDate: doc.data().timestamp.toDate(), // Assuming the bookingDate is saved as 'timestamp'
            }));

            if (filter === "today") {
                setUsers(fetchedUsers.filter((user) => isToday(user.bookingDate)));
            } else if (filter === "yesterday") {
                setUsers(fetchedUsers.filter((user) => isYesterday(user.bookingDate)));
            } else if (filter === "dayBeforeYesterday") {
                setUsers(fetchedUsers.filter((user) => isDayBeforeYesterday(user.bookingDate)));
            } else {
                setUsers(fetchedUsers);
            }
        } catch (error) {
            console.error("Error fetching users: ", error);
        }
    };

    // Call fetchUsers when the component loads or filter changes
    useEffect(() => {
        fetchUsers();
    }, [filter]);

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isYesterday = (date) => {
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        return date.toDateString() === yesterday.toDateString();
    };

    const isDayBeforeYesterday = (date) => {
        const dayBeforeYesterday = new Date(new Date().setDate(new Date().getDate() - 2));
        return date.toDateString() === dayBeforeYesterday.toDateString();
    };

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

    const sortedUsers = () => {
        return users
    };

    return (
        <div className="p-10 bg-gray-50">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" className="mb-4">
                    Orders
                </Typography>

                {/* Refresh Button */}
                <IconButton onClick={fetchUsers} color="primary" aria-label="refresh">
                    <RefreshIcon />
                </IconButton>
            </div>

            {/* Quick Filter Toolbar */}
            <Toolbar>
                <Button
                    variant={filter === "today" ? "contained" : "outlined"}
                    color={filter === "today" ? "primary" : "default"}
                    onClick={() => setFilter("today")}
                    className="mr-2"
                    style={{ marginRight: "10px" }}
                >
                    Today
                </Button>
                <Button
                    variant={filter === "yesterday" ? "contained" : "outlined"}
                    color={filter === "yesterday" ? "primary" : "default"}
                    onClick={() => setFilter("yesterday")}
                    className="mr-2"
                    style={{ marginRight: "10px" }}
                >
                    Yesterday
                </Button>
                <Button
                    variant={filter === "dayBeforeYesterday" ? "contained" : "outlined"}
                    color={filter === "dayBeforeYesterday" ? "primary" : "default"}
                    onClick={() => setFilter("dayBeforeYesterday")}
                    style={{ marginRight: "10px" }}
                >
                    Day Before Yesterday
                </Button>
                <Button variant="outlined" onClick={() => setFilter("")} style={{ marginLeft: "10px" }}>
                    Clear Filter
                </Button>
            </Toolbar>

            {/* Table */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={orderByField === "travellerName"}
                                direction={orderByField === "travellerName" ? orderDirection : "asc"}
                                onClick={() => handleSort("travellerName")}
                            >
                                Traveller Name
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderByField === "travelPlace"}
                                direction={orderByField === "travelPlace" ? orderDirection : "asc"}
                                onClick={() => handleSort("travelPlace")}
                            >
                                Travel Place
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderByField === "startDate"}
                                direction={orderByField === "startDate" ? orderDirection : "asc"}
                                onClick={() => handleSort("startDate")}
                            >
                                Start Date
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderByField === "returnDate"}
                                direction={orderByField === "returnDate" ? orderDirection : "asc"}
                                onClick={() => handleSort("returnDate")}
                            >
                                Return Date
                            </TableSortLabel>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedUsers()
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.travellerName}</TableCell>
                                <TableCell>{user.travelPlace}</TableCell>
                                <TableCell>{user.startDate}</TableCell>
                                <TableCell>{user.returnDate}</TableCell>
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
        </div>
    );
};

export default BookedUser;
