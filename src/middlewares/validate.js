/**
 * Validation Middleware Factory
 * Validates request data against Zod schema
 */
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
                file: req.file, // Pass file info to schema if needed
            });
            next();
        } catch (error) {
            // If validation fails and a file was uploaded, delete it to save space
            if (req.file && req.file.path) {
                const fs = require('fs');
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Error deleting file after validation failure:', err);
                });
            }
            next(error);
        }
    };
};

module.exports = validate;
