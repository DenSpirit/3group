var mongoose = require('mongoose');
var Question = require('./Questions').Question;
var fs = require('fs');

var AudioQuestionsSchema = new mongoose.Schema({
    path: {type: String, required: true},
    subQuestions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true}]
}, {
    discriminatorKey: 'type'
});

AudioQuestionsSchema.methods.getQuestion = function () {
    return {
        id: this.id,
        type: this.type,
        header: this.header,
        path: '../../../temp/' + this.path,
        subQuestions: this.subQuestions.map(function (item) {
            return item.id;
        })
    };
};

AudioQuestionsSchema.methods.createTempFile = function () {
    fs.createReadStream(__dirname + '/../../assets/' + this.path).pipe(fs.createWriteStream(__dirname + '/../../../temp/' + this.path));
};

AudioQuestionsSchema.methods.deleteTempFile = function () {
    fs.unlink(__dirname + '/../../../temp/' + this.path);
};

exports.AudioQuestion = Question.discriminator('AudioQuestion', AudioQuestionsSchema);
