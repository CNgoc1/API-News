const apiRouter = require("express").Router();
const articleRouter = require("./subroutes/articlerouter");
const commentRouter = require("./subroutes/commentRouter");
const topicsRouter = require("./subroutes/topicsRouter");
const usersRouter = require("./subroutes/userRouter");

apiRouter.get("/", (req, res) => {
  res.status(200).send("All OK from /api");
});

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articleRouter);

apiRouter.use("/comments", commentRouter);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
