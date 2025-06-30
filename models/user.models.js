/* const { Schema } = require('mongoose');

const { backBaseConnection } = require('../startup');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = backBaseConnection.model('User', userSchema);
 */