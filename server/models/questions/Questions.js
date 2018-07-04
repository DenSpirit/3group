var mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({
    header: {type: String, required: true},
    difficulty: Number,
    maxCost: {type: Number, default: 0},
    parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Question'},
    autoCheck: {type: Boolean, required: true, default: false}
}, {
    discriminatorKey: 'type'
});

QuestionSchema.methods.getQuestion = function () {
    return JSON.stringify(this);
};

exports.Question = mongoose.model('Question', QuestionSchema);
