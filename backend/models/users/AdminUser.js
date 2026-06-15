const BaseUser = require('./BaseUser');

// Concrete user type for administrators (role 'admin').
class AdminUser extends BaseUser {
    constructor(data) {
        super(data);
        this.role = 'admin';
    }
}

module.exports = AdminUser;
