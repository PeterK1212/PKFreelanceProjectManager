class ProjectSubject {

    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    notify(event, project) {

        this.observers.forEach(observer =>
            observer.update(event, project)
        );

    }

}

module.exports = new ProjectSubject();