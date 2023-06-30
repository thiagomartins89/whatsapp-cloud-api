const axios = require("axios").default;
const { waId, waToken } = require("../config/env");
const APIError = require("../models/APIError");

/**
 * Envia uma mensagem de texto para um número de telefone através da WhatsApp Cloud API.
 * @param {Object} phoneNumber - Número de telefone do usuário.
 * @param {Object} messageBody - Corpo da mensagem.
 */
exports.sendMessage = async (phoneNumber, messageBody) => {
  const url = `https://graph.facebook.com/v17.0/${waId}/messages`;
  const headers = {
    Authorization: `Bearer ${waToken}`,
    "Content-Type": "application/json",
  };

  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phoneNumber,
    type: "text",
    text: {
      body: messageBody,
    },
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    throw new APIError(error);
  }
};
