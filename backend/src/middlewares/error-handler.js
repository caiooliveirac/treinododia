function errorHandler(error, _req, res, _next) {
  if (error?.name === "ZodError") {
    return res.status(400).json({
      message: "Dados inválidos.",
      issues: error.issues,
    });
  }

  if (error?.code === "P2002") {
    return res.status(409).json({
      message: "Conflito de dados únicos.",
      target: error.meta?.target,
    });
  }

  if (error?.code === "P2003") {
    return res.status(400).json({
      message: "Relacionamento inválido para o recurso informado.",
      field: error.meta?.field_name,
    });
  }

  if (error?.code === "P2025") {
    return res.status(404).json({
      message: "Recurso não encontrado.",
    });
  }

  return res.status(500).json({
    message: "Erro interno no servidor.",
    detail: process.env.NODE_ENV === "development" ? error?.message : undefined,
  });
}

module.exports = { errorHandler };
