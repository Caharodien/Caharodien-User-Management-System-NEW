const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');

router.post('/', authorize(Role.Admin), create);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(Role.Admin), update);
router.delete('/:id', authorize(Role.Admin), _delete);
router.post('/:id/transfer', authorize(Role.Admin), transfer);

async function create(req, res, next) {
    try {
        const { accountId, ...employeeData } = req.body;
        
        const employee = await db.Employee.create(employeeData);
        
        if (accountId) {
            const account = await db.Account.findByPk(accountId);
            if (!account) throw new Error('Account not found');
            
            await employee.setAccount(account);
        }
        
        const createdEmployee = await db.Employee.findByPk(employee.id, {
            include: [{ model: db.Account }, { model: db.Department }]
        });
        
        res.status(201).json(createdEmployee);
    } catch (err) { 
        next(err); 
    }
}
async function getAll(req, res, next) {
    try {
        const employees = await db.Employee.findAll({
            include: [{ model: db.Account }, { model: db.Department }]
        });
        res.json(employees);
    } catch (err) { 
        next(err); 
    }
}
async function getById(req, res, next) {
    try {
        const employee = await db.Employee.findByPk(req.params.id, {
            include: [{ model: db.Account }, { model: db.Department }]
        });
        if (!employee) throw new Error('Employee not found');
        res.json(employee);
    } catch (err) { 
        next(err); 
    }
}
async function update(req, res, next) {
    try {
        const employee = await db.Employee.findByPk(req.params.id);
        if (!employee) throw new Error('Employee not found');
        await employee.update(req.body);
        res.json(employee);
    } catch (err) { 
        next(err); 
    }
}
async function _delete(req, res, next) {
    try {
        const employee = await db.Employee.findByPk(req.params.id);
        if (!employee) throw new Error('Employee not found');
        await employee.destroy();
        res.json({ message: 'Employee deleted' });
    } catch (err) { 
        next(err); 
    }
}
async function transfer(req, res, next) {
    try {
        const employee = await db.Employee.findByPk(req.params.id);
        if (!employee) throw new Error('Employee not found');
        await employee.update({ departmentId: req.body.departmentId });
        await db.Workflow.create({
            employeeId: employee.id,
            type: 'Transfer',
            details: { newDepartmentId: req.body.departmentId }
        });
        res.json({ message: 'Employee transferred' });
    } catch (err) { 
        next(err); 
    }
}
module.exports = router;