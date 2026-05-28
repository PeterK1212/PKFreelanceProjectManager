const mongoose = require('mongoose');

// Schema for user (freelancer) project data (Jira FPM-4)
const projectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    title: {
        type: String,
        required: true
    },

    clientName: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    budget: {
        type: Number
    },

    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },

    deadline: {
        type: Date
    },
});

module.exports = mongoose.model('Project', projectSchema);