require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
const PORT = process.env.PORT || 5000;
const TRON_WALLET = "THnTiDp3KmGY4HctbzF2qBR9dXaNbnGt9x";

// Initialize Firebase
const firebaseCredentials = JSON.parse(process.env.FIREBASE_CREDENTIALS);
admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentials),
});

const db = admin.firestore();
app.use(cors());
app.use(express.json());

// Function to fetch USDT donations
async function fetchUSDTTransactions() {
    try {
        const tronAPI = `https://api.trongrid.io/v1/accounts/${TRON_WALLET}/transactions/trc20`;
        const response = await axios.get(tronAPI);
        const transactions = response.data.data;

        for (let tx of transactions) {
            if (tx.to === TRON_WALLET && tx.token_info.symbol === "USDT") {
                let amount = parseFloat(tx.value) / Math.pow(10, 6);
                let donor = tx.from;
                let txID = tx.transaction_id;

                const doc = await db.collection("donations").doc(txID).get();
                if (!doc.exists) {
                    await db.collection("donations").doc(txID).set({
                        donor,
                        amount,
                        timestamp: tx.block_timestamp,
                    });
                    console.log(`✅ New donation: ${donor} sent $${amount}`);
                }
            }
        }
    } catch (error) {
        console.error("❌ Error fetching donations:", error);
    }
}

// Fetch donations every 10 seconds
setInterval(fetchUSDTTransactions, 10000);

// API Endpoint
app.get("/donations", async (req, res) => {
    const snapshot = await db.collection("donations").orderBy("timestamp", "desc").get();
    const donations = snapshot.docs.map(doc => doc.data());
    res.json(donations);
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
