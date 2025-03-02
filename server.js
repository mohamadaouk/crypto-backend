const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000; // Dynamic port binding for Render

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Crypto Panhandling API is running!");
});

const donations = [
    { donor: "TZ8Ksz21Hk1tQutzKCUJBRXStCav9uyjJM", amount: 30.207596, timestamp: 1740844260000 },
    { donor: "THESRF9sP9p5Py4wPjiP7bF8RX7iSIfuRL", amount: 10, timestamp: 1740811236000 },
    { donor: "TCLgx89AnXbGyrewNwb9JvcXC2dJ3pBXh", amount: 189, timestamp: 1740763911000 },
];

app.get("/donations", (req, res) => {
    res.json(donations);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
