const { verifySessionToken } = require("../lib/auth-session");

function adminAuthMiddleware(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Sessão inválida ou ausente.",
    });
  }

  const token = authorization.replace("Bearer ", "").trim();

  try {
    const payload = verifySessionToken(token);

    if (!payload || payload.role !== "admin") {
      return res.status(403).json({
        message: "Acesso restrito para administradores.",
      });
    }

    req.admin = {
      email: payload.email,
      role: payload.role,
    };

    return next();
  } catch (_error) {
    return res.status(401).json({
      message: "Sessão expirada ou inválida.",
    });
  }
}

module.exports = { adminAuthMiddleware };
