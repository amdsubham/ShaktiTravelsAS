import React, { useEffect } from "react";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import BookedUser from "./components/bookedUser";
import Header from "./components/header";
import Home from "./components/home"; // Sidebar component
import { AuthProvider, useAuth } from "./contexts/authContext";
import { useRoutes, useNavigate } from "react-router-dom";
import SubscribedUser from "./components/subscribedUser";
import TestimonialSetup from "./components/testimonialSetup";
import ServicesSetup from "./components/servicesSetup";
import PackagesSetup from "./components/popularPackages";
import ContactFormSetup from "./components/ContactFormSetup";
import ContactInfoSetup from "./components/ContactInfoSetup";

function AppContent() {
  const { currentUser } = useAuth(); // Get the current user from context
  const navigate = useNavigate(); // Get the navigate function

  // Redirect to the "Booked User" screen by default after login

  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/booked-user",
      element: <BookedUser />, // Default route after login
    },
    {
      path: "/home",
      element: <BookedUser />, // Adjust content for the Home main area
    },
    {
      path: "/subscribed-user",
      element: <SubscribedUser />,
    },
    {
      path: "/testimonial-setup",
      element: <TestimonialSetup />,
    },
    {
      path: "/services-setup",
      element: <ServicesSetup />,
    },
    {
      path: "/packages-setup",
      element: <PackagesSetup />,
    },
    {
      path: "/contact-form",
      element: <ContactFormSetup />,
    },
    {
      path: "/contact-info",
      element: <ContactInfoSetup />,
    },
  ];

  let routesElement = useRoutes(routesArray);

  return (
    <div className="w-full h-screen flex overflow-hidden">
      {currentUser && (
        <div className="w-64">
          <Home /> {/* Sidebar will be visible only when logged in */}
        </div>
      )}

      {/* Main content area */}
      <div className="flex-grow overflow-auto">
        {currentUser && <Header />} {/* Show header only when logged in */}
        <div className="w-full h-full p-5">{routesElement}</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
