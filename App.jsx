import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ApiService from './services/api';

// Pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import EventDetails from './pages/EventDetails';
import Gallery from './pages/Gallery';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingOranges from './components/FloatingOranges';

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize user from local storage token
        const currentUser = ApiService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                backgroundColor: '#030305'
            }}>
                <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    border: '3px solid rgba(255, 85, 0, 0.1)', 
                    borderTopColor: 'var(--neon-orange, #ff5500)', 
                    borderRadius: '50%', 
                    animation: 'spin 1s linear infinite' 
                }} />
            </div>
        );
    }

    return (
        <Router>
            {/* Interactive drifting oranges and mouse glow backdrop */}
            <FloatingOranges />

            <div className="app-container">
                <Header user={user} onLogout={handleLogout} />

                {/* Main Content Area */}
                <main style={{ flexGrow: 1, minHeight: '60vh', marginTop: '20px' }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route 
                            path="/auth" 
                            element={
                                user ? <Navigate to="/dashboard" replace /> : <Auth onLoginSuccess={handleLoginSuccess} />
                            } 
                        />
                        <Route 
                            path="/dashboard" 
                            element={
                                user ? <Dashboard user={user} /> : <Navigate to="/auth" replace />
                            } 
                        />
                        <Route path="/event/:id" element={<EventDetails user={user} />} />
                        <Route path="/gallery" element={<Gallery />} />
                        
                        {/* Fallback Catch-all Route */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </Router>
    );
}
