module.exports = function (grunt, options) {
    return {
        options: {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_ACCESS_SECRET
        },
        stage: {
            options: {
                bucket: process.env.S3_BUCKET,
                region: process.env.S3_REGION
            },
            files: [
                {
                    src: ['releases/admin-ui-latest.zip'],
                    dest: '/',
                    action: 'upload'
                }
            ]
        },
        prod: {
            options: {
                bucket: process.env.S3_BUCKET,
                region: process.env.S3_REGION
            },
            files: [
                {
                    src: ['releases/admin-ui-latest.zip'],
                    dest: '/',
                    action: 'upload'
                }
            ]
        }
    };
};
