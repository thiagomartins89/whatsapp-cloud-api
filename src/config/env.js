require("dotenv").config();

module.exports = {
  waId: process.env.WHATSAPP_ID,
  waToken: process.env.WHATSAPP_TOKEN,
  verifyToken: process.env.VERIFY_TOKEN,
  port: process.env.PORT || 1337,
};
