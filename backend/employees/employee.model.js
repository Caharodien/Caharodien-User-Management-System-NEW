const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        employeeId: { 
            type: DataTypes.STRING, 
            allowNull: false,
            unique: true
        },
        position: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        hireDate: { 
            type: DataTypes.DATE,
            allowNull: false 
        },
        status: { 
            type: DataTypes.STRING, 
            allowNull: false,
            defaultValue: 'Active',
            validate: {
                isIn: [['Active','Inactive']]
            }
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

    return sequelize.define('employee', attributes, options);
}