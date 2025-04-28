// Middleware de tratamento global de erros
const errorMiddleware = (err, req, res, next) => {
    console.error('Erro capturado:', err.stack);
  
    res.status(err.status || 500).json({
      message: err.message || 'Erro interno do servidor',
    });
  };
  
  module.exports = errorMiddleware;