const express = require('express');

// Admin View/Get projects route (Jira FPM-22)
// Admin Delete project route (Jira FPM-30)
const {
    //getAllUsers,
    getAllProjects,
    //deleteUser,
    deleteProject,
} = require('../controllers/adminController');

const { protect } = require('../middleware/authMiddleware');

const { admin } = require('../middleware/adminMiddleware');

const router = express.Router();

/*router.get(
    '/users',
    protect,
    admin,
    getAllUsers
);*/

router.get(
    '/projects',
    protect,
    admin,
    getAllProjects
);

/*router.delete(
    '/users/:id',
    protect,
    admin,
    deleteUser
);*/

router.delete(
    '/projects/:id',
    protect,
    admin,
    deleteProject
);

module.exports = router;