const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    course: {
        type: String,
        required: true,
    },
    
    userEmail: {
    type: String,
    default: "",
},
    careerGoal: {
    type: String,
    default: "",
},

mentorFeedback: {
    type: String,
    default: "",
},

supportStatus: {
    type: String,
    enum: ["Needs Attention", "In Progress", "Improving", "On Track"],
    default: "Needs Attention",
},

    skills: [
        {
            name: {
                type: String,
                required: true,
            },

            level: {
                type: String,
                enum: ["Beginner", "Intermediate", "Advanced"],
                default: "Beginner",
            },
        },
    ],
});

module.exports = mongoose.model("Student", studentSchema);