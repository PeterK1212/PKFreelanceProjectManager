class ProjectBuilder {

    constructor(userId) {
        this.project = {
            userId
        };
    }

    setTitle(title) {
        this.project.title = title;
        return this;
    }

    setClientName(clientName) {
        this.project.clientName = clientName;
        return this;
    }

    setDescription(description) {
        this.project.description = description;
        return this;
    }

    setBudget(budget) {
        this.project.budget = budget;
        return this;
    }

    setStatus(status) {
        this.project.status = status;
        return this;
    }

    setDeadline(deadline) {
        this.project.deadline = deadline;
        return this;
    }

    build() {
        return this.project;
    }
}

module.exports = ProjectBuilder;