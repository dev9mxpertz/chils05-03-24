const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [{ type: String }],
  answer: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
  },

  difficultyLevel: {
    type: String,
    required: true,
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
