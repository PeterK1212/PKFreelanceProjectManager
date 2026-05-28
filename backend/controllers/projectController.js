const Project = require('../models/Project');

// View/Get user (freelancer) project (Jira FPM-10)
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.user.id });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add/Create user (freelancer) project (Jira FPM-4)
const addProject = async (req, res) => {

    const {
        title,
        clientName,
        description,
        budget,
        status,
        deadline
    } = req.body;

    try {

        const project = await Project.create({
            userId: req.user.id,
            title,
            clientName,
            description,
            budget,
            status,
            deadline
        });

        res.status(201).json(project);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user (freelancer) project (Jira FPM-14)
const updateProject = async (req, res) => {

    const {
        title,
        clientName,
        description,
        budget,
        status,
        deadline
    } = req.body;

    try {

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        project.title = title || project.title;

        project.clientName =
            clientName || project.clientName;

        project.description =
            description || project.description;

        project.budget =
            budget || project.budget;

        project.status =
            status || project.status;

        project.deadline =
            deadline || project.deadline;

        const updatedProject = await project.save();

        res.json(updatedProject);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user (freelancer) project (Jira FPM-18)
const deleteProject = async (req, res) => {

    try {

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        await project.deleteOne();

        res.json({
            message: 'Project deleted'
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProjects,
    addProject,
    updateProject,
    deleteProject
};