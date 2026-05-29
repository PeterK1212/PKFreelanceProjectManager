//const User = require('../models/User');
const Project = require('../models/Project');

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
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('userId', 'name email');
        res.json(projects);
    } catch (error) {

        res.status(500).json({
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
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: 'Project not found',
            });
        }

        await project.deleteOne();

        res.json({
            message: 'Project deleted',
        });
    } catch (error) {
        res.status(500).json({
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