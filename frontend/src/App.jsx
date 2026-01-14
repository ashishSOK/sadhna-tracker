import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SadhnaEntry from './pages/SadhnaEntry';
import DevoteesList from './pages/DevoteesList';
import WeeklyWinner from './pages/WeeklyWinner';
import WhatsAppMessaging from './pages/WhatsAppMessaging';

// Create theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#667eea',
        },
        secondary: {
            main: '#764ba2',
        },
    },
    typography: {
        fontFamily: "'Inter', 'Roboto', sans-serif",
    },
    shape: {
        borderRadius: 8,
    },
});

// Protected Route Component
const ProtectedRoute = ({ children, mentorOnly = false }) => {
    const { isAuthenticated, isMentor, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (mentorOnly && !isMentor) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <>
            {isAuthenticated && <Navbar />}
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <PublicRoute>
                            <Signup />
                        </PublicRoute>
                    }
                />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/sadhna-entry"
                    element={
                        <ProtectedRoute>
                            <SadhnaEntry />
                        </ProtectedRoute>
                    }
                />

                {/* Mentor Only Routes */}
                <Route
                    path="/devotees"
                    element={
                        <ProtectedRoute mentorOnly={true}>
                            <DevoteesList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/weekly-winner"
                    element={
                        <ProtectedRoute mentorOnly={true}>
                            <WeeklyWinner />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/whatsapp"
                    element={
                        <ProtectedRoute mentorOnly={true}>
                            <WhatsAppMessaging />
                        </ProtectedRoute>
                    }
                />

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <AppRoutes />
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
