const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        type: { 
            type: DataTypes.STRING, 
            allowNull: false,
            validate: {
                isIn: [['Equipment', 'Leave', 'Resources', 'Other']]
            }
        },
        status: { 
            type: DataTypes.STRING, 
            allowNull: false,
            defaultValue: 'Pending',
            validate: {
                isIn: [['Pending', 'Approved', 'Rejected']]
            }
        },
        comments: { 
            type: DataTypes.TEXT, 
            allowNull: true 
        },
        created: { 
            type: DataTypes.DATE, 
            allowNull: false, 
            defaultValue: DataTypes.NOW 
        },
        updated: { 
            type: DataTypes.DATE 
        }
    };

    const options = {
        timestamps: false,
    };

    return sequelize.define('request', attributes, options);
}