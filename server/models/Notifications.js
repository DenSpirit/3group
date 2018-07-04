var mongoose = require('mongoose');

var NotificationSchema = new mongoose.Schema({
    type: {type: String, enum: ['request', 'done'] , required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    teacher: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    test: {type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true}
});

NotificationSchema.methods.getNotification = function () {
    if(this.type === 'request') {
        return {
            userId: this.user.id,
            notificationId: this.id,
            type: this.type,
            user: this.user.firstName + ' ' + this.user.lastName,
            testId: this.test
        }
    } else if(this.type === 'done') {
        return {
            notificationId: this.id,
            type: this.type,
            user: this.user.firstName + ' ' + this.user.lastName,
            teacher: this.teacher.firstName + ' ' + this.teacher.lastName
        }
    }
};

exports.Notification = mongoose.model('Notification', NotificationSchema);
