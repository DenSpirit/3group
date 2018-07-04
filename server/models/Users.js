var mongoose = require('mongoose');
var crypto = require('crypto');

var UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required:true, unique: true},
    role: {type: String, enum: ['admin', 'teacher', 'user', 'guest'], required: true},
    hash: {type: String, required:true},
    salt: {type: String, required:true},
    level: {type: Number}
});

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

    return this.hash === hash;
};

UserSchema.methods.getInfo = function () {
  return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role
  }
};

UserSchema.methods.getMoreInfo = function () {
    return {
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        email: this.email
    }
};

exports.User = mongoose.model('User', UserSchema);
