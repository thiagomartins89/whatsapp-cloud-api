"use strict";

require("dotenv").config();

const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios").default;

const token = process.env.WHATSAPP_TOKEN;
const port = process.env.PORT || 1337;
const app = express().use(body_parser.json());

app.listen(port, () => console.log(`Webhook is listening on port ${port}`));

app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object) {
    const entry = body.entry?.[0]?.changes?.[0]?.value;

    if (entry?.messages?.[0]) {
      const phone_number_id = entry.metadata.phone_number_id;
      const from = entry.messages[0].from;
      const msg_body = entry.messages[0].text.body;

      axios.post(
        `https://graph.facebook.com/v12.0/${phone_number_id}/messages?access_token=${token}`,
        {
          messaging_product: "whatsapp",
          to: from,
          text: { body: msg_body },
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

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
