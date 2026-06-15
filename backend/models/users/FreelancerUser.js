const BaseUser = require('./BaseUser');

// Concrete user type for freelancers (role 'user').
class FreelancerUser extends BaseUser {
    constructor(data) {
        super(data);
        this.role = 'user';
    }
}

module.exports = FreelancerUser;
