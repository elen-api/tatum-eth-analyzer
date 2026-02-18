require("dotenv").config();
const { analyzeWallet } = require("./walletAnalyzer");

const address = process.argv[2];

if (!address) {
  console.log("Usage:");
  console.log("node src/index.js <wallet_address>");
  process.exit(1);
}

analyzeWallet(address);
