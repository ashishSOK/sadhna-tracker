import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Link,
    Alert,
    InputAdornment,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    LinearProgress
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    PersonAdd as SignupIcon,
    CheckCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { validators, getPasswordStrength } from '../utils/validators';

const Signup = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'devotee',
        mentorId: ''
    });
    const [mentors, setMentors] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        fetchMentors();
    }, []);

    // Validate on change
    useEffect(() => {
        const errors = {};
        if (touched.name) {
            errors.name = validators.name(formData.name).error;
        }
        if (touched.email) {
            errors.email = validators.email(formData.email).error;
        }
        if (touched.phone) {
            errors.phone = validators.phone(formData.phone).error;
        }
        if (touched.password) {
            errors.password = validators.password(formData.password).error;
        }
        if (touched.mentorId && formData.role === 'devotee') {
            errors.mentorId = validators.required(formData.mentorId, 'Mentor').error;
        }
        setFieldErrors(errors);
    }, [formData, touched]);

    const fetchMentors = async () => {
        try {
            const response = await authAPI.getMentors();
            setMentors(response.data);
        } catch (error) {
            console.error('Failed to fetch mentors:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleBlur = (field) => {
        setTouched({
            ...touched,
            [field]: true
        });
    };

    const isFormValid = () => {
        const nameValid = validators.name(formData.name).isValid;
        const emailValid = validators.email(formData.email).isValid;
        const phoneValid = validators.phone(formData.phone).isValid;
        const passwordValid = validators.password(formData.password).isValid;
        const mentorValid = formData.role === 'mentor' || validators.required(formData.mentorId).isValid;
        return nameValid && emailValid && phoneValid && passwordValid && mentorValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Mark all fields as touched
        setTouched({
            name: true,
            email: true,
            phone: true,
            password: true,
            mentorId: true
        });

        if (!isFormValid()) {
            setError('Please fix the errors above');
            return;
        }

        setLoading(true);

        const result = await register(formData);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const getFieldColor = (field) => {
        if (!touched[field]) return '';
        if (fieldErrors[field]) return 'error';
        return 'success';
    };

    const showSuccessIcon = (field) => {
        return touched[field] && !fieldErrors[field] && formData[field];
    };

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={10}
                    sx={{
                        p: { xs: 3, sm: 5 },
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <SignupIcon
                            sx={{
                                fontSize: 60,
                                color: '#667eea',
                                mb: 2
                            }}
                        />
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                fontFamily: "'Poppins', sans-serif",
                                color: '#333'
                            }}
                        >
                            Join Sadhna Tracker
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Start tracking your spiritual growth today
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={() => handleBlur('name')}
                            required
                            margin="normal"
                            variant="outlined"
                            color={getFieldColor('name')}
                            error={touched.name && !!fieldErrors.name}
                            helperText={touched.name && fieldErrors.name}
                            InputProps={{
                                endAdornment: showSuccessIcon('name') && (
                                    <InputAdornment position="end">
                                        <CheckCircle sx={{ color: '#4caf50' }} />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={() => handleBlur('email')}
                            required
                            margin="normal"
                            variant="outlined"
                            color={getFieldColor('email')}
                            error={touched.email && !!fieldErrors.email}
                            helperText={touched.email && fieldErrors.email}
                            InputProps={{
                                endAdornment: showSuccessIcon('email') && (
                                    <InputAdornment position="end">
                                        <CheckCircle sx={{ color: '#4caf50' }} />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Phone (with country code)"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={() => handleBlur('phone')}
                            required
                            margin="normal"
                            variant="outlined"
                            placeholder="+911234567890"
                            color={getFieldColor('phone')}
                            error={touched.phone && !!fieldErrors.phone}
                            helperText={touched.phone ? fieldErrors.phone : "Include country code (e.g., +91 for India)"}
                            InputProps={{
                                endAdornment: showSuccessIcon('phone') && (
                                    <InputAdornment position="end">
                                        <CheckCircle sx={{ color: '#4caf50' }} />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={() => handleBlur('password')}
                            required
                            margin="normal"
                            variant="outlined"
                            color={getFieldColor('password')}
                            error={touched.password && !!fieldErrors.password}
                            helperText={touched.password && fieldErrors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {showSuccessIcon('password') && (
                                            <CheckCircle sx={{ color: '#4caf50', mr: 1 }} />
                                        )}
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <Box sx={{ mt: 1, mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(passwordStrength.strength / 5) * 100}
                                        sx={{
                                            flex: 1,
                                            height: 6,
                                            borderRadius: 3,
                                            bgcolor: '#e0e0e0',
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: passwordStrength.color,
                                                borderRadius: 3
                                            }
                                        }}
                                    />
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: passwordStrength.color,
                                            fontWeight: 600,
                                            minWidth: 60
                                        }}
                                    >
                                        {passwordStrength.label}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        <FormControl fullWidth margin="normal">
                            <InputLabel>I am a</InputLabel>
                            <Select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                label="I am a"
                                required
                            >
                                <MenuItem value="devotee">Devotee</MenuItem>
                                <MenuItem value="mentor">Mentor</MenuItem>
                            </Select>
                        </FormControl>

                        {formData.role === 'devotee' && (
                            <FormControl
                                fullWidth
                                margin="normal"
                                error={touched.mentorId && !!fieldErrors.mentorId}
                            >
                                <InputLabel>Select Mentor</InputLabel>
                                <Select
                                    name="mentorId"
                                    value={formData.mentorId}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('mentorId')}
                                    label="Select Mentor"
                                    required={formData.role === 'devotee'}
                                    color={getFieldColor('mentorId')}
                                >
                                    {mentors.map((mentor) => (
                                        <MenuItem key={mentor._id} value={mentor._id}>
                                            {mentor.name} ({mentor.email})
                                        </MenuItem>
                                    ))}
                                </Select>
                                {touched.mentorId && fieldErrors.mentorId && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                                        {fieldErrors.mentorId}
                                    </Typography>
                                )}
                            </FormControl>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading || !isFormValid()}
                            sx={{
                                mt: 3,
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
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </form>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2">
                            Already have an account?{' '}
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => navigate('/login')}
                                sx={{
                                    fontWeight: 600,
                                    color: '#667eea',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                Login
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Signup;
