const { Router } = require("express");

const { healthRouter } = require("./health");
const { authRouter } = require("./auth");
const { adminRouter } = require("./admin");
const { usersRouter } = require("./users");
const { profileRouter } = require("./profile");
const { workoutLogsRouter } = require("./workout-logs");
const { exercisesRouter } = require("./exercises");
const { workoutPlansRouter } = require("./workout-plans");
const { workoutSessionsRouter } = require("./workout-sessions");

const router = Router();

router.use(healthRouter);
router.use("/api", authRouter);
router.use("/api", adminRouter);
router.use("/api", usersRouter);
router.use("/api", profileRouter);
router.use("/api", workoutLogsRouter);
router.use("/api", exercisesRouter);
router.use("/api", workoutPlansRouter);
router.use("/api", workoutSessionsRouter);

module.exports = { router };
