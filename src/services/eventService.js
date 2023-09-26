const { handleMessage } = require("./messageService");

/**
 * Manipula um evento recebido através da WhatsApp Cloud API.
 * @param {Object} eventObject - Objeto de evento recebido via webhook.
 */
exports.handleEvent = async (eventObject) => {
  const entry = eventObject?.entry?.[0]?.changes?.[0]?.value;
  if (entry?.messages?.[0]) {
    await handleMessage(eventObject);
  }
};
