const {
  getArticles,
  getArticleById,
  getArticleComment,
  postArticleComment,
  patchArticle,
  postArticle,
} = require("../../controllers/articleController");

const articleRouter = require("express").Router();

articleRouter.get("/", getArticles);
articleRouter.get("/:article_id", getArticleById);
articleRouter.get("/:article_id/comments?", getArticleComment);
articleRouter.post("/:article_id/comments", postArticleComment);
articleRouter.patch("/:article_id", patchArticle);
articleRouter.post("/", postArticle);

module.exports = articleRouter;
