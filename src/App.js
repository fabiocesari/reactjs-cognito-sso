import React, { useEffect, useState } from 'react';
import { Button, Container, Typography, Box, Paper } from '@mui/material';
import { configureAuth, handleCognitoAuth, handleSignOut } from './auth';
import { invokeLambdaFunction } from './lambda';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [auth, setAuth] = useState(null);
    const [awsCredentials, setAwsCredentials] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const [userGroups, setUserGroups] = useState([]);
    const [jwtToken, setJWTToken] = useState(null);

    useEffect(() => {
        const cognitoAuth = configureAuth(setIsAuthenticated, setUserEmail, setAwsCredentials, setUserGroups, setJWTToken);
        setAuth(cognitoAuth);
        handleCognitoAuth(cognitoAuth, setIsAuthenticated, setUserEmail, setAwsCredentials, setUserGroups, setJWTToken);
    }, []);

    const invokeLambda = () => {
        if (!awsCredentials) {
            console.error('AWS credentials are not available');
            return;
        }
        const sample_event = { event_key: 'event_value', jwt_token: jwtToken };
        invokeLambdaFunction(awsCredentials, sample_event);
    };

    if (!isAuthenticated) {
        return (
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 4, mt: 10, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary" gutterBottom>
                        Redirecting to SSO...
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Please wait while we securely redirect you to the login page.
                    </Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
                <Box textAlign="center">
                    <Typography variant="h3" color="primary" gutterBottom>
                        Welcome
                    </Typography>
                    <Typography variant="body1" color="textSecondary" mt={1}>
                        User Email: <strong>{userEmail}</strong>
                    </Typography>
                    <Typography variant="body1" color="textSecondary" mt={1}>
                        User Groups: <strong>{userGroups.join(', ')}</strong>
                    </Typography>
                    <Box mt={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSignOut(auth, setIsAuthenticated)}
                            sx={{ m: 1 }}
                        >
                            Sign Out
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={invokeLambda}
                            sx={{ m: 1 }}
                        >
                            Invoke Lambda
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default App;