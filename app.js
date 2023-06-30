const express = require("./src/config/express");
const { port } = require("./src/config/env");
const webhookRoutes = require("./src/routes/webhook");

const app = express();

app.use(webhookRoutes);

app.listen(port, () => console.log(`Webhook is listening on port ${port}.`));
