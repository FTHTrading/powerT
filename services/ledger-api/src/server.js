require("dotenv").config();
const { createApp } = require("./app");

const PORT = process.env.PORT || 3001;
const app = createApp();

app.listen(PORT, () => {
  console.log(`⚡ Powerteam Master Ledger API listening on port ${PORT}`);
});
