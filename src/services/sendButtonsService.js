const axios = require("axios").default;
const { waId, waToken } = require("../config/env");
const APIError = require("../models/APIError");

/**
 * Envia botões de ação através da WhatsApp Cloud API.
 * @param {string} phoneNumber - Número de telefone do usuário.
 * @param {Object[]} buttons - Array de objetos que representam os botões de ação.
 *
 * buttons = [
 *   {
 *     type: "reply",
 *     reply: {
 *       id: "ID_1",
 *       title: "TEXTO DO BOTÃO 1",
 *     },
 *   },
 *   {
 *     type: "reply",
 *     reply: {
 *       id: "ID_2",
 *       title: "TEXTO DO BOTÃO 2",
 *     },
 *   },
 * ]
 *
 */
exports.sendButtons = async (phoneNumber, messageBody, buttons) => {
  const url = `https://graph.facebook.com/v17.0/${waId}/messages`;
  const headers = {
    Authorization: `Bearer ${waToken}`,
    "Content-Type": "application/json",
  };

  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phoneNumber,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: messageBody,
      },
      action: {
        buttons: buttons,
      },
    },
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    throw new APIError(error);
  }
};
