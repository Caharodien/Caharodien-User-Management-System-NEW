const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        type: { 
            type: DataTypes.STRING, 
            allowNull: false,
            validate: {
                isIn: [['Onboarding', 'Transfer', 'Status Change', 'Termination']]
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
        details: { 
            type: DataTypes.JSON, 
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

    return sequelize.define('workflow', attributes, options);
}