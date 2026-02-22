const { verifySessionToken } = require("../lib/auth-session");

function sessionAuthMiddleware(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Sessão inválida ou ausente.",
    });
  }

  const token = authorization.replace("Bearer ", "").trim();

  try {
    const payload = verifySessionToken(token);

    req.session = {
      role: payload.role,
      email: payload.email,
      userId: payload.userId || null,
    };

    return next();
  } catch (_error) {
    return res.status(401).json({
      message: "Sessão expirada ou inválida.",
    });
  }
}

function requireRoles(roles) {
  return (req, res, next) => {
    if (!req.session || !roles.includes(req.session.role)) {
      return res.status(403).json({
        message: "Você não tem permissão para acessar este recurso.",
      });
    }

    return next();
  };
}

function resolveScopedUserId(req, requestedUserId) {
  if (req.session?.role === "admin") {
    return requestedUserId;
  }

  if (!req.session?.userId) {
    return null;
  }

  if (requestedUserId && requestedUserId !== req.session.userId) {
    return null;
  }

  return req.session.userId;
}

module.exports = {
  sessionAuthMiddleware,
  requireRoles,
  resolveScopedUserId,
};
