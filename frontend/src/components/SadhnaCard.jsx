import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Box,
    Divider
} from '@mui/material';
import {
    WbSunny as WakeIcon,
    Bedtime as SleepIcon,
    AutoStories as BookIcon,
    Handshake as ServiceIcon,
    Headphones as HearingIcon,
    EmojiEvents as RoundsIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const SadhnaCard = ({ entry, showUserName = false }) => {
    const formatTime = (timeStr) => {
        if (!timeStr) return 'N/A';
        return timeStr;
    };

    return (
        <Card
            sx={{
                mb: 2,
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                }
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#667eea' }}>
                        📅 {format(new Date(entry.date), 'dd MMM yyyy')}
                    </Typography>
                    {entry.totalScore && (
                        <Chip
                            label={`Score: ${entry.totalScore.toFixed(0)}`}
                            color="primary"
                            sx={{ fontWeight: 600 }}
                        />
                    )}
                </Box>

                {showUserName && entry.userId?.name && (
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        🧑🏻‍💼 {entry.userId.name}
                    </Typography>
                )}

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <WakeIcon sx={{ color: '#FFA726' }} />
                            <Typography variant="body2" color="text.secondary">
                                <strong>Wake up:</strong> {formatTime(entry.wakeUpTime)}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <SleepIcon sx={{ color: '#5C6BC0' }} />
                            <Typography variant="body2" color="text.secondary">
                                <strong>Slept at:</strong> {formatTime(entry.sleepTime)}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <RoundsIcon sx={{ color: '#FFD700' }} />
                            <Typography variant="body2" color="text.secondary">
                                <strong>Rounds chanted:</strong> {entry.roundsChanted}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <BookIcon sx={{ color: '#66BB6A' }} />
                            <Typography variant="body2" color="text.secondary">
                                <strong>Book:</strong> {entry.bookName}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <BookIcon sx={{ color: '#42A5F5' }} />
                            <Typography variant="body2" color="text.secondary">
                                <strong>Reading:</strong> {entry.readingDuration} min
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <ServiceIcon sx={{ color: '#AB47BC' }} />
                            <Typography variant="body2" color="text.secondary">
                                <strong>Service:</strong> {entry.serviceDuration} hrs
                            </Typography>
                        </Box>
                    </Grid>

                    {entry.serviceType && (
                        <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Service Type:</strong> {entry.serviceType}
                            </Typography>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <HearingIcon sx={{ color: '#26A69A' }} />
                            <Typography variant="body2" color="text.secondary">
                                <strong>Hearing:</strong> {entry.hearingDuration} hrs
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default SadhnaCard;
