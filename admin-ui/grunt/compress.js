module.exports = function (grunt, options) {
    return {
        stage: {
            options: {
                archive: 'releases/client-latest.zip'
            },
            files: [
                {
                    expand: true,
                    cwd: '<%= web %>/',
                    src: ['**']
                }
            ]
        },
        prod: {
            options: {
                archive: 'releases/client-dist.zip'
            },
            files: [
                {
                    expand: true,
                    cwd: '<%= web %>/',
                    src: ['**']
                }
            ]
        }
    };
};
