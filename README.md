# Ethereum Wallet Activity Analyzer

A Node.js application built using the Tatum API that analyzes Ethereum Mainnet wallet activity.

This project demonstrates practical API usage and multi-step data processing.
It analyzes Ethereum wallet activity using the Tatum API and transforms raw blockchain data into financial and risk insights.

The application shows how blockchain data can support wallet monitoring, exposure analysis, reporting, and preliminary risk assessment in real-world business scenarios.
---

Features: 

- Fetches current ETH wallet balance
- Retrieves last 5 Ethereum transactions
- Identifies largest transaction in recent activity
- Calculates total incoming and outgoing ETH
- Calculates gas usage
- Converts ETH values to USD and CZK
- Generates wallet risk score
- Determines activity level

---

How it Works

The application demonstrates API chaining and data processing:

1. Retrieves wallet balance  
   `GET /v3/ethereum/account/balance/{address}`

2. Retrieves recent transactions  
   `GET /v3/ethereum/account/transaction/{address}`

3. Extracts transaction hashes from response of account/transaction/{address}

4. Fetches full transaction details using each hash  
   `GET /v3/ethereum/transaction/{hash}`

5. Retrieves ETH price data  
   `GET /v3/tatum/rate/ETH?basePair=USD`  
   `GET /v3/tatum/rate/ETH?basePair=CZK`

6. Calculates:
   - Total incoming/outgoing volume
   - Gas usage
   - Fiat conversion
   - Risk level
   - Activity score

---

Technologies Used

- Node.js
- Tatum Blockchain API
- Command Line Interface (CLI)
- Postman for manual testing


---

Installation

Clone repository:

```
git clone https://github.com/elen-api/tatum-eth-analyzer
cd tatum-eth-analyzer
```

Install dependencies:

```
npm install
```

Create `.env` file in the root folder:

```
TATUM_API_KEY=your_api_key_here
```

---

Usage

Run the analyzer:

```
node src/index.js <wallet_address>
```

Example:

```
node src/index.js 0x00000000219ab540356cBB839Cbe05303d7705Fa
```

---

Example Output

- Current Balance
- Incoming / Outgoing ETH
- Largest Transaction
- Gas Usage
- USD & CZK conversion
- Risk Score
- Activity Level

