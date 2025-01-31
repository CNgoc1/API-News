const usersRouter = require("express").Router();
const { getUsers } = require("../../controllers/usersController");

usersRouter.get("/", getUsers);

module.exports = usersRouter;
