const { ZodError } = require('zod');
const fs = require('fs');

const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
                file: req.file,
            });
            next();
        } catch (error) {
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Cleanup failed:', err);
                });
            }
            next(error);
        }
    };
};

module.exports = validate;
