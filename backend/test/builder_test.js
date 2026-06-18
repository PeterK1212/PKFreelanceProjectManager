const chai = require('chai');

const ProjectBuilder =
    require('../builders/ProjectBuilder');

const { expect } = chai;

describe('ProjectBuilder Test', () => {

    it('should build a project correctly', () => {

        const project =
            new ProjectBuilder('user123')
                .setTitle('Website')
                .setClientName('ABC Company')
                .setDescription('New Website')
                .setBudget(5000)
                .setStatus('Pending')
                .setDeadline('2026-07-01')
                .build();

        expect(project.userId)
            .to.equal('user123');

        expect(project.title)
            .to.equal('Website');

        expect(project.clientName)
            .to.equal('ABC Company');

        expect(project.budget)
            .to.equal(5000);

        expect(project.status)
            .to.equal('Pending');

    });

});