const mongoose = require("mongoose");

const Weeklyperformanceschema = new mongoose.Schema({
  StudentId: { type: String },
  Weekstartingdate: { type: Date },
  Questionscorrect: { type: Number, default: 0 },
  Totalquestionsattempted: { type: Number, default: 0 },
  Createdat: { type: Date, default: Date.Now },
});

const Weeklyperformance = mongoose.model(
  "Weeklyperformance",
  Weeklyperformanceschema
);

module.exports = Weeklyperformance;
