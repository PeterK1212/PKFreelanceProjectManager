const BaseHandler = require('./BaseHandler');

class TitleValidationHandler extends BaseHandler {

    handle(projectData) {

        if (!projectData.title) {
            throw new Error('Project title is required');
        }

        return super.handle(projectData);
    }
}

module.exports = TitleValidationHandler;