const Observer = require('./Observer');

class LogObserver extends Observer {

    update(event, project) {

        console.log(
            `[LOG] ${event}: ${project.title}`
        );

    }

}

module.exports = LogObserver;