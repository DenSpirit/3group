var mongoose = require('mongoose');

var TestSchema = new mongoose.Schema({
    status: {type: String, enum: ['available', 'requested', 'checking', 'complete', 'run', 'wait'], required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    teacher: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}],
    fromTime: {type: Date},
    toTime: {type: Date},
    finishTime: {type: Date},
    result: {type: Number, required: true, default: 0},
    maxResult: {type: Number, required: true, default: 0}
});

TestSchema.methods.getTestInfo = function () {
    var month = (this.finishTime.getMonth() < 10 ? '0' : '') + (this.finishTime.getMonth() + 1);
    var day = (this.finishTime.getDate() < 10 ? '0' : '') + this.finishTime.getDate();
    var year = this.finishTime.getFullYear();
    return {
        id: this.id,
        date: day + '/' + month + '/' + year
    };
};

TestSchema.methods.getNotAutomaticallyCheckAnswers = function () {
    var answers = [];
    this.answers.forEach(function(answer, arr) {
        if(!answer.autoCheck) {
            var item = answer.getAnswerId();
            if(item !== null) {
                answers.push(item);
            }
        }
    });
    return answers;
};

exports.Test = mongoose.model('Test', TestSchema);
