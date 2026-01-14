import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Grid,
    Paper,
    CircularProgress,
    Button,
    Card,
    CardContent
} from '@mui/material';
import {
    TrendingUp as TrendingIcon,
    CalendarToday as CalendarIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sadhnaAPI } from '../services/api';
import SadhnaCard from '../components/SadhnaCard';
import { format, subDays } from 'date-fns';

const Dashboard = () => {
    const { user, isMentor } = useAuth();
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEntries: 0,
        avgRounds: 0,
        avgScore: 0
    });

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            setLoading(true);
            const response = await sadhnaAPI.getMyEntries({ limit: 10 });
            setEntries(response.data);

            // Calculate stats
            if (response.data.length > 0) {
                const avgRounds = response.data.reduce((sum, e) => sum + e.roundsChanted, 0) / response.data.length;
                const avgScore = response.data.reduce((sum, e) => sum + e.totalScore, 0) / response.data.length;
                setStats({
                    totalEntries: response.data.length,
                    avgRounds: avgRounds.toFixed(1),
                    avgScore: avgScore.toFixed(0)
                });
            }
        } catch (error) {
            console.error('Failed to fetch entries:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                {/* Welcome Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            fontFamily: "'Poppins', sans-serif",
                            color: '#333'
                        }}
                    >
                        🙏 Hare Krishna, {user?.name}!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {isMentor
                            ? 'Welcome to your mentor dashboard. Track your devotees\' progress and guide them on their spiritual journey.'
                            : 'Track your spiritual practice and stay consistent on your path.'}
                    </Typography>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={4}>
                        <Card
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                borderRadius: 3,
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <CalendarIcon sx={{ mr: 1, fontSize: 28 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Total Entries
                                    </Typography>
                                </Box>
                                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                    {stats.totalEntries}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Card
                            sx={{
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                color: 'white',
                                borderRadius: 3,
                                boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)'
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <TrendingIcon sx={{ mr: 1, fontSize: 28 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Avg Rounds
                                    </Typography>
                                </Box>
                                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                    {stats.avgRounds}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Card
                            sx={{
                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                color: 'white',
                                borderRadius: 3,
                                boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)'
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <TrendingIcon sx={{ mr: 1, fontSize: 28 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Avg Score
                                    </Typography>
                                </Box>
                                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                    {stats.avgScore}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Quick Actions */}
                <Box sx={{ mb: 4 }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/sadhna-entry')}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            textTransform: 'none',
                            borderRadius: 2,
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                            '&:hover': {
                                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.6)',
                            }
                        }}
                    >
                        Add Today's Entry
                    </Button>
                </Box>

                {/* Recent Entries */}
                <Paper
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                >
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                            fontWeight: 600,
                            mb: 3,
                            color: '#333'
                        }}
                    >
                        📊 Recent Entries
                    </Typography>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : entries.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6" color="text.secondary">
                                No entries yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Start by adding your first sadhna entry!
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            {entries.map((entry) => (
                                <SadhnaCard key={entry._id} entry={entry} />
                            ))}
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default Dashboard;
