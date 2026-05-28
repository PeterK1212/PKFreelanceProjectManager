const express = require('express');

// Add user project routes (Jira FPM-4)
const {
    getProjects,
    addProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router
    .route('/')
    .get(protect, getProjects)
    .post(protect, addProject);

router
    .route('/:id')
    .put(protect, updateProject)
    .delete(protect, deleteProject);

module.exports = router;