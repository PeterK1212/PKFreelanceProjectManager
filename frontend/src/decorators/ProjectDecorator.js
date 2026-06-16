// Decorator pattern: base decorator that wraps a project object and exposes
// its data through getData(). Concrete decorators extend this and override
// getData() to add computed fields, enhancing a project for display WITHOUT
// modifying the underlying MongoDB model. Decorators can be stacked, each
// wrapping the previous one.
class ProjectDecorator {
    constructor(project) {
        this.project = project;
    }

    // Unwraps the wrapped value: if it wraps another decorator, delegate to
    // it; otherwise return a shallow copy of the plain project so callers
    // never mutate the original.
    getData() {
        return this.project instanceof ProjectDecorator
            ? this.project.getData()
            : { ...this.project };
    }
}

export default ProjectDecorator;
