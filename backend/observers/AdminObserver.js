const Observer = require('./Observer');

class AdminObserver extends Observer {

    update(event, project) {

        console.log(
            `[ADMIN] ${event}: ${project.title}`
        );

    }

}

module.exports = AdminObserver;