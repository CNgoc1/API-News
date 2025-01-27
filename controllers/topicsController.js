const fetchtopics = require("../models/fetchTopics");

function getTopics(req, res, next) {
  fetchtopics()
    .then((response) => {
      res.status(200).send({ topics: response });
    })
    .catch(next);
}

module.exports = { getTopics };
