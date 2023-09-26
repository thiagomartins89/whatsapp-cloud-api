const axios = require("axios").default;
const { waId, waToken } = require("../config/env");
const APIError = require("../models/APIError");

/**
 * Sinaliza ao remetente que uma mensagem foi lida.
 * @param {Object} messageId - ID da mensagem.
 */
exports.sendSeen = async (messageId) => {
  const url = `https://graph.facebook.com/v17.0/${waId}/messages`;
  const headers = {
    Authorization: `Bearer ${waToken}`,
    "Content-Type": "application/json",
  };

  const data = {
    messaging_product: "whatsapp",
    status: "read",
    message_id: messageId,
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    throw new APIError(error);
  }
};
