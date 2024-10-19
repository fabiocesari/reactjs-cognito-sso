import { CognitoAuth } from 'amazon-cognito-auth-js';
import AWS from 'aws-sdk';
import { jwtDecode } from 'jwt-decode';

export const configureAuth = (setIsAuthenticated, setUserEmail, setAwsCredentials, setUserGroups, setJWTToken) => {
    const currentDomain = window.location.hostname;
    let redirectUriSignIn = 'http://localhost:3000/index.html';
    let redirectUriSignOut = 'http://localhost:3000/index.html';

    if (currentDomain === 'your.domain.com') {
        redirectUriSignIn = 'https://your.domain.com/index.html';
        redirectUriSignOut = 'https://your.domain.com/index.html';
    }

    const authData = {
        ClientId: 'your-cognito-client-id',
        AppWebDomain: 'your-cognito-hosted-ui.auth.eu-west-1.amazoncognito.com',
        TokenScopesArray: ['email', 'openid', 'profile'],
        RedirectUriSignIn: redirectUriSignIn,
        RedirectUriSignOut: redirectUriSignOut,
    };

    const cognitoAuth = new CognitoAuth(authData);
    cognitoAuth.userhandler = {
        onSuccess: (result) => {
            console.log('Sign in successful');
            setIsAuthenticated(true);

            const decodedIdToken = jwtDecode(result.idToken.jwtToken);
            const email = decodedIdToken.email || decodedIdToken.identities[0].userId || '';
            const groups = decodedIdToken['cognito:groups'] || [];

            setUserEmail(email);
            setUserGroups(groups);
            setJWTToken(result.idToken.jwtToken);

            retrieveAWSCredentials(result.idToken.jwtToken, setAwsCredentials);
        },
        onFailure: (err) => {
            console.error('Sign in failed', err);
        },
    };

    return cognitoAuth;
};

export const handleCognitoAuth = (cognitoAuth, setIsAuthenticated, setUserEmail, setAwsCredentials, setUserGroups, setJWTToken) => {
    if (window.location.hash) {
        cognitoAuth.parseCognitoWebResponse(window.location.href);
        // Remove hash from URL after parsing
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    } else if (!cognitoAuth.isUserSignedIn()) {
        cognitoAuth.getSession();
    } else {
        const session = cognitoAuth.getSignInUserSession();
        setIsAuthenticated(true);

        jwtToken = session.getIdToken().getJwtToken();
        const decodedIdToken = jwtDecode(jwtToken);
        const email = decodedIdToken.email || decodedIdToken.identities[0].userId || '';
        const groups = decodedIdToken['cognito:groups'] || [];

        setUserEmail(email);
        setUserGroups(groups);
        setJWTToken(jwtToken);

        retrieveAWSCredentials(jwtToken, setAwsCredentials);
    }
};

export const handleSignOut = (auth, setIsAuthenticated) => {
    if (auth) {
        auth.signOut();
        setIsAuthenticated(false);
    }
};

const retrieveAWSCredentials = (idToken, setAwsCredentials) => {
    AWS.config.region = 'your-aws-region';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'your-aws-cognito-identity-pool-id',
        Logins: {
            'cognito-idp.your-aws-region.amazonaws.com/your-aws-cognito-user-pool-id': idToken,
        },
    });

    AWS.config.credentials.get((err) => {
        if (err) {
            console.error('Error retrieving AWS credentials:', err);
            return;
        }
        console.log('AWS Credentials retrieved successfully');
        setAwsCredentials(AWS.config.credentials);
    });
};
