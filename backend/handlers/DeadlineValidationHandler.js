const BaseHandler = require('./BaseHandler');

class DeadlineValidationHandler extends BaseHandler {

    handle(projectData) {

        if (!projectData.deadline) {
            throw new Error('Deadline is required');
        }

        return super.handle(projectData);
    }
}

module.exports = DeadlineValidationHandler;