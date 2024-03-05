const Adventure = require("../models/Adventure");
const Fantasy = require("../models/Fantasy");
const Historyfiction = require("../models/Historyfiction");
const Sciencefiction = require("../models/Sciencefiction");
const Sport = require("../models/Sport");
const Mystery = require("../models/Mystery");
const Weeklyperformance = require("../models/WeeklyPerformance");
const Question = require("../models/Quiz");
const ImageKit = require("imagekit");
const Admin = require("../models/admin");
const Student = require("../models/student");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/sendToken");
const sendOTP = require("../utils/sendOTP");
const bcrypt = require("bcrypt");

exports.FindUsername = catchAsyncErrors(async (req, res, next) => {
  try {
    const { Username } = req.body;
    const existingUser = await Student.findOne({ Username });
    if (existingUser) {
      const otp = await sendOTP(existingUser.Email);
      console.log(otp);
      existingUser.OTP = otp;

      await existingUser.save(); 
      return res
        .status(200)
        .json({ message: "User Successfully Find", existingUser });
    } else {
      return res
        .status(404)
        .json({ message: "No User Find with this Username " });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error " });
  }
});

exports.MatchOTP = catchAsyncErrors(async (req, res, next) => {
  const data = req.body;
  // console.log(data);
  const FoundedUser = data.FoundedUser;
  if (FoundedUser.OTP === Number(data.Otp)) {
    return res
      .status(200)
      .json({ message: "OTP  Matched Successfully ", FoundedUser });
  } else {
    return res.status(404).json({ message: "OTP Doesn't Match" });
  }
});

exports.Reset_Password = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id, New_Password } = req.body;
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND, 10));
    const hashedPassword = await bcrypt.hash(New_Password, salt);

    const updateData = await Student.findByIdAndUpdate(id, {
      Password: hashedPassword,
    });
    if (!updateData) {
      return res.status(404).json({ message: "No User Found !" });
    } else {
      const updatedData = await updateData.save();
      sendToken(updatedData, res, 201);
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error " });
  }
});

exports.Signup_admin = catchAsyncErrors(async (req, res, next) => {
  try {
    const { Username, Email, Password } = req.body;
    const existingUser = await Admin.findOne({ Username });
    if (existingUser) {
      return res.status(409).json({ message: "admin Username already exists" });
    }
    const newadmin = new Admin({
      Username,
      Email,
      Password,
    });
    await newadmin.save();
    sendToken(newadmin, res, 201);
  } catch (error) {
    return next(new ErrorHandler("No admin was Created ", 404));
  }
});

exports.Signin_user = async (req, res, next) => {
  try {
    const { Username, Password } = req.body;

    // Try to find the user in Student collection
    let user = await Student.findOne({ Username });
    if (!user) {
      user = await Admin.findOne({ Username });
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed. User not found." });
    }

    // Now user should be either a Student or an Admin
    const passwordMatch = await user.constructor.comparePassword(
      Password,
      user.Password
    );

    if (passwordMatch) {
      sendToken(user, res, 201);
    } else {
      res
        .status(401)
        .json({ message: "Authentication failed. Incorrect password." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.Signup = async (req, res, next) => {
  try {
    const { Username, Email, Password, Confirm_Password } = req.body;

    const existingUser = await Student.findOne({ Username });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Student Username already exists" });
    }
    const newStudent = new Student({
      Username,
      Password,
      Email,
    });
    await newStudent.save();
    sendToken(newStudent, res, 201);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.currentAdmin = catchAsyncErrors(async (req, res, next) => {
  const userType = await req.UserType;
  try {
    let user;
    if (userType === "student") {
      user = await Student.findById(req.id).exec();
    } else if (userType === "admin") {
      user = await Admin.findById(req.id).exec();
    }
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


exports.signout = async (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Successfully Logged Out!" });
};

// --------------------------------------------------------------------------------------------------------------------------  Adventure  ----------------

exports.createAdventure = async (req, res) => {
  try {
    const adventure = new Adventure(req.body);
    await adventure.save();
    // console.log(adventure);
    res.status(201).json(adventure);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllAdventures = async (req, res) => {
  try {
    const adventures = await Adventure.find();
    res.status(200).json(adventures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAdventureById = async (req, res) => {
  try {
    const adventure = await Adventure.findById(req.params.id);

    if (!adventure) {
      return res.status(404).json({ message: "Adventure not found" });
    }

    res.status(200).json(adventure);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateAdventure = async (req, res) => {
  try {
    const adventure = await Adventure.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    await adventure.save();
    res.status(200).json(adventure);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteAdventure = async (req, res) => {
  try {
    await Adventure.findByIdAndDelete(req.params.id);
    res
      .status(201)
      .json({ success: true, message: "The requested Adventure is Deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.fetchCompletedAdventure = async (req, res) => {
  try {
    const completedScienceFiction = await Adventure.find({
      Status: "Completed",
    });
    if (!completedScienceFiction || completedScienceFiction.length === 0) {
      return res
        .status(404)
        .json({ message: "No completed science fiction found" });
    }
    res.status(200).json(completedScienceFiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchInProgressAdventure = async (req, res) => {
  try {
    const completedScienceFiction = await Adventure.find({
      Status: "In Progress",
    });
    if (!completedScienceFiction || completedScienceFiction.length === 0) {
      return res.status(404).json({ message: "No  In Progress fiction found" });
    }
    res.status(200).json(completedScienceFiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchNewAdventure = async (req, res) => {
  try {
    const completedScienceFiction = await Adventure.find({ Status: "New" });
    if (!completedScienceFiction || completedScienceFiction.length === 0) {
      return res.status(404).json({ message: "No  New fiction found" });
    }
    res.status(200).json(completedScienceFiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------------------------------------------------------------------------------------------------------------ Fantasy -----------------------

exports.createFantasy = async (req, res) => {
  try {
    const { Storyadvenure, Wordexplore, Brainquest, Title, Image, Status } =
      req.body;
    const fantasy = new Fantasy({
      Title,
      Image,
      Status,
      Storyadvenure,
      Wordexplore,
      Brainquest,
    });
    await fantasy.save();
    res.status(201).json(fantasy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllFantasy = async (req, res) => {
  try {
    const fantasy = await Fantasy.find();
    res.status(200).json(fantasy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFantasyById = async (req, res) => {
  try {
    // console.log(req.params.id);
    const fantasy = await Fantasy.findById(req.params.id);
    if (!fantasy) {
      return res.status(404).json({ message: "Fantasy not found" });
    }

    res.status(200).json(fantasy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateFantasy = async (req, res) => {
  try {
    const fantasy = await Fantasy.findByIdAndUpdate(req.params.id, req.body);
    await fantasy.save();
    // console.log(fantasy);
    res.status(200).json(fantasy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteFantasy = async (req, res) => {
  try {
    await Fantasy.findByIdAndDelete(req.params.id);
    res.status(201).json({
      success: true,
      message: "The requested Fantasy is Deleted Successfully ",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.fetchCompletedFantasy = async (req, res) => {
  try {
    const completedScienceFiction = await Fantasy.find({ Status: "Completed" });
    if (!completedScienceFiction || completedScienceFiction.length === 0) {
      return res
        .status(404)
        .json({ message: "No completed science fiction found" });
    }
    res.status(200).json(completedScienceFiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchInProgressFantasy = async (req, res) => {
  try {
    const completedScienceFiction = await Fantasy.find({
      Status: "In Progress",
    });
    if (!completedScienceFiction || completedScienceFiction.length === 0) {
      return res.status(404).json({ message: "No  In Progress fiction found" });
    }
    res.status(200).json(completedScienceFiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchNewFantasy = async (req, res) => {
  try {
    const completedScienceFiction = await Fantasy.find({ Status: "New" });
    if (!completedScienceFiction || completedScienceFiction.length === 0) {
      return res.status(404).json({ message: "No  New fiction found" });
    }
    res.status(200).json(completedScienceFiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ----------------------------------------------------------------------------------------------------------------------------- Historyfiction ------------------------

exports.createHistoryfiction = async (req, res) => {
  try {
    const { Storyadvenure, Wordexplore, Brainquest, Title, Image, Status } =
      req.body;
    const historyfiction = new Historyfiction({
      Title,
      Image,
      Status,
      Storyadvenure,
      Wordexplore,
      Brainquest,
    });
    await historyfiction.save();
    res.status(201).json(historyfiction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllHistoryfiction = async (req, res) => {
  try {
    const historyfiction = await Historyfiction.find();
    res.status(200).json(historyfiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHistoryfictionById = async (req, res) => {
  try {
    const historyfiction = await Historyfiction.findById(req.params.id);

    if (!historyfiction) {
      return res.status(404).json({ message: "Fantasy not found" });
    }

    res.status(200).json(historyfiction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateHistoryfiction = async (req, res) => {
  try {
    const historyfiction = await Historyfiction.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    await historyfiction.save();
    res.status(200).json(historyfiction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteHistoryfiction = async (req, res) => {
  try {
    await Historyfiction.findByIdAndDelete(req.params.id);
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.fetchCompletedHistoryfiction = async (req, res) => {
  try {
    const completedScienceFiction = await Historyfiction.find({
      Status: "Completed",
    });
    if (!completedScienceFiction || completedScienceFiction.length === 0) {
      return res
        .status(404)
        .json({ message: "No completed science fiction found" });
    }
    res.status(200).json(completedScienceFiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchInProgressHistoryfiction = async (req, res) => {
  try {
    const completedScienceFiction = await Historyfiction.find({
      Status: "In Progress",
    });
    if (!completedScienceFiction || completedScienceFiction.length === 0) {
      return res.status(404).json({ message: "No  In Progress fiction found" });
    }
    res.status(200).json(completedScienceFiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchNewHistoryfiction = async (req, res) => {
  try {
    const completedScienceFiction = await Historyfiction.find({
      Status: "New",
    });
    if (!completedScienceFiction || completedScienceFiction.length === 0) {
      return res.status(404).json({ message: "No  New fiction found" });
    }
    res.status(200).json(completedScienceFiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -----------------------------------------------------------------------------------------------------------------------------  Sciencefiction ---------------

exports.createSciencefiction = async (req, res) => {
  try {
    const sciencefiction = new Sciencefiction(req.body);

    // Handle multiple image upload for Storyadvenure
    if (req.files && req.files["Storyadvenure.Storyimage"]) {
      sciencefiction.Storyadvenure[0].Storyimage = req.files[
        "Storyadvenure.Storyimage"
      ].map((file) => file.filename);
    }

    if (req.files && req.files["Image"]) {
      sciencefiction.Image = req.files["Image"].map((file) => file.filename);
    }

    // Handle multiple image upload for Wordexplore
    if (req.files && req.files["Wordexplore.Storyimage"]) {
      sciencefiction.Wordexplore[0].Storyimage = req.files[
        "Wordexplore.Storyimage"
      ].map((file) => file.filename);
    }

    await sciencefiction.save();
    res.status(201).json(sciencefiction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllSciencefiction = async (req, res) => {
  try {
    const sciencefiction = await Sciencefiction.find();
    res.status(200).json(sciencefiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSciencefictionById = async (req, res) => {
  try {
    const sciencefiction = await Sciencefiction.findById(req.params.id);

    if (!sciencefiction) {
      return res.status(404).json({ message: "Fantasy not found" });
    }

    res.status(200).json(sciencefiction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSciencefiction = async (req, res) => {
  try {
    const sciencefiction = await Sciencefiction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Handle multiple image upload for Storyadvenure
    if (req.files && req.files["Image"]) {
      sciencefiction.Image = req.files["Image"].map((file) => file.filename);
    }

    // Handle multiple image upload for Storyadvenure
    if (req.files && req.files["Storyadvenure.Storyimage"]) {
      sciencefiction.Storyadvenure[0].Storyimage = req.files[
        "Storyadvenure.Storyimage"
      ].map((file) => file.filename);
    }

    // Handle multiple image upload for Wordexplore
    if (req.files && req.files["Wordexplore.Storyimage"]) {
      sciencefiction.Wordexplore.forEach((val, index) => {
        val.Storyimage = req.files["Wordexplore.Storyimage"]
          .map((file, i) => {
            if (i === index) {
              // console.log(i);
              // console.log(file.filename);
              return file.filename;
            }
            return null;
          })
          .filter((filename) => filename !== null);
        val.Storyimage = val.Storyimage.join(""); // Concatenate filenames into a single string
      });
    }

    await sciencefiction.save();
    res.status(200).json(sciencefiction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSciencefiction = async (req, res) => {
  try {
    await Sciencefiction.findByIdAndDelete(req.params.id);
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.fetchCompletedSciencefiction = async (req, res) => {
  try {
    const completedScienceFiction = await Sciencefiction.find({
      Status: "Completed",
    });
    if (!completedScienceFiction || completedScienceFiction.length === 0) {
      return res
        .status(404)
        .json({ message: "No completed science fiction found" });
    }
    res.status(200).json(completedScienceFiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchInProgressSciencefiction = async (req, res) => {
  try {
    const completedScienceFiction = await Sciencefiction.find({
      Status: "In Progress",
    });
    if (!completedScienceFiction || completedScienceFiction.length === 0) {
      return res.status(404).json({ message: "No  In Progress fiction found" });
    }
    res.status(200).json(completedScienceFiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchNewSciencefiction = async (req, res) => {
  try {
    const completedScienceFiction = await Sciencefiction.find({
      Status: "New",
    });
    if (!completedScienceFiction || completedScienceFiction.length === 0) {
      return res.status(404).json({ message: "No  New fiction found" });
    }
    res.status(200).json(completedScienceFiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  ---------------------------------------------------------------------------------------------------------------------- Sportification -----------------

exports.createSportfiction = async (req, res) => {
  try {
    const sport = new Sport(req.body);

    // Handle multiple image upload for Storyadvenure
    if (req.files && req.files["Storyadvenure.Storyimage"]) {
      sport.Storyadvenure[0].Storyimage = req.files[
        "Storyadvenure.Storyimage"
      ].map((file) => file.filename);
    }

    // Handle multiple image upload for Wordexplore
    if (req.files && req.files["Wordexplore.StoryImage"]) {
      sport.Wordexplore[0].StoryImage = req.files["Wordexplore.StoryImage"].map(
        (file) => file.filename
      );
    }

    await sport.save();
    res.status(201).json(sport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllSportfiction = async (req, res) => {
  try {
    const sport = await Sport.find();
    res.status(200).json(sport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSportfictionById = async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);

    if (!sport) {
      return res.status(404).json({ message: "Fantasy not found" });
    }

    res.status(200).json(sport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSportfiction = async (req, res) => {
  try {
    const sport = await Sport.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // Handle multiple image upload for Storyadvenure
    if (req.files && req.files["Storyadvenure.Storyimage"]) {
      sport.Storyadvenure[0].Storyimage = req.files[
        "Storyadvenure.Storyimage"
      ].map((file) => file.filename);
    }

    // Handle multiple image upload for Wordexplore
    if (req.files && req.files["Wordexplore.StoryImage"]) {
      sport.Wordexplore[0].StoryImage = req.files["Wordexplore.StoryImage"].map(
        (file) => file.filename
      );
    }

    await sport.save();
    res.status(200).json(sport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSportfiction = async (req, res) => {
  try {
    await Sport.findByIdAndDelete(req.params.id);
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.fetchCompletedSportfiction = async (req, res) => {
  try {
    const completedScienceFiction = await Sport.find({ Status: "Completed" });
    if (!completedScienceFiction || completedScienceFiction.length === 0) {
      return res
        .status(404)
        .json({ message: "No completed science fiction found" });
    }
    res.status(200).json(completedScienceFiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchInProgressSportfiction = async (req, res) => {
  try {
    const completedScienceFiction = await Sport.find({ Status: "In Progress" });
    if (!completedScienceFiction || completedScienceFiction.length === 0) {
      return res.status(404).json({ message: "No  In Progress fiction found" });
    }
    res.status(200).json(completedScienceFiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchNewSportfiction = async (req, res) => {
  try {
    const completedScienceFiction = await Sport.find({ Status: "New" });
    if (!completedScienceFiction || completedScienceFiction.length === 0) {
      return res.status(404).json({ message: "No  New fiction found" });
    }
    res.status(200).json(completedScienceFiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------------------------------------------------------------------------------------------------------------------ Mystery ----------

exports.createMystery = async (req, res) => {
  try {
    const mystery = new Mystery(req.body);
    await mystery.save();
    res.status(201).json(mystery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllMystery = async (req, res) => {
  try {
    const mystery = await Mystery.find();
    res.status(200).json(mystery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMysteryById = async (req, res) => {
  try {
    const mystery = await Mystery.findById(req.params.id);

    if (!mystery) {
      return res.status(404).json({ message: "Fantasy not found" });
    }

    res.status(200).json(mystery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateMystery = async (req, res) => {
  try {
    const mystery = await Mystery.findByIdAndUpdate(req.params.id, req.body);
    await mystery.save();
    res.status(200).json(mystery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteMystery = async (req, res) => {
  try {
    await Mystery.findByIdAndDelete(req.params.id);
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.fetchCompletedMystery = async (req, res) => {
  try {
    const completedScienceFiction = await Mystery.find({ Status: "Completed" });
    if (!completedScienceFiction || completedScienceFiction.length === 0) {
      return res
        .status(404)
        .json({ message: "No completed science fiction found" });
    }
    res.status(200).json(completedScienceFiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchInProgressMystery = async (req, res) => {
  try {
    const completedScienceFiction = await Mystery.find({
      Status: "In Progress",
    });
    // console.log(completedScienceFiction);
    if (!completedScienceFiction || completedScienceFiction.length === 0) {
      return res.status(404).json({ message: "No  In Progress fiction found" });
    }
    res.status(200).json(completedScienceFiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchNewMystery = async (req, res) => {
  try {
    const completedScienceFiction = await Mystery.find({ Status: "New" });
    if (!completedScienceFiction || completedScienceFiction.length === 0) {
      return res.status(404).json({ message: "No  New fiction found" });
    }
    res.status(200).json(completedScienceFiction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---------------------------------------------------------------------------------------------------------- Image Upload Route ----------------------

// exports.imageupload = async (req, res, next) => {
//   try {
//     let data = { ...req.body };
//     if (!data.file || !data.file.trim()) delete data.file;
//     if (req.file && req.file.filename) {
//       data = req.file.filename;
//     }
//     return res.json({
//       success: true,
//       data,
//       message: "Image updated successfully",
//     });
//   } catch (error) {
//     console.log(error, "<< error");
//     return next(new ErrorHandler("no Property Added  Found", 404));
//   }
// };

var imagekit = new ImageKit({
  publicKey: "public_5Cx6GwY0CBh4YDFD2AjzcPy4664=",
  privateKey: "private_JyeF5fRBWIvQzP/oO1umTffmG30=",
  urlEndpoint: "https://ik.imagekit.io/dev24",
});

exports.imageupload = async (req, res, next) => {
  try {
    const imageData = req.file.buffer.toString("base64"); // Convert file to base64
    imagekit.upload(
      {
        file: imageData,
        fileName: req.file.originalname, // Use original file name
      },
      function (error, result) {
        if (error) {
          // console.log(error);
          res
            .status(500)
            .json({ error: "An error occurred while uploading the image" });
        } else {
          // console.log(result);
          const filename = result.name;
          // console.log(filename);
          res.status(200).json({ filename }); // Send back the URL of the uploaded image
        }
      }
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
};




//------------------------------------------------------------------------------------------  Daily Quiz Controllers -------------------------------------

exports.createQuestion = async (req, res) => {
  try {
    const { questionText, answer, options, tag, difficultyLevel } = req.body;
    const question = new Question({
      questionText,
      answer,
      options,
      tag,
      difficultyLevel,
    });
    const savedQuestion = await question.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json({ question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const QuestionId = req.params.id;
    const { questionText, answer, tag, difficultyLevel, options } = req.body;
    const updatedQuestion = await Question.findByIdAndUpdate(QuestionId, {
      questionText,
      answer,
      tag,
      difficultyLevel,
      options,
    });
    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json({ QuestionId, updatedQuestion });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res
      .status(201)
      .json({ message: "Question deleted successfully", deletedQuestion });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.Fetch_Daily_Quiz_Data = async (req, res) => {
  try {
    const id = req.body.id;
    const TodayDate = new Date().toISOString().slice(0, 10);

    const { AttemptedQuestion, Correct_Answer, Wrong_Answer } = req.body.Score;

    const user = await Student.findByIdAndUpdate(
      id,
      {
        $push: {
          Daily_Quiz: {
            Date: TodayDate,
            Score: {
              AttemptedQuestion,
              Correct_Answer,
              Wrong_Answer,
            },
          },
        },
      },
      { new: true }
    );
    // console.log(user);
    res.status(200).json(user); 
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.FetchAllUsers = catchAsyncErrors(async (req, res) => {
  try {
    const allUsers = await Student.find();
    res.status(200).json(allUsers); 
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});





//---------------------------------Weeklyperformance----------
// Controller for creating a new weekly performance entry
exports.createWeeklyPerformance = async (req, res) => {
  try {
    const {
      StudentId,
      Weekstartingdate,
      Questionscorrect,
      Totalquestionsattempted,
    } = req.body;
    const weeklyPerformance = new Weeklyperformance({
      StudentId,
      Weekstartingdate,
      Questionscorrect,
      Totalquestionsattempted,
    });
    const savedPerformance = await weeklyPerformance.save();
    res.status(201).json(savedPerformance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller for fetching all weekly performance entries
exports.fetchAllWeeklyPerformances = async (req, res) => {
  try {
    const performances = await Weeklyperformance.find();
    res.json(performances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for fetching a specific weekly performance entry by ID
exports.fetchWeeklyPerformanceById = async (req, res) => {
  try {
    const performance = await Weeklyperformance.findById(req.params.id);
    if (!performance) {
      return res.status(404).json({ message: "Weekly performance not found" });
    }
    res.json(performance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for updating a specific weekly performance entry by ID
exports.updateWeeklyPerformance = async (req, res) => {
  try {
    const {
      StudentId,
      Weekstartingdate,
      Questionscorrect,
      Totalquestionsattempted,
    } = req.body;
    const updatedPerformance = await Weeklyperformance.findByIdAndUpdate(
      req.params.id,
      {
        StudentId,
        Weekstartingdate,
        Questionscorrect,
        Totalquestionsattempted,
      },
      { new: true }
    );
    if (!updatedPerformance) {
      return res.status(404).json({ message: "Weekly performance not found" });
    }
    res.json(updatedPerformance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller for deleting a specific weekly performance entry by ID
exports.deleteWeeklyPerformance = async (req, res) => {
  try {
    const deletedPerformance = await Weeklyperformance.findByIdAndDelete(
      req.params.id
    );
    if (!deletedPerformance) {
      return res.status(404).json({ message: "Weekly performance not found" });
    }
    res.json({ message: "Weekly performance deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

