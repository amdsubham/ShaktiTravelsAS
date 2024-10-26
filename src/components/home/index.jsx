import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import BuildIcon from "@mui/icons-material/Build";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Home = () => {
  const location = useLocation(); // Get the current location (path)

  const menuItems = [
    {
      name: "Booked User",
      path: "/booked-user",
      icon: <PeopleIcon style={{ color: "#f44336" }} />,
    },
    {
      name: "Services Setup",
      path: "/services-setup",
      icon: <BuildIcon style={{ color: "#2196f3" }} />,
    },
    {
      name: "Packages Setup",
      path: "/packages-setup",
      icon: <LocalOfferIcon style={{ color: "#4caf50" }} />,
    },
    {
      name: "Testimonial Setup",
      path: "/testimonial-setup",
      icon: <RateReviewIcon style={{ color: "#ff9800" }} />,
    },
    {
      name: "Contact Info",
      path: "/contact-info",
      icon: <LocationOnIcon style={{ color: "#00bcd4" }} />,
    },
    {
      name: "Contact Form",
      path: "/contact-form",
      icon: <ContactMailIcon style={{ color: "#9c27b0" }} />,
    },
    {
      name: "Subscribed User",
      path: "/subscribed-user",
      icon: <MailOutlineIcon style={{ color: "#00bcd4" }} />,
    },
  ];

  return (
    <Drawer
      variant="permanent" // Sidebar will always be shown
      classes={{ paper: "w-64 bg-gray-900 text-white" }}
    >
      <div className="p-6 border-b border-gray-700">
        <Typography variant="h6" className="text-white font-semibold">
          Admin Dashboard
        </Typography>
      </div>
      <List>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path; // Check if the current route matches the menu item path

          return (
            <ListItem
              button
              key={index}
              component={Link}
              to={item.path}
              className={`hover:bg-gray-800 transition-colors duration-300 ${
                isActive ? "bg-gray-800 text-white" : ""
              }`}
            >
              <ListItemIcon
                style={{
                  color: isActive ? "#fff" : item.icon.props.style.color,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  className: isActive ? "text-white" : "text-gray-500",
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Home;
