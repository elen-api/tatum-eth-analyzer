const axios = require("axios");

const BASE_URL = "https://api.tatum.io";
const API_KEY = process.env.TATUM_API_KEY;

if (!API_KEY) {
  throw new Error("TATUM_API_KEY is not defined in .env file");
}

const headers = {
  "x-api-key": API_KEY,
};

/**
 * Get ETH account balance
 * GET /v3/ethereum/account/balance/{address}
 */
async function getAccountBalance(address) {
  try {
    const url = `${BASE_URL}/v3/ethereum/account/balance/${address}`;
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching account balance:");
    throw error;
  }
}

/**
 * Get last transactions by address
 * GET /v3/ethereum/account/transaction/{address}
 */
async function getTransactionsByAddress(address) {
  try {
    const url = `${BASE_URL}/v3/ethereum/account/transaction/${address}?pageSize=5`;
    const response = await axios.get(url, { headers });

    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching transactions:");
    throw error;
  }
}

/**
 * Get full transaction details
 * GET /v3/ethereum/transaction/{hash}
 */
async function getTransactionByHash(hash) {
  try {
    const url = `${BASE_URL}/v3/ethereum/transaction/${hash}`;
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction by hash:");
    throw error;
  }
}

/**
 * Get ETH price in selected fiat currency
 * GET /v3/tatum/rate/ETH?basePair={currency}
 */
async function getEthPrice(baseCurrency = "USD") {
  try {
    const url = `${BASE_URL}/v3/tatum/rate/ETH?basePair=${baseCurrency}`;
    const response = await axios.get(url, { headers });

    return Number(response.data.value);
  } catch (error) {
    console.error("Error fetching ETH price:");
    throw error;
  }
}

module.exports = {
  getAccountBalance,
  getTransactionsByAddress,
  getTransactionByHash,
  getEthPrice,
};

