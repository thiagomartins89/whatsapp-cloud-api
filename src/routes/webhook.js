const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/webhookController");

router.post("/webhook", webhookController.postWebhook);
router.get("/webhook", webhookController.getWebhook);

module.exports = router;
