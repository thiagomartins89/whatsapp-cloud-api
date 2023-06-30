"use strict";

require("dotenv").config();

const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios").default;

const botId = process.env.PHONE_NUMBER_ID;
const token = process.env.WHATSAPP_TOKEN;
const verify_token = process.env.VERIFY_TOKEN;
const port = process.env.PORT || 1337;

const app = express().use(body_parser.json());

app.listen(port, () => console.log(`Webhook is listening on port ${port}`));

/**
 * Endpoint para receber eventos do webhook do WhatsApp Cloud API.
 * @param {Object} req - Objeto de requisição HTTP.
 * @param {Object} res - Objeto de resposta HTTP.
 */
app.post("/webhook", async (req, res) => {
  if (req.body.object) {
    handleEvent(req.body);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

/**
 * Endpoint para verificar o webhook do WhatsApp Cloud API.
 * @param {Object} req - Objeto de requisição HTTP.
 * @param {Object} res - Objeto de resposta HTTP.
 */
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === verify_token) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(token && mode ? 403 : 200);
  }
});

/**
 * Manipula o evento recebido do webhook do WhatsApp Cloud API.
 * @param {Object} eventObject - Objeto de evento recebido.
 */
async function handleEvent(eventObject) {
  const entry = eventObject.entry?.[0]?.changes?.[0]?.value;
  if (entry?.messages?.[0]) {
    await handleMessage(entry);
  }
}

/**
 * Manipula a mensagem recebida do usuário.
 * @param {Object} messageObject - Objeto de mensagem recebida.
 */
async function handleMessage(messageObject) {
  const userPhoneNumber = messageObject.messages[0].from;
  const messageBody = messageObject.messages[0].text.body;

  try {
    await sendMessage(userPhoneNumber, `Mensagem recebida: ${messageBody}`);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Envia uma mensagem de texto.
 * @param {Object} phoneNumber - Número de telefone do usuário.
 * @param {Object} messageBody - Corpo da mensagem.
 */
async function sendMessage(phoneNumber, messageBody) {
  const url = `https://graph.facebook.com/v17.0/${botId}/messages`;
  const headers = {
    Authorization: `Bearer ${token}`,
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
}

/**
 * Envia um emoji de reação a uma mensagem.
 * @param {Object} messageId - ID da mensagem.
 * @param {Object} phoneNumber - Número de telefone do usuário.
 * @param {Object} emoji - Emoji de reação.
 */
async function sendReaction(messageId, phoneNumber, emoji) {
  const url = `https://graph.facebook.com/v17.0/${botId}/messages`;
  const headers = {
    Authorization: `Bearer ${token}`,
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
}

/**
 * Envia uma imagem através de uma URL.
 * @param {Object} phoneNumber - Número de telefone do usuário.
 * @param {Object} imageUrl - URL da imagem.
 */
async function sendImage(phoneNumber, imageUrl) {
  const url = `https://graph.facebook.com/v17.0/${botId}/messages`;
  const headers = {
    Authorization: `Bearer ${token}`,
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
}

/**
 * Envia botões de ação.
 * @param {string} phoneNumber - Número de telefone do usuário.
 * @param {Object} buttons - Botões de ação.
 *
 * buttons = {
 *   type: "button",
 *   body: {
 *     text: "CORPO DA MENSAGEM",
 *   },
 *   action: {
 *     buttons: [
 *       {
 *         type: "reply",
 *         reply: {
 *           id: "ID_1",
 *           title: "TEXTO DO BOTÃO 1",
 *         },
 *       },
 *       {
 *         type: "reply",
 *         reply: {
 *           id: "ID_2",
 *           title: "TEXTO DO BOTÃO 2",
 *         },
 *       },
 *     ],
 *   },
 * }
 */
async function sendButtons(phoneNumber, buttons) {
  const url = `https://graph.facebook.com/v17.0/${botId}/messages`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phoneNumber,
    type: "interactive",
    interactive: buttons,
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    throw new APIError(error);
  }
}

/**
 * Classe que representa um erro na Cloud API, com informações adicionais de tipo, código e detalhes.
 * @extends Error
 */
class APIError extends Error {
  constructor(error) {
    super(error.response.data.error.message);
    this.type = error.response.data.error.type;
    this.code = error.response.data.error.code;
    this.details = error.response.data.error.error_data.details;
    this.name = this.constructor.name;
  }
}
