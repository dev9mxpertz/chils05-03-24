var express = require("express");
var router = express.Router();
const {
  createAdventure,
  getAllAdventures,
  getAdventureById,
  fetchCompletedAdventure,
  fetchInProgressAdventure,
  fetchNewAdventure,
  updateAdventure,
  deleteAdventure,
  createFantasy,
  fetchNewFantasy,
  fetchInProgressFantasy,
  fetchCompletedFantasy,
  getAllFantasy,
  getFantasyById,
  deleteFantasy,
  updateFantasy,
  createHistoryfiction,
  getAllHistoryfiction,
  fetchNewHistoryfiction,
  fetchInProgressHistoryfiction,
  fetchCompletedHistoryfiction,
  deleteHistoryfiction,
  updateHistoryfiction,
  getHistoryfictionById,
  createSciencefiction,
  fetchNewSciencefiction,
  fetchInProgressSciencefiction,
  fetchCompletedSciencefiction,
  deleteSciencefiction,
  updateSciencefiction,
  createSportfiction,
  getAllSportfiction,
  getSportfictionById,
  updateSportfiction,
  deleteSportfiction,
  fetchCompletedSportfiction,
  fetchInProgressSportfiction,
  fetchNewSportfiction,
  createMystery,
  getAllMystery,
  getMysteryById,
  updateMystery,
  deleteMystery,
  fetchCompletedMystery,
  fetchInProgressMystery,
  fetchNewMystery,
  imageupload,
  getAllSciencefiction,
  getSciencefictionById,
  Signup_admin,
  Signin_user,
  Signup,
  currentAdmin,
  signout,
  FindUsername,
  MatchOTP,
  Reset_Password,
  createWeeklyPerformance,
  fetchAllWeeklyPerformances,
  fetchWeeklyPerformanceById,
  updateWeeklyPerformance,
  deleteWeeklyPerformance,
createQuestion,
getAllQuestions,
getQuestionById,
updateQuestion,
deleteQuestion,
Fetch_Daily_Quiz_Data,
FetchAllUsers,
} = require("../controllers/indexControllers");
const multer = require("multer");
const isAuthorizedUser = require("../middleware/auth");

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/api/update-image", upload.single("image"), imageupload);

router.post("/api/Signup_admin", Signup_admin);

router.post("/api/Signin_user", Signin_user);

router.post("/api/Signup", Signup);

router.post("/api/me", isAuthorizedUser, currentAdmin);

router.get("/api/signout", signout);


router.post("/api/FindUsername", FindUsername);

router.post("/api/MatchOTP", MatchOTP )

router.post('/api/Reset_Password' , Reset_Password)


// ----------------------------------------------------------------------------- Adventure @api

router.post("/api/adventure", createAdventure);

router.get("/api/adventure", getAllAdventures);

router.get("/api/adventure/:id", getAdventureById);

router.post("/api/adventure/:id", updateAdventure);

router.post("/api/adventure/delete/:id", deleteAdventure);

router.get(
  "/api/adventure/filter/fetchCompletedAdventure",
  fetchCompletedAdventure
);

router.get(
  "/api/adventure/filter/fetchInProgressAdventure",
  fetchInProgressAdventure
);

router.get("/api/adventure/filter/fetchNewAdventure", fetchNewAdventure);

// ----------------------------------------------------------------------------- Fantasy @api

router.post("/api/fantasy", createFantasy);

router.get("/api/fantasy", getAllFantasy);

router.get("/api/fantasy/:id", getFantasyById);

router.post("/api/fantasy/:id", updateFantasy);

router.post("/api/fantasy/delete/:id", deleteFantasy);

router.get("/api/fantasy/filter/fetchCompletedFantasy", fetchCompletedFantasy);

router.get(
  "/api/fantasy/filter/fetchInProgressFantasy",
  fetchInProgressFantasy
);

router.get("/api/fantasy/filter/fetchNewFantasy", fetchNewFantasy);

// ----------------------------------------------------------------------------- History fiction @api

router.post("/api/historyfiction", createHistoryfiction);

router.get("/api/historyfiction", getAllHistoryfiction);

router.get("/api/historyfiction/:id", getHistoryfictionById);

router.post("/api/historyfiction/:id", updateHistoryfiction);

router.post("/api/historyfiction/delete/:id", deleteHistoryfiction);

router.get(
  "/api/historyfiction/filter/fetchCompletedHistoryfiction",
  fetchCompletedHistoryfiction
);

router.get(
  "/api/historyfiction/filter/fetchInProgressHistoryfiction",
  fetchInProgressHistoryfiction
);

router.get(
  "/api/historyfiction/filter/fetchNewHistoryfiction",
  fetchNewHistoryfiction
);

// ----------------------------------------------------------------------------- Sciencefiction @api

router.post("/api/sciencefiction", createSciencefiction);

router.get("/api/sciencefiction", getAllSciencefiction);

router.get("/api/sciencefiction/:id", getSciencefictionById);

router.post("/api/sciencefiction/:id", updateSciencefiction);

router.post("/api/sciencefiction/delete/:id", deleteSciencefiction);

router.get(
  "/api/sciencefiction/filter/fetchCompletedSciencefiction",
  fetchCompletedSciencefiction
);

router.get(
  "/api/sciencefiction/filter/fetchInProgressSciencefiction",
  fetchInProgressSciencefiction
);

router.get(
  "/api/sciencefiction/filter/fetchNewSciencefiction",
  fetchNewSciencefiction
);

// ----------------------------------------------------------------------------- sportfiction @api

router.post("/api/sportfiction", createSportfiction);

router.get("/api/sportfiction", getAllSportfiction);

router.get("/api/sportfiction/:id", getSportfictionById);

router.post("/api/sportfiction/:id", updateSportfiction);

router.post("/api/sportfiction/delete/:id", deleteSportfiction);

router.get(
  "/api/sportfiction/filter/fetchCompletedSportfiction",
  fetchCompletedSportfiction
);

router.get(
  "/api/sportfiction/filter/fetchInProgressSportfiction",
  fetchInProgressSportfiction
);

router.get(
  "/api/sportfiction/filter/fetchNewSportfiction",
  fetchNewSportfiction
);

// ----------------------------------------------------------------------------- Mystery @api

router.post("/api/mystery", createMystery);

router.get("/api/mystery", getAllMystery);

router.get("/api/mystery/:id", getMysteryById);

router.post("/api/mystery/:id", updateMystery);

router.post("/api/mystery/delete/:id", deleteMystery);

router.get("/api/mystery/filter/fetchCompletedMystery", fetchCompletedMystery);

router.get(
  "/api/mystery/filter/fetchInProgressMystery",
  fetchInProgressMystery
);

router.get("/api/mystery/filter/fetchNewMystery", fetchNewMystery);


router.post("/api/Fetch_Daily_Quiz_Data",Fetch_Daily_Quiz_Data)

router.get("/api/FetchAllUsers" , FetchAllUsers)


// Create a new weekly performance entry
router.post('/api/weeklyperformances', createWeeklyPerformance);

// Fetch all weekly performance entries
router.get('/api/weeklyperformances', fetchAllWeeklyPerformances);

// Fetch a specific weekly performance entry by ID
router.get('/api/weeklyperformances/:id',fetchWeeklyPerformanceById);

// Update a specific weekly performance entry by ID
router.put('/api/weeklyperformances/:id', updateWeeklyPerformance);

// Delete a specific weekly performance entry by ID
router.delete('/api/weeklyperformances/:id',deleteWeeklyPerformance);


//-----------------------questions Routs--------------------
router.post('/api/questions', createQuestion);

router.get('/api/questions', getAllQuestions);

router.get('/api/question/:id', getQuestionById);

router.post('/api/question/:id', updateQuestion);

router.get('/api/questions/:id', deleteQuestion);

module.exports = router;
