const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const authorize = require('../_middleware/authorize')
const Role = require('../_helpers/role');
const accountService = require('./account.service');

router.post('/authenticate', authenticateSchema, authenticate);
router.post('/refresh-token', refreshToken);
router.post('/revoke-token', authorize(), revokeTokenSchema, revokeToken);
router.post('/register', registerSchema, register);
router.post('/verify-email', verifyEmailSchema, verifyEmail);
router.post('/forgot-password', forgotPasswordSchema, forgotPassword);
router.post('/validate-reset-token', validateResetTokenSchema, validateResetToken);
router.post('/reset-password', resetPasswordSchema, resetPassword);
router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.post('/', authorize(Role.Admin), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);
router.put('/:id/toggle-activation', authorize(Role.Admin), toggleActivation);

module.exports = router;

function toggleActivation(req, res, next) {
    accountService.toggleActivation(req.params.id)
        .then(account => res.json(account))
        .catch(next);
}

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    accountService.authenticate({ email, password, ipAddress })
        .then(result => {
            if (!result) {
                return res.status(400).json({ message: 'Authentication failed' });
            }
            const { refreshToken, ...account } = result;
            setTokenCookie(res, refreshToken);
            res.json(account);
        })
        .catch(error => {
            console.error('Authentication error:', error);
            res.status(400).json({ message: typeof error === 'string' ? error : 'Authentication failed' });
        });
}

function refreshToken(req, res, next) {
    const token = req.cookies?.refreshToken; 
    const ipAddress = req.ip;
    
    if (!token) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }
    
    accountService.refreshToken({ token, ipAddress })
        .then(({ refreshToken, ...account }) => {
            setTokenCookie(res, refreshToken);
            res.json(account);
        })
        .catch(next);
}

function revokeTokenSchema(req, res, next) {
    const schema = Joi.object({
    token: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

function revokeToken(req, res, next) {
    const token = req.body.token || req.cookies.refreshToken;
    const ipAddress = req.ip;
    if (!token) return res.status(400).json({ message: 'Token is required' });
    if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    accountService.revokeToken({ token, ipAddress })
        .then(() => res.json({ message: 'Token revoked' }))
        .catch(next);
}
function registerSchema(req, res, next) {
    const schema = Joi.object({
    title: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    acceptTerms: Joi.boolean().valid(true).required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    const origin = req.get('origin') || req.headers.origin || req.headers.referer || 'http://localhost:4000';
    accountService.register(req.body, origin)
        .then(() => res.json({ message: 'Registration successful, please check your email for verification instructions' }))
        .catch(next);
}

function verifyEmailSchema(req, res, next) {
    const schema = Joi.object({
    token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function verifyEmail(req, res, next) {
    console.log('Verify email request received with body:', req.body);
    console.log('Token from request:', req.body.token);
    accountService.verifyEmail(req.body)
        .then(() => {
            console.log('Verification successful in controller, sending success response');
            res.json({ message: 'Verification successful, you can now login' });
        })
        .catch(error => {
            console.error('Verification failed in controller with error:', error);
            next(error);
        });
}

function forgotPasswordSchema(req, res, next) {
    const schema = Joi.object({
    email: Joi.string().email().required()
    });
    validateRequest(req, next, schema);
}

function forgotPassword(req, res, next) {
    accountService.forgotPassword(req.body, req.get('origin'))
    .then(() => res.json({ message: 'Please check your email for password reset instructions' }))
    .catch(next);
}
function validateResetTokenSchema(req, res, next) {
    const schema = Joi.object({
    token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function validateResetToken(req, res, next) {
    accountService.validateResetToken(req.body)
    .then(() => res.json({
    message: 'Token is valid' }))
    .catch(next);
}

function resetPasswordSchema(req, res, next) {
    const schema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    });
    validateRequest(req, next, schema);
}

function resetPassword(req, res, next) {
    accountService.resetPassword(req.body)
    .then(() => res.json({
    message: 'Password reset successful, you can now login' }))
    .catch(next);
}

function getAll(req, res, next) {
    accountService.getAll()
    .then(accounts => res.json(accounts))
    .catch(next);
}

function getById(req, res, next) {
    if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: 'Unauthorized' });
    }
    accountService.getById(req.params.id)
    .then(account => account ? res.json(account) : res.sendStatus(404))
    .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
    title: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    role: Joi.string().valid(Role.Admin, Role.User).required()
});

validateRequest(req, next, schema);
}
function create(req, res, next) {
    accountService.create(req.body)
    .then(account => res.json(account))
    .catch(next);
}
function updateSchema(req, res, next) {
    const schemaRules = {
    title: Joi.string().empty(''),
    firstName: Joi.string().empty(''),
    lastName: Joi.string().empty(''),
    email: Joi.string().email().empty(''),
    password: Joi.string().min(6).empty(''),
    confirmPassword: Joi.string().valid(Joi.ref('password')).empty(''),
    isActive: Joi.boolean().empty('')
};
if (req.user.role === Role.Admin) {
    schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty('');
}
const schema = Joi.object(schemaRules).with('password', 'confirmPassword');
validateRequest(req, next, schema);
}

function update(req, res, next) {
    if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({
    message: 'Unauthorized' });
    }
    accountService.update(req.params.id, req.body)
    .then(account => res.json(account))
    .catch(next);
}

function _delete(req, res, next) {
    if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin){
    return res.status(401).json({ message: 'Unauthorized' });
    }
    accountService.delete(req.params.id)
    .then(() => res.json({ message: 'Account deleted successfully' }))
    .catch(next);
}
function setTokenCookie(res, token) {
    const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7*24*60*60*1000)
    };
    res.cookie('refreshToken', token, cookieOptions);
}