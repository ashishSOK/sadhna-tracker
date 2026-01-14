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
    IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validators } from '../utils/validators';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({
        email: '',
        password: ''
    });
    const [touched, setTouched] = useState({
        email: false,
        password: false
    });

    // Validate on change
    useEffect(() => {
        const errors = {};
        if (touched.email) {
            const emailValidation = validators.email(formData.email);
            errors.email = emailValidation.error;
        }
        if (touched.password) {
            const passwordValidation = validators.password(formData.password);
            errors.password = passwordValidation.error;
        }
        setFieldErrors(errors);
    }, [formData, touched]);

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
        const emailValid = validators.email(formData.email).isValid;
        const passwordValid = validators.password(formData.password).isValid;
        return emailValid && passwordValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Mark all fields as touched
        setTouched({ email: true, password: true });

        if (!isFormValid()) {
            setError('Please fix the errors above');
            return;
        }

        setLoading(true);

        const result = await login(formData.email, formData.password);

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
                        <LoginIcon
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
                            Welcome Back
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Login to track your spiritual practice
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
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={() => handleBlur('email')}
                            required
                            margin="normal"
                            variant="outlined"
                            sx={{ mb: 2 }}
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
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={() => handleBlur('password')}
                            required
                            margin="normal"
                            variant="outlined"
                            sx={{ mb: 3 }}
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

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading || !isFormValid()}
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
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2">
                            Don't have an account?{' '}
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => navigate('/signup')}
                                sx={{
                                    fontWeight: 600,
                                    color: '#667eea',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                Sign Up
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
