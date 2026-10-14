export function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Rota não encontrada.' });
}

export function errorHandler(err, req, res, _next) {
  console.error(err);

  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Já existe um registro com estes dados.' });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.publicMessage || 'Erro interno do servidor.' });
}

export class HttpError extends Error {
  constructor(status, publicMessage) {
    super(publicMessage);
    this.status = status;
    this.publicMessage = publicMessage;
  }
}
