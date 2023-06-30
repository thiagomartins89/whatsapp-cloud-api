"use strict";

require("dotenv").config();

const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios").default;

const token = process.env.WHATSAPP_TOKEN;
const port = process.env.PORT || 1337;
const app = express().use(body_parser.json());

app.listen(port, () => console.log(`Webhook is listening on port ${port}`));

app.post("/webhook", async (req, res) => {
  if (req.body.object) {
    handleEvent(req.body);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.get("/webhook", (req, res) => {
  const verify_token = process.env.VERIFY_TOKEN;
  const { mode, verify_token: token, challenge } = req.query;

  if (mode && token && mode === "subscribe" && token === verify_token) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(token && mode ? 403 : 200);
  }
});

async function handleEvent(eventObject) {
  const entry = eventObject.entry?.[0]?.changes?.[0]?.value;
  if (entry?.messages?.[0]) {
    console.log(eventObject);
    await handleMessage(entry);
  }
}

async function handleMessage(messageObject) {
  let botPhoneNumber = messageObject.metadata.phone_number_id;
  const userPhoneNumber = messageObject.messages[0].from;
  const messageBody = messageObject.messages[0].text.body;

  console.log(botPhoneNumber);
  botPhoneNumber = "+1 555 073 3144";

  const url = `https://graph.facebook.com/v17.0/${botPhoneNumber}/messages`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: userPhoneNumber,
    type: "text",
    text: {
      body: messageBody,
    },
  };

  axios
    .post(url, data, { headers })
    .then((response) => {
      console.log("Resposta:", response.data);
    })
    .catch((error) => {
      console.error("Erro:", error.message);
    });
}
