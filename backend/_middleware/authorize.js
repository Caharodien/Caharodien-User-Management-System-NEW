const jwt = require('express-jwt');
<<<<<<< HEAD
const { secret } = require('../config.json');  // Changed to use relative path
const db = require('../_helpers/db');         // Changed to use relative path
=======
const { secret } = require('../config'); 
const db = require('../_helpers/db');         
>>>>>>> 3ff026b10d1c5b0e8e5068e54a7cce7fa532e1ef

module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User')
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret, algorithms: ['HS256'] }),

        // authorize based on user role
        async (req, res, next) => {
<<<<<<< HEAD
            const account = await db.Account.findByPk(req.user.id);

            if (!account || (roles.length && !roles.includes(account.role))) {
                // account no longer exists or role not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            req.user.role = account.role;
            const refreshTokens = await account.getRefreshTokens();
            req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
            
            next();
=======
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
>>>>>>> 3ff026b10d1c5b0e8e5068e54a7cce7fa532e1ef
        }
    ];
}