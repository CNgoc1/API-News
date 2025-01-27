const fetchtopics = require("../models/topicsModel");

function getTopics(req, res, next) {
  fetchtopics()
    .then((response) => {
      res.status(200).send({ topics: response });
    })
    .catch(next);
}

module.exports = { getTopics };
