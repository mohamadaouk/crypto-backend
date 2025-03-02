require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;
const TRON_WALLET = "THnTiDp3KmGY4HctbzF2qBR9dXaNbnGt9x"; // Replace with your wallet address

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const DonationSchema = new mongoose.Schema({
    donor: String,
    amount: Number,
    txID: String,
    timestamp: Number
});

const Donation = mongoose.model("Donation", DonationSchema);

// Function to fetch USDT transactions
async function fetchUSDTTransactions() {
    try {
        const tronAPI = `https://api.trongrid.io/v1/accounts/${TRON_WALLET}/transactions/trc20`;
        const response = await axios.get(tronAPI);
        const transactions = response.data.data;

        for (let tx of transactions) {
            if (tx.to === TRON_WALLET && tx.token_info.symbol === "USDT") {
                let amount = parseFloat(tx.value) / Math.pow(10, 6); // Convert decimals
                let donor = tx.from;
                let txID = tx.transaction_id;

                const existingTx = await Donation.findOne({ txID });
                if (!existingTx) {
                    await Donation.create({ donor, amount, txID, timestamp: tx.block_timestamp });
                    console.log(`💰 New donation: ${donor} sent $${amount}`);
                }
            }
        }
    } catch (error) {
        console.error("❌ Error fetching donations:", error);
    }
}

// Fetch donations every 10 seconds
setInterval(fetchUSDTTransactions, 10000);

// API Endpoint to get stored donations
app.get("/donations", async (req, res) => {
    const donations = await Donation.find().sort({ timestamp: -1 });
    res.json(donations);
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
