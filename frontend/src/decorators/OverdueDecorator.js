import ProjectDecorator from './ProjectDecorator';

// Adds an isOverdue flag: true when the deadline has passed and the project
// is not yet completed.
class OverdueDecorator extends ProjectDecorator {
    getData() {
        const data = super.getData();

        const isOverdue =
            !!data.deadline &&
            data.status !== 'Completed' &&
            new Date(data.deadline).getTime() < Date.now();

        return { ...data, isOverdue };
    }
}

export default OverdueDecorator;
