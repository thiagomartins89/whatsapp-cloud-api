/**
 * Classe que estrutura um erro na WhatsApp Cloud API, com informações adicionais de tipo, código e detalhes.
 * @class
 * @extends {Error}
 */
class APIError extends Error {
  /**
   * Cria uma instância de APIError.
   * @param {Object} error - Objeto de erro retornado pela WhatsApp Cloud API.
   */
  constructor(error) {
    super(error.response.data.error.message);
    this.type = error.response.data.error.type;
    this.code = error.response.data.error.code;
    this.details = error.response.data.error.error_data.details;
    this.name = this.constructor.name;
  }
}

module.exports = APIError;
