// Base class for the user type hierarchy used by the Factory pattern.
// Holds the common user fields and exposes a buildPayload() method that
// subclasses inherit. Subclasses set the role, demonstrating inheritance
// and polymorphism without changing the Mongoose schema.
class BaseUser {
    constructor({ name, email, password }) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = 'user';
    }

    // Returns the plain object passed to Mongoose's User.create().
    buildPayload() {
        return {
            name: this.name,
            email: this.email,
            password: this.password,
            role: this.role,
        };
    }
}

module.exports = BaseUser;
