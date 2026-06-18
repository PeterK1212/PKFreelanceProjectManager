const BaseHandler = require('./BaseHandler');

class BudgetValidationHandler extends BaseHandler {

    handle(projectData) {

        if (projectData.budget < 0) {
            throw new Error('Budget cannot be negative');
        }

        return super.handle(projectData);
    }
}

module.exports = BudgetValidationHandler;