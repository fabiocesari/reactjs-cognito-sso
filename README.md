# reactjs-cognito-sso

This is a sample template for a ReactJS application with SSO login through Amazon Cognito. 

- Retrieves both user email and cognito:groups from the SAML Id Token
- Retrieves temporary AWS credentials to call an AWS Lambda function

The Cognito User Pool must be linked to a Cognito Identity Pool, and the Authenticated Role of the Identity Pool must allow the lambda:Invoke action on your AWS Lambda function. Similarly, access to other AWS services can be granted.

## AWS Lambda group-based authorization

Using Cognito User Pool Groups for authorization requires sending the JWT token to the Lambda function along with other parameters. The JWT token must be properly verified within the Lambda function, then the cognito:groups can be read and used to authorize users based on the group(s) they belong to.

## Azure AD application

azuread-auth-req-metadata.xml is a template that can be used to create the application on Azure AD.

## Install node modules

    yarn 

## Start local

    yarn start
