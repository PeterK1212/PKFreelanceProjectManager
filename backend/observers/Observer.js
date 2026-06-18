class Observer {

    update(event, project) {
        throw new Error(
            'update() must be implemented'
        );
    }

}

module.exports = Observer;