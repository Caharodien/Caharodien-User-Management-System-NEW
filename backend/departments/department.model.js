const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        name: { 
            type: DataTypes.STRING, 
            allowNull: false, 
            unique: true 
        },
        description: { 
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

    return sequelize.define('department', attributes, options);
}