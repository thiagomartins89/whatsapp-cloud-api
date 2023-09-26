const { sendMessage } = require("./sendMessageService");
const { sendSeen } = require("./sendSeenService");

/**
 * Manipula uma mensagem recebida através da WhatsApp Cloud API.
 * @param {Object} eventObject - Objeto de evento recebido via webhook.
 */
exports.handleMessage = async (eventObject) => {
  console.log(JSON.stringify(eventObject, null, 2));
  const userPhoneNumber = eventObject?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;
  const messageBody = eventObject?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;
  const messageId = eventObject?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.id;

  try {
    await sendSeen(messageId);
    await sendMessage(userPhoneNumber, `Echo: ${messageBody}`);
  } catch (error) {
    console.log(error);
  }
};
