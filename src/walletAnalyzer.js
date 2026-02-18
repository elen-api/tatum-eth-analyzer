const {
  getAccountBalance,
  getTransactionsByAddress,
  getTransactionByHash,
  getEthPrice,
} = require("./tatumClient");

async function analyzeWallet(address) {
  try {
    console.log("\n==============================================");
    console.log(" Ethereum Wallet Activity Analyzer ");
    console.log("==============================================\n");

    console.log("Wallet:", address);
    console.log("----------------------------------------------");

    // 1️⃣ BALANCE
    const balanceData = await getAccountBalance(address);

    if (!balanceData || !balanceData.balance) {
      console.log("Could not retrieve balance.");
      return;
    }

    const balanceEth = Number(balanceData.balance);
    console.log("Current Balance:", balanceEth.toFixed(6), "ETH");

    // 2️⃣ GET LAST 5 TRANSACTIONS
    const txList = await getTransactionsByAddress(address);

    if (!txList || txList.length === 0) {
      console.log("No transactions found.");
      return;
    }

    let totalIncoming = 0;
    let totalOutgoing = 0;
    let totalGasSpent = 0;

    let largestTx = null;
    let largestValue = 0;

    for (const tx of txList) {
      const valueEth = Number(tx.value) / 1e18;

      // Track largest transaction
      if (valueEth > largestValue) {
        largestValue = valueEth;
        largestTx = tx;
      }

      if (tx.to?.toLowerCase() === address.toLowerCase()) {
        totalIncoming += valueEth;
      } else {
        totalOutgoing += valueEth;
      }
    }

    console.log("----------------------------------------------");
    console.log("Last 5 TX Incoming:", totalIncoming.toFixed(6), "ETH");
    console.log("Last 5 TX Outgoing:", totalOutgoing.toFixed(6), "ETH");

    // 3️⃣ ENRICH LARGEST TRANSACTION (CHAINED CALL)
    if (largestTx) {
      console.log("----------------------------------------------");
      console.log("Largest TX (from last 5):", largestTx.hash);
      console.log("Value:", largestValue.toFixed(6), "ETH");

      const fullTx = await getTransactionByHash(largestTx.hash);

      if (fullTx) {
        const gasEth =
          (Number(fullTx.gasUsed) *
            Number(fullTx.effectiveGasPrice)) / 1e18;

        totalGasSpent += gasEth;

        console.log("Gas Used (Largest TX):", gasEth.toFixed(6), "ETH");
      }
    }

    console.log("----------------------------------------------");
    console.log("Gas Spent (largest TX):", totalGasSpent.toFixed(6), "ETH");

    // 4️⃣ PRICE CONVERSION
    const ethPriceUsd = Number(await getEthPrice("USD"));
    const ethPriceCzk = Number(await getEthPrice("CZK"));

    const balanceUsd = balanceEth * ethPriceUsd;
    const balanceCzk = balanceEth * ethPriceCzk;

    const volumeEth = totalIncoming + totalOutgoing;
    const volumeUsd = volumeEth * ethPriceUsd;
    const volumeCzk = volumeEth * ethPriceCzk;

    console.log("----------------------------------------------");
    console.log("ETH Price:", ethPriceUsd.toFixed(2), "USD");
    console.log("ETH Price:", ethPriceCzk.toFixed(2), "CZK");

    console.log("Balance in USD:", balanceUsd.toFixed(2), "USD");
    console.log("Balance in CZK:", balanceCzk.toFixed(2), "CZK");

    console.log("Last 5 TX Volume in USD:", volumeUsd.toFixed(2), "USD");
    console.log("Last 5 TX Volume in CZK:", volumeCzk.toFixed(2), "CZK");

    // 5️⃣ RISK SCORING
    let riskLevel = "😌 LOW";

    if (totalOutgoing > totalIncoming && volumeUsd > 100000) {
      riskLevel = "😮 HIGH";
    } else if (volumeUsd > 10000) {
      riskLevel = "😐 MEDIUM";
    }

    console.log("----------------------------------------------");
    console.log("Wallet Risk Score:", riskLevel);

    // 6️⃣ ACTIVITY LEVEL
    const activityScore = totalIncoming + totalOutgoing;

    console.log("----------------------------------------------");

    if (activityScore > 100) {
      console.log("Activity Level: 🔥 HIGH");
    } else if (activityScore > 10) {
      console.log("Activity Level: ⚡ MEDIUM");
    } else {
      console.log("Activity Level: 💤 LOW");
    }

    console.log("\nAnalysis complete.\n");

  } catch (error) {
    console.error("\nUnexpected error occurred:");
    console.error(error.response?.data || error.message);
  }
}

module.exports = { analyzeWallet };
