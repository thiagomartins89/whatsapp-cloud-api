const { sendMessage } = require("./sendMessageService");

/**
 * Manipula uma mensagem recebida através da WhatsApp Cloud API.
 * @param {Object} eventObject - Objeto de evento recebido via webhook.
 */
exports.handleMessage = async (eventObject) => {
  console.log(JSON.stringify(eventObject, null, 2));
  const userPhoneNumber = eventObject.entry?.[0]?.changes?.[0]?.value.messages[0].from;
  const messageBody = eventObject.entry?.[0]?.changes?.[0]?.value.messages[0].text.body;

  try {
    await sendMessage(userPhoneNumber, `Replicando a mensagem recebida: ${messageBody}`);
  } catch (error) {
    console.log(error);
  }
};
