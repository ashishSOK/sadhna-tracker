import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    CircularProgress,
    Card,
    CardContent,
    Grid,
    Avatar,
    Chip
} from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { sadhnaAPI } from '../services/api';
import { format } from 'date-fns';

const WeeklyWinner = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWeeklyWinner();
    }, []);

    const fetchWeeklyWinner = async () => {
        try {
            setLoading(true);
            const response = await sadhnaAPI.getWeeklyWinner();
            setData(response.data);
        } catch (error) {
            console.error('Failed to fetch weekly winner:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMedalColor = (index) => {
        switch (index) {
            case 0: return 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'; // Gold
            case 1: return 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)'; // Silver
            case 2: return 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)'; // Bronze
            default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    };

    return (
        <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        fontFamily: "'Poppins', sans-serif",
                        color: '#333',
                        mb: 1
                    }}
                >
                    🏆 Weekly Champions
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : !data || data.rankings.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                        <Typography variant="h6" color="text.secondary">
                            No data available for this week
                        </Typography>
                    </Paper>
                ) : (
                    <>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            Week: {format(new Date(data.weekStart), 'dd MMM yyyy')} - {format(new Date(data.weekEnd), 'dd MMM yyyy')}
                        </Typography>

                        {/* Winner Highlight */}
                        {data.winner && (
                            <Card
                                sx={{
                                    mb: 4,
                                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                    color: 'white',
                                    borderRadius: 4,
                                    boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)'
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                        <TrophyIcon sx={{ fontSize: 60, mr: 2 }} />
                                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                            Winner
                                        </Typography>
                                    </Box>
                                    <Typography variant="h4" align="center" sx={{ fontWeight: 600, mb: 2 }}>
                                        🎉 {data.winner.user.name}
                                    </Typography>
                                    <Typography variant="h5" align="center" sx={{ fontWeight: 600 }}>
                                        Total Score: {data.winner.totalScore.toFixed(0)}
                                    </Typography>
                                    <Typography variant="body1" align="center" sx={{ mt: 1 }}>
                                        Entries this week: {data.winner.entries.length}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}

                        {/* Leaderboard */}
                        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                                📊 Leaderboard
                            </Typography>

                            <Grid container spacing={2}>
                                {data.rankings.map((rank, index) => (
                                    <Grid item xs={12} key={rank.user._id}>
                                        <Card
                                            sx={{
                                                background: index < 3 ? getMedalColor(index) : 'white',
                                                color: index < 3 ? 'white' : 'inherit',
                                                borderRadius: 3,
                                                transition: 'transform 0.2s',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                }
                                            }}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar
                                                            sx={{
                                                                width: 56,
                                                                height: 56,
                                                                bgcolor: index < 3 ? 'rgba(255,255,255,0.3)' : '#667eea',
                                                                fontSize: '1.5rem',
                                                                fontWeight: 700
                                                            }}
                                                        >
                                                            {index + 1}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                                {rank.user.name}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                                {rank.user.email}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{ textAlign: 'right' }}>
                                                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                                            {rank.totalScore.toFixed(0)}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                            {rank.entries.length} entries
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </>
                )}
            </Container>
        </Box>
    );
};

export default WeeklyWinner;
