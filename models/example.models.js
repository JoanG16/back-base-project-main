/* const { Schema } = require('mongoose');
const { backBaseConnection } = require('../startup');

const exampleSchema = new Schema(
  {
    example_id: {
      type: Number,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = backBaseConnection.model('Example', exampleSchema);
 */