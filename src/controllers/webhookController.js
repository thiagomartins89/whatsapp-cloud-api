const { handleEvent } = require("../services/eventService");
const { verifyToken } = require("../config/env");

exports.postWebhook = async (req, res) => {
  if (req.body.object) {
    handleEvent(req.body);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};

exports.getWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === verifyToken) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(token && mode ? 403 : 200);
  }
};
