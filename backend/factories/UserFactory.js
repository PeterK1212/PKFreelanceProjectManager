const FreelancerUser = require('../models/users/FreelancerUser');
const AdminUser = require('../models/users/AdminUser');

// Factory pattern: centralises creation of role-specific user objects so
// controllers don't scatter `if (role === 'admin')` logic. Returns a user
// instance whose buildPayload() yields the document for User.create().
class UserFactory {
    static create(type, data) {
        switch (String(type || '').toLowerCase()) {
            case 'admin':
                return new AdminUser(data);
            case 'user':
            case 'freelancer':
                return new FreelancerUser(data);
            default:
                // Unknown/missing type defaults to a freelancer, preserving
                // the existing registration behaviour.
                return new FreelancerUser(data);
        }
    }
}

module.exports = UserFactory;
