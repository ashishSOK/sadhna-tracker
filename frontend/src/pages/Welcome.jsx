import React from 'react';
import { Box, Button, Container, Typography, Grid, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MenuBook, SelfImprovement, Favorite } from '@mui/icons-material';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Hero Section */}
            <Box sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                pt: 12,
                pb: 12,
                borderRadius: '0 0 50% 10% / 0 0 10% 20%',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                <Container maxWidth="md">
                    <Stack spacing={4} alignItems="center" textAlign="center">
                        <Typography variant="h2" component="h1" fontWeight="800" sx={{
                            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                            fontSize: { xs: '2.5rem', md: '3.5rem' }
                        }}>
                            Sadhna Tracker
                        </Typography>
                        <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 300, maxWidth: '800px' }}>
                            Your companion for spiritual growth, guided by the timeless wisdom of ISKCON.
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} pt={4}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/login')}
                                sx={{
                                    bgcolor: 'white',
                                    color: '#764ba2',
                                    px: 5,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    '&:hover': { bgcolor: '#f0f0f0' }
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate('/signup')}
                                sx={{
                                    borderColor: 'white',
                                    color: 'white',
                                    px: 5,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    '&:hover': { borderColor: '#f0f0f0', bgcolor: 'rgba(255,255,255,0.1)' }
                                }}
                            >
                                Create Account
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            {/* Features/Philosophy Section */}
            <Container maxWidth="lg" sx={{ mt: -8, mb: 10, position: 'relative', zIndex: 2 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{
                            p: 4,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            borderRadius: 4,
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': { transform: 'translateY(-8px)' }
                        }}>
                            <Box sx={{
                                p: 2,
                                borderRadius: '50%',
                                bgcolor: '#e3f2fd',
                                color: '#1976d2',
                                mb: 2
                            }}>
                                <MenuBook fontSize="large" />
                            </Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Bhagavad Gita
                            </Typography>
                            <Typography color="text.secondary">
                                Rooted in the discipline and teachings of the Bhagavad Gita, helping you regulate your daily habits.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{
                            p: 4,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            borderRadius: 4,
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': { transform: 'translateY(-8px)' }
                        }}>
                            <Box sx={{
                                p: 2,
                                borderRadius: '50%',
                                bgcolor: '#f3e5f5',
                                color: '#9c27b0',
                                mb: 2
                            }}>
                                <SelfImprovement fontSize="large" />
                            </Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Daily Sadhna
                            </Typography>
                            <Typography color="text.secondary">
                                Track your Japa, reading, and service effortlessly. Consistency is the key to spiritual advancement.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{
                            p: 4,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            borderRadius: 4,
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': { transform: 'translateY(-8px)' }
                        }}>
                            <Box sx={{
                                p: 2,
                                borderRadius: '50%',
                                bgcolor: '#ffebee',
                                color: '#e91e63',
                                mb: 2
                            }}>
                                <Favorite fontSize="large" />
                            </Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Bhakti Yoga
                            </Typography>
                            <Typography color="text.secondary">
                                Cultivate devotion through structured practice under the umbrella of ISKCON values.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Footer */}
            <Box component="footer" sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: '#f5f5f5',
                textAlign: 'center'
            }}>
                <Container maxWidth="sm">
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} Sadhna Tracker. All rights reserved.
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                        Hare Krishna Hare Krishna Krishna Krishna Hare Hare | Hare Rama Hare Rama Rama Rama Hare Hare
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default Welcome;
