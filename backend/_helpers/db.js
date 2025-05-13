const config = require('../config');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Starting database initialization...');
    
    try {
        const dbConfig = process.env.NODE_ENV === 'production' 
            ? {
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT || '3306', 10),
                user: process.env.DB_USER,
                password: process.env.DB_PASS || process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            } 
            : config.database;
        
        console.log('DB Host:', dbConfig.host);
        console.log('DB Port:', dbConfig.port);
        console.log('DB User:', dbConfig.user);
        console.log('DB Name:', dbConfig.database);
        console.log('DB Password defined:', dbConfig.password ? 'Yes' : 'No');
        console.log('Connecting to database...');
        
        if (process.env.NODE_ENV !== 'production') {
            try {
                console.log('Creating database if it does not exist (development only)...');
                const connection = await mysql.createConnection({ 
                    host: dbConfig.host, 
                    port: dbConfig.port, 
                    user: dbConfig.user, 
                    password: dbConfig.password 
                });
                await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
                console.log('Database creation check completed');
            } catch (error) {
                console.error('Failed to create database:', error.message);
            }
        }
        
        console.log('Creating Sequelize instance...');
        const sequelize = new Sequelize(
            dbConfig.database,
            dbConfig.user,
            dbConfig.password,
            {
                host: dbConfig.host,
                dialect: 'mysql',
                logging: console.log,
                dialectOptions: {
                    supportBigNumbers: true,
                    bigNumberStrings: true
                }
            }
        );
        db.sequelize = sequelize;
        
        console.log('Attempting to authenticate database connection...');
        await sequelize.authenticate();
        console.log('Database connection authenticated successfully!');
        
        console.log('Defining models...');
        db.Account = require('../accounts/account.model')(sequelize);
        db.RefreshToken = require('../accounts/refresh-token.model')(sequelize);
        db.Employee = require('../employees/employee.model')(sequelize);
        db.Department = require('../departments/department.model')(sequelize);
        db.Workflow = require('../workflows/workflow.model')(sequelize);
        db.Request = require('../requests/request.model')(sequelize);
        db.RequestItem = require('../requests/request-item.model')(sequelize);

        console.log('Setting up model relationships...');
        db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
        db.RefreshToken.belongsTo(db.Account);
        
        db.Account.hasOne(db.Employee);
        db.Employee.belongsTo(db.Account);
        
        db.Department.hasMany(db.Employee);
        db.Employee.belongsTo(db.Department);
        
        db.Employee.hasMany(db.Workflow);
        db.Workflow.belongsTo(db.Employee);
        
        db.Employee.hasMany(db.Request);
        db.Request.belongsTo(db.Employee);
        
        db.Request.hasMany(db.RequestItem, { onDelete: 'CASCADE' });
        db.RequestItem.belongsTo(db.Request);
        
        console.log('Synchronizing database schema...');
        
        const syncOptions = { 
            force: false,  
            alter: false  
        };
        
        await sequelize.sync(syncOptions);
        console.log('Database synchronized successfully.');
        
        db.isConnected = true;
        console.log('Database initialization completed successfully.');

    } catch (error) {
        console.error('Database initialization error. Details:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState,
            sqlMessage: error.sqlMessage
        });
        
        console.error('Stack trace:', error.stack);
        
        db.isConnected = false;
        console.log('Setting up mock database functionality for graceful degradation...');
        
        db.sequelize = {
            transaction: (fn) => Promise.resolve(fn({ commit: () => Promise.resolve(), rollback: () => Promise.resolve() })),
            literal: (val) => val,
            Op: {
                eq: Symbol('eq'),
                ne: Symbol('ne'),
                gte: Symbol('gte'),
                gt: Symbol('gt'),
                lte: Symbol('lte'),
                lt: Symbol('lt'),
                in: Symbol('in'),
                notIn: Symbol('notIn'),
                is: Symbol('is'),
                like: Symbol('like'),
                notLike: Symbol('notLike')
            }
        };
        
        class MockModel {
            static findOne() { return Promise.resolve(null); }
            static findAll() { return Promise.resolve([]); }
            static create() { return Promise.resolve(null); }
            static update() { return Promise.resolve([0]); }
            static destroy() { return Promise.resolve(0); }
            static count() { return Promise.resolve(0); }
            static findByPk() { return Promise.resolve(null); }
            static scope() { return this; }
            
            constructor() {}
            save() { return Promise.resolve(this); }
            update() { return Promise.resolve(this); }
            destroy() { return Promise.resolve(this); }
        }
        
        db.Account = MockModel;
        db.RefreshToken = MockModel;
        db.Employee = MockModel;
        db.Department = MockModel;
        db.Workflow = MockModel;
        db.Request = MockModel;
        db.RequestItem = MockModel;
    }
}