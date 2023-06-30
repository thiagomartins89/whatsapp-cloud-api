const axios = require("axios").default;
const { waId, waToken } = require("../config/env");
const APIError = require("../models/APIError");

/**
 * Envia uma imagem a partir de uma URL através da WhatsApp Cloud API.
 * @param {Object} phoneNumber - Número de telefone do usuário.
 * @param {Object} imageUrl - URL da imagem.
 */
exports.sendImage = async (phoneNumber, imageUrl) => {
  const url = `https://graph.facebook.com/v17.0/${waId}/messages`;
  const headers = {
    Authorization: `Bearer ${waToken}`,
    "Content-Type": "application/json",
  };

  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phoneNumber,
    type: "image",
    image: {
      link: imageUrl,
    },
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    throw new APIError(error);
  }
};
