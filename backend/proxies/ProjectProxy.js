const ProjectService = require('../services/ProjectService');

// Proxy pattern: ProjectProxy exposes the same interface as the real
// ProjectService but guards access to the sensitive admin operations
// (view all / delete any project). Only an admin user is let through; any
// other caller is rejected before the real service is ever touched, which
// keeps the access-control rule in one place instead of in every controller.
class ProjectProxy {

    // `user` is the authenticated user (req.user). The real subject is
    // injected so it can be substituted with a fake in unit tests.
    constructor(user, service = new ProjectService()) {
        this.user = user;
        this.service = service;
    }

    // Throws a 403 error unless the current user is an admin.
    _ensureAdmin() {
        if (!this.user || this.user.role !== 'admin') {
            const error = new Error('Admin access only');
            error.statusCode = 403;
            throw error;
        }
    }

    async getAllProjects() {
        this._ensureAdmin();
        return this.service.getAllProjects();
    }

    async deleteProject(id) {
        this._ensureAdmin();
        return this.service.deleteProject(id);
    }
}

module.exports = ProjectProxy;
