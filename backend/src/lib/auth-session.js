const jwt = require("jsonwebtoken");

const { env } = require("../config/env");

function createSessionToken(payload, options = {}) {
  return jwt.sign(
    payload,
    env.authSessionSecret,
    {
      expiresIn: env.authSessionTtl,
      subject: options.subject || "session",
    }
  );
}

function verifySessionToken(token) {
  return jwt.verify(token, env.authSessionSecret);
}

module.exports = {
  createSessionToken,
  verifySessionToken,
};
