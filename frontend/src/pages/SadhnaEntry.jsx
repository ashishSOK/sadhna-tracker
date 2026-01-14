import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    InputAdornment
} from '@mui/material';
import { Save as SaveIcon, CheckCircle } from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { sadhnaAPI } from '../services/api';
import { format } from 'date-fns';
import { validators } from '../utils/validators';

const SadhnaEntry = () => {
    const [formData, setFormData] = useState({
        date: new Date(),
        wakeUpTime: '',
        sleepTime: '',
        roundsChanted: '',
        bookName: 'Sb',
        readingDuration: '',
        serviceDuration: '',
        serviceType: '',
        hearingDuration: ''
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Validate on change
    useEffect(() => {
        const errors = {};
        if (touched.wakeUpTime) {
            errors.wakeUpTime = validators.time(formData.wakeUpTime).error;
        }
        if (touched.sleepTime) {
            errors.sleepTime = validators.time(formData.sleepTime).error;
        }
        if (touched.roundsChanted) {
            errors.roundsChanted = validators.number(formData.roundsChanted, 0, 64, 'Rounds').error;
        }
        if (touched.readingDuration) {
            errors.readingDuration = validators.number(formData.readingDuration, 0, 600, 'Reading duration').error;
        }
        if (touched.serviceDuration) {
            errors.serviceDuration = validators.number(formData.serviceDuration, 0, 24, 'Service duration').error;
        }
        if (touched.hearingDuration) {
            errors.hearingDuration = validators.number(formData.hearingDuration, 0, 24, 'Hearing duration').error;
        }
        setFieldErrors(errors);
    }, [formData, touched]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };

    const handleDateChange = (newDate) => {
        setFormData({
            ...formData,
            date: newDate
        });
    };

    const handleBlur = (field) => {
        setTouched({
            ...touched,
            [field]: true
        });
    };

    const isFormValid = () => {
        const wakeUpValid = validators.time(formData.wakeUpTime).isValid;
        const sleepValid = validators.time(formData.sleepTime).isValid;
        const roundsValid = validators.number(formData.roundsChanted, 0, 64).isValid;
        const readingValid = validators.number(formData.readingDuration, 0, 600).isValid;
        const serviceValid = validators.number(formData.serviceDuration, 0, 24).isValid;
        const hearingValid = validators.number(formData.hearingDuration, 0, 24).isValid;
        return wakeUpValid && sleepValid && roundsValid && readingValid && serviceValid && hearingValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Mark all fields as touched
        setTouched({
            wakeUpTime: true,
            sleepTime: true,
            roundsChanted: true,
            readingDuration: true,
            serviceDuration: true,
            hearingDuration: true
        });

        if (!isFormValid()) {
            setError('Please fix the errors above');
            return;
        }

        setLoading(true);

        try {
            const dataToSubmit = {
                ...formData,
                date: format(formData.date, 'yyyy-MM-dd'),
                roundsChanted: parseInt(formData.roundsChanted),
                readingDuration: parseFloat(formData.readingDuration),
                serviceDuration: parseFloat(formData.serviceDuration),
                hearingDuration: parseFloat(formData.hearingDuration)
            };

            await sadhnaAPI.createOrUpdate(dataToSubmit);
            setSuccess('Sadhna entry saved successfully! 🎉');

            // Optional: Reset form
            // setFormData({ ... initial values });
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to save entry');
        } finally {
            setLoading(false);
        }
    };

    const getFieldColor = (field) => {
        if (!touched[field]) return '';
        if (fieldErrors[field]) return 'error';
        return 'success';
    };

    const showSuccessIcon = (field) => {
        return touched[field] && !fieldErrors[field] && formData[field];
    };

    return (
        <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="md">
                <Paper
                    sx={{
                        p: { xs: 3, sm: 5 },
                        borderRadius: 4,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                >
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
                        📝 Daily Sadhna Entry
                    </Typography>

                    {success && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            {success}
                        </Alert>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Date */}
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="📅 Date"
                                        value={formData.date}
                                        onChange={handleDateChange}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                variant: 'outlined'
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            {/* Wake Up Time */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="🌅 Wake up Time"
                                    name="wakeUpTime"
                                    type="time"
                                    value={formData.wakeUpTime}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('wakeUpTime')}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    color={getFieldColor('wakeUpTime')}
                                    error={touched.wakeUpTime && !!fieldErrors.wakeUpTime}
                                    helperText={touched.wakeUpTime && fieldErrors.wakeUpTime}
                                    InputProps={{
                                        endAdornment: showSuccessIcon('wakeUpTime') && (
                                            <InputAdornment position="end">
                                                <CheckCircle sx={{ color: '#4caf50' }} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            {/* Sleep Time */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="😴 Slept at"
                                    name="sleepTime"
                                    type="time"
                                    value={formData.sleepTime}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('sleepTime')}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    color={getFieldColor('sleepTime')}
                                    error={touched.sleepTime && !!fieldErrors.sleepTime}
                                    helperText={touched.sleepTime && fieldErrors.sleepTime}
                                    InputProps={{
                                        endAdornment: showSuccessIcon('sleepTime') && (
                                            <InputAdornment position="end">
                                                <CheckCircle sx={{ color: '#4caf50' }} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            {/* Rounds Chanted */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="📿 No. of rounds chanted"
                                    name="roundsChanted"
                                    type="number"
                                    value={formData.roundsChanted}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('roundsChanted')}
                                    required
                                    inputProps={{ min: 0, max: 64, step: 1 }}
                                    color={getFieldColor('roundsChanted')}
                                    error={touched.roundsChanted && !!fieldErrors.roundsChanted}
                                    helperText={touched.roundsChanted ? fieldErrors.roundsChanted : 'Maximum 64 rounds'}
                                    InputProps={{
                                        endAdornment: showSuccessIcon('roundsChanted') && (
                                            <InputAdornment position="end">
                                                <CheckCircle sx={{ color: '#4caf50' }} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            {/* Book Name */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>📖 Name of the book</InputLabel>
                                    <Select
                                        name="bookName"
                                        value={formData.bookName}
                                        onChange={handleChange}
                                        label="📖 Name of the book"
                                        required
                                    >
                                        <MenuItem value="Sb">Srimad Bhagavatam (Sb)</MenuItem>
                                        <MenuItem value="Bg">Bhagavad Gita (Bg)</MenuItem>
                                        <MenuItem value="CC">Chaitanya Charitamrita (CC)</MenuItem>
                                        <MenuItem value="NOD">Nectar of Devotion (NOD)</MenuItem>
                                        <MenuItem value="NOI">Nectar of Instruction (NOI)</MenuItem>
                                        <MenuItem value="Other">Other</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Reading Duration */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="⌛ SP Book Reading Duration (minutes)"
                                    name="readingDuration"
                                    type="number"
                                    value={formData.readingDuration}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('readingDuration')}
                                    required
                                    inputProps={{ min: 0, max: 600, step: 0.5 }}
                                    color={getFieldColor('readingDuration')}
                                    error={touched.readingDuration && !!fieldErrors.readingDuration}
                                    helperText={touched.readingDuration ? fieldErrors.readingDuration : 'Maximum 600 minutes'}
                                    InputProps={{
                                        endAdornment: showSuccessIcon('readingDuration') && (
                                            <InputAdornment position="end">
                                                <CheckCircle sx={{ color: '#4caf50' }} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            {/* Service Duration */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="🕜 Service Duration (hours)"
                                    name="serviceDuration"
                                    type="number"
                                    value={formData.serviceDuration}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('serviceDuration')}
                                    required
                                    inputProps={{ min: 0, max: 24, step: 0.1 }}
                                    color={getFieldColor('serviceDuration')}
                                    error={touched.serviceDuration && !!fieldErrors.serviceDuration}
                                    helperText={touched.serviceDuration ? fieldErrors.serviceDuration : 'Maximum 24 hours'}
                                    InputProps={{
                                        endAdornment: showSuccessIcon('serviceDuration') && (
                                            <InputAdornment position="end">
                                                <CheckCircle sx={{ color: '#4caf50' }} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            {/* Service Type */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="☎️ Service type"
                                    name="serviceType"
                                    value={formData.serviceType}
                                    onChange={handleChange}
                                    placeholder="e.g., Temple cleaning, Book distribution, etc."
                                    multiline
                                    rows={2}
                                />
                            </Grid>

                            {/* Hearing Duration */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="👂🏻 Hearing Duration (hours)"
                                    name="hearingDuration"
                                    type="number"
                                    value={formData.hearingDuration}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('hearingDuration')}
                                    required
                                    inputProps={{ min: 0, max: 24, step: 0.1 }}
                                    color={getFieldColor('hearingDuration')}
                                    error={touched.hearingDuration && !!fieldErrors.hearingDuration}
                                    helperText={touched.hearingDuration ? fieldErrors.hearingDuration : 'Time spent listening to spiritual lectures/kirtan (Max 24 hours)'}
                                    InputProps={{
                                        endAdornment: showSuccessIcon('hearingDuration') && (
                                            <InputAdornment position="end">
                                                <CheckCircle sx={{ color: '#4caf50' }} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={loading || !isFormValid()}
                                    startIcon={<SaveIcon />}
                                    sx={{
                                        py: 1.5,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                                        '&:hover': {
                                            boxShadow: '0 6px 16px rgba(102, 126, 234, 0.6)',
                                        }
                                    }}
                                >
                                    {loading ? 'Saving...' : 'Save Entry'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default SadhnaEntry;
