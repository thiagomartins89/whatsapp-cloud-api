const axios = require("axios").default;
const { waId, waToken } = require("../config/env");
const APIError = require("../models/APIError");

/**
 * Envia um emoji de reação a uma mensagem através da WhatsApp Cloud API.
 * @param {Object} messageId - ID da mensagem.
 * @param {Object} phoneNumber - Número de telefone do usuário.
 * @param {Object} emoji - Emoji de reação.
 */
exports.sendReaction = async (messageId, phoneNumber, emoji) => {
  const url = `https://graph.facebook.com/v17.0/${waId}/messages`;
  const headers = {
    Authorization: `Bearer ${waToken}`,
    "Content-Type": "application/json",
  };

  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phoneNumber,
    type: "reaction",
    reaction: {
      message_id: messageId,
      emoji: emoji,
    },
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    throw new APIError(error);
  }
};
