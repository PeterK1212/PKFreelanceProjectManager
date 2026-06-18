class BaseHandler {

    setNext(handler) {
        this.next = handler;
        return handler;
    }

    handle(projectData) {

        if (this.next) {
            return this.next.handle(projectData);
        }

        return true;
    }
}

module.exports = BaseHandler;