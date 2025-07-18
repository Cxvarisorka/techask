const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            require: true,
            default: ''
        },
        author: {
            fullname: {
                type: String
            },
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,   
            },
            profileImg: {
                type: String
            }
            
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        answers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Answer"
            }
        ],
        tags: [{
            type: String,
            trim: true,
            lowercase: true,
            match: [/^[a-z0-9#]+$/, 'Invalid hashtag format.']
        }]
    },
    {
        timestamps: true,
    }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
