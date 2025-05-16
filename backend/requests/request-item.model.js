const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        name: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        description: { 
            type: DataTypes.TEXT, 
            allowNull: true 
        },
        quantity: { 
            type: DataTypes.INTEGER, 
            allowNull: false, 
            defaultValue: 1 
        }
    };

    const options = {
        timestamps: false,
    };

    return sequelize.define('requestItem', attributes, options);
}