const chai = require('chai');

const TitleValidationHandler =
    require('../handlers/TitleValidationHandler');

const BudgetValidationHandler =
    require('../handlers/BudgetValidationHandler');

const DeadlineValidationHandler =
    require('../handlers/DeadlineValidationHandler');

const { expect } = chai;

describe('Validation Chain Test', () => {

    it('should pass valid project data', () => {

        const title =
            new TitleValidationHandler();

        const budget =
            new BudgetValidationHandler();

        const deadline =
            new DeadlineValidationHandler();

        title
            .setNext(budget)
            .setNext(deadline);

        expect(() =>
            title.handle({
                title: 'Website',
                budget: 1000,
                deadline: '2026-07-01'
            })
        ).to.not.throw();

    });

    it('should fail when title missing', () => {

        const title =
            new TitleValidationHandler();

        expect(() =>
            title.handle({
                budget: 1000,
                deadline: '2026-07-01'
            })
        ).to.throw();

    });

    it('should fail when budget negative', () => {

        const title =
            new TitleValidationHandler();

        const budget =
            new BudgetValidationHandler();

        title.setNext(budget);

        expect(() =>
            title.handle({
                title: 'Website',
                budget: -100
            })
        ).to.throw();

    });

});