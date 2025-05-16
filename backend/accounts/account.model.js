const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        email: { type: DataTypes.STRING, allowNull: false },
        passwordHash: { type: DataTypes.STRING, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: false },
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        acceptTerms: { type: DataTypes.BOOLEAN },
        role: { type: DataTypes.STRING, allowNull: false },
        verificationToken: { type: DataTypes.STRING },
        verified: { type: DataTypes.DATE },
        resetToken: { type: DataTypes.STRING },
        resetTokenExpires: { type: DataTypes.DATE },
        passwordReset: { type: DataTypes.DATE },
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE },
        isVerified: {
            type: DataTypes.VIRTUAL,
            get() { return !!(this.verified || this.passwordReset); }
        }
    };
<<<<<<< HEAD
=======

>>>>>>> 3ff026b10d1c5b0e8e5068e54a7cce7fa532e1ef
    const options = {
        // disable default timestamp fields (createdAt and updatedAt)
        timestamps: false,
        defaultScope: {
<<<<<<< HEAD
        // exclude password hash by default
        attributes: { exclude: ['passwordHash'] }
        },
        scopes: {
        // include hash with this scope
        withHash: { attributes: {}, } 
=======
            attributes: { exclude: ['passwordHash'] }
        },
        scopes: {
            withHash: { attributes: { include: ['passwordHash'] } }
>>>>>>> 3ff026b10d1c5b0e8e5068e54a7cce7fa532e1ef
        }
    };
    return sequelize.define('account', attributes, options);
}