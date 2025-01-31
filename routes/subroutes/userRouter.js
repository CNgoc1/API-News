const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUsername,
} = require("../../controllers/usersController");

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;
