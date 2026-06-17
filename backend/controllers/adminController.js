//const User = require('../models/User');
const ProjectProxy = require('../proxies/ProjectProxy');

/*const getAllUsers = async (req, res) => {

    try {

        const users = await User.find();

        res.json(users);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};*/

// Admin View/Get projects (Jira FPM-22)
// Access is mediated by the Proxy pattern: ProjectProxy enforces the
// admin-only rule before delegating to the real ProjectService.
const getAllProjects = async (req, res) => {
    try {
        const proxy = new ProjectProxy(req.user);
        const projects = await proxy.getAllProjects();
        res.json(projects);
    } catch (error) {

        res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};

/*const deleteUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        await user.deleteOne();

        res.json({
            message: 'User deleted',
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};*/

// Admin Delete project (Jira FPM-30)
// Access is mediated by the Proxy pattern: ProjectProxy enforces the
// admin-only rule before delegating to the real ProjectService.
const deleteProject = async (req, res) => {
    try {
        const proxy = new ProjectProxy(req.user);
        const project = await proxy.deleteProject(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: 'Project not found',
            });
        }

        res.json({
            message: 'Project deleted',
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};

module.exports = {
    //getAllUsers,
    getAllProjects,
    //deleteUser,
    deleteProject,
};