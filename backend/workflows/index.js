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

async function create(req, res, next) {
    try {
        const workflow = await db.Workflow.create(req.body);
        res.status(201).json(workflow);
    } catch (err) { 
        next(err); 
    }
}

async function getAll(req, res, next) {
    try {
        const workflows = await db.Workflow.findAll({
            include: [{ model: db.Employee }]
        });
        res.json(workflows);
    } catch (err) { 
        next(err); 
    }
}

async function getById(req, res, next) {
    try {
        const workflow = await db.Workflow.findByPk(req.params.id, {
            include: [{ model: db.Employee }]
        });
        if (!workflow) throw new Error('Workflow not found');
        res.json(workflow);
    } catch (err) { 
        next(err); 
    }
}

async function update(req, res, next) {
    try {
        const workflow = await db.Workflow.findByPk(req.params.id);
        if (!workflow) throw new Error('Workflow not found');
        await workflow.update(req.body);
        res.json(workflow);
    } catch (err) { 
        next(err); 
    }
}

async function _delete(req, res, next) {
    try {
        const workflow = await db.Workflow.findByPk(req.params.id);
        if (!workflow) throw new Error('Workflow not found');
        await workflow.destroy();
        res.json({ message: 'Workflow deleted' });
    } catch (err) { 
        next(err); 
    }
}

module.exports = router;