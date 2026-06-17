const Project = require('../models/Project');

// Real subject in the Proxy pattern: performs the actual project data
// operations against MongoDB. It deliberately knows nothing about access
// control — that responsibility belongs to the ProjectProxy that wraps it.
class ProjectService {

    // Returns every project with its owner populated (admin view, Jira FPM-22).
    async getAllProjects() {
        return Project.find().populate('userId', 'name email');
    }

    // Deletes any project by id (admin delete, Jira FPM-30). Returns the
    // deleted project, or null when no project matches the id.
    async deleteProject(id) {
        const project = await Project.findById(id);

        if (!project) {
            return null;
        }

        await project.deleteOne();
        return project;
    }
}

module.exports = ProjectService;
