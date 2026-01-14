import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button
} from '@mui/material';
import { WhatsApp as WhatsAppIcon } from '@mui/icons-material';
import { sadhnaAPI } from '../services/api';
import { format } from 'date-fns';
import SadhnaCard from '../components/SadhnaCard';

const DevoteesList = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    useEffect(() => {
        fetchEntries();
    }, [selectedDate]);

    const fetchEntries = async () => {
        try {
            setLoading(true);
            const response = await sadhnaAPI.getDevoteesEntries({ date: selectedDate });
            setEntries(response.data);
        } catch (error) {
            console.error('Failed to fetch devotees entries:', error);
        } finally {
            setLoading(false);
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
                        mb: 3
                    }}
                >
                    👥 Devotees' Sadhna Reports
                </Typography>

                <Paper
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        mb: 3
                    }}
                >
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{
                            padding: '12px 16px',
                            fontSize: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            marginBottom: '16px'
                        }}
                    />
                </Paper>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : entries.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                        <Typography variant="h6" color="text.secondary">
                            No entries found for this date
                        </Typography>
                    </Paper>
                ) : (
                    <Box>
                        {entries.map((entry) => (
                            <SadhnaCard key={entry._id} entry={entry} showUserName={true} />
                        ))}
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default DevoteesList;
