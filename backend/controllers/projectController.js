const Project = require('../models/Project');

// PK: Integrate Builder, Chain of Responsibility, and Observer design patterns.
const ProjectBuilder =
    require('../builders/ProjectBuilder');

const ProjectSubject =
    require('../observers/ProjectSubject');

const LogObserver =
    require('../observers/LogObserver');

const AdminObserver =
    require('../observers/AdminObserver');

const TitleValidationHandler =
    require('../handlers/TitleValidationHandler');

const BudgetValidationHandler =
    require('../handlers/BudgetValidationHandler');

const DeadlineValidationHandler =
    require('../handlers/DeadlineValidationHandler');

// PK: Register Observer for project events (add, update, delete).
ProjectSubject.subscribe(
    new LogObserver()
);

ProjectSubject.subscribe(
    new AdminObserver()
);

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
/*const addProject = async (req, res) => {

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
};*/

// PK: Integrate project Builder, Chain of Responsibility, and Observer design patterns.
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

        const projectData =
            new ProjectBuilder(req.user.id)
                .setTitle(title)
                .setClientName(clientName)
                .setDescription(description)
                .setBudget(budget)
                .setStatus(status)
                .setDeadline(deadline)
                .build();

        const titleValidator =
            new TitleValidationHandler();

        const budgetValidator =
            new BudgetValidationHandler();

        const deadlineValidator =
            new DeadlineValidationHandler();

        titleValidator
            .setNext(budgetValidator)
            .setNext(deadlineValidator);

        titleValidator.handle(projectData);

        const project =
            await Project.create(projectData);

        ProjectSubject.notify(
            'PROJECT_CREATED',
            project
        );

        res.status(201).json(project);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

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

        // PK: Notify event for update project
        ProjectSubject.notify(
            'PROJECT_UPDATED',
            updatedProject
        );

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

        // PK: Notify event for delete project
        ProjectSubject.notify(
            'PROJECT_DELETED',
            project
        );

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