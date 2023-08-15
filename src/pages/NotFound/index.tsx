import { Box } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <Box sx={{ mt: 40, textAlign: 'center'}}>
            <h1>404 · Page not found</h1>
            <Box sx={{ mt: 2}}>
                <Link to="/">&lt; Go to Home</Link>
            </Box>
        </Box>
    )
}

export default NotFound