const chai = require('chai');

const { expect } = chai;

describe('Observer Pattern Test', () => {

    it('should notify observer', () => {

        let called = false;

        const observer = {
            update: () => {
                called = true;
            }
        };

        const subject = {
            observers: [],

            subscribe(observer) {
                this.observers.push(observer);
            },

            notify(event, project) {
                this.observers.forEach(
                    obs => obs.update(event, project)
                );
            }
        };

        subject.subscribe(observer);

        subject.notify(
            'PROJECT_CREATED',
            {
                title: 'Website'
            }
        );

        expect(called)
            .to.equal(true);

    });

});