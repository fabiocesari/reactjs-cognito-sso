import AWS from 'aws-sdk';

export const invokeLambdaFunction = (awsCredentials, event) => {
    const lambda = new AWS.Lambda();
    const params = {
        FunctionName: 'your-function-name',
        Payload: JSON.stringify(event),
    };
    lambda.invoke(params, (err, data) => {
        if (err) {
            console.error('Error invoking Lambda function:', err);
        } else {
            console.log('Lambda function invoked successfully:', data.Payload);
        }
    });
};
