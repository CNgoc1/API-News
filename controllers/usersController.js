const { checkUserExists } = require("../checks");
const { fetchUsers } = require("../models/userModel");

function getUsers(req, res, next) {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
}

function getUserByUsername(req, res, next) {
  const { username } = req.params;
  return checkUserExists(username)
    .then((result) => {
      res.status(200).send({ user: result });
    })
    .catch(next);
}

module.exports = { getUsers, getUserByUsername };
