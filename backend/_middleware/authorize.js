const jwt = require('express-jwt');
const { secret } = require('../config'); 
const db = require('../_helpers/db');         

module.exports = authorize;

function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        jwt({ secret, algorithms: ['HS256'] }),

        async (req, res, next) => {
            try {
                if (!req.user || !req.user.id) {
                    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
                }

                if (!db.sequelize || !db.Account) {
                    console.error('Database connection issue detected in authorize middleware');
                    return res.status(503).json({ message: 'Database service unavailable' });
                }

                const account = await db.Account.findByPk(req.user.id);
                if (!account || (roles.length && !roles.includes(account.role))) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                
                req.user.role = account.role;
                
                if (typeof account.getRefreshTokens === 'function') {
                    const refreshTokens = await account.getRefreshTokens();
                    req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
                } else {
                    req.user.ownsToken = () => false;
                }
                
                next();
            } catch (error) {
                console.error('Authorization error:', error);
                return res.status(500).json({ message: 'Internal server error during authorization' });
            }
        }
    ];
}