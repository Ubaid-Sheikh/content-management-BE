const { ZodError } = require('zod');
const fs = require('fs');

/**
 * Validation Middleware Factory
 * Validates request data against Zod schema
 */
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            console.log('--- Incoming Validation ---');
            console.log('Path:', req.path);
            console.log('Body Keys:', Object.keys(req.body));
            console.log('File:', req.file ? req.file.originalname : 'none');

            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
                file: req.file,
            });
            next();
        } catch (error) {
            console.warn('--- Validation Failed ---');

            // Log details for debugging
            if (error instanceof ZodError) {
                console.warn('Validation Errors:', JSON.stringify(error.errors, null, 2));
            } else {
                console.error('Validation Exception:', error);
            }

            // Cleanup uploaded file on validation failure
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Error deleting file after validation failure:', err);
                });
            }

            next(error);
        }
    };
};

module.exports = validate;
