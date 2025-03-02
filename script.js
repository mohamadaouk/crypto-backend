// Updated script.js with full functionality

document.addEventListener("DOMContentLoaded", function() {
    const walletSection = document.getElementById("wallet-section");
    const progressBar = document.getElementById("progress-bar");
    const totalRaised = document.getElementById("total-raised");
    const contributorList = document.getElementById("contributor-list");
    const confettiCanvas = document.getElementById("confetti-canvas");
    let totalDonations = 0;

    function showWalletDetails() {
        walletSection.innerHTML = `
            <p>Send USDT (TRC20) to this address:</p>
            <p id="wallet-address">THnTiDp3KmGY4HctbzF2qBR9dXaNbnGt9x</p>
            <div id="qrcode"></div>
            <button class="copy-button" onclick="copyWalletAddress()">📋 Copy Address</button>
        `;
        new QRCode(document.getElementById("qrcode"), "THnTiDp3KmGY4HctbzF2qBR9dXaNbnGt9x");
    }

    function copyWalletAddress() {
        navigator.clipboard.writeText("THnTiDp3KmGY4HctbzF2qBR9dXaNbnGt9x");
        alert("Wallet address copied!");
    }

    function addDonation(amount, name) {
        totalDonations += amount;
        progressBar.value = Math.min((totalDonations / 1000) * 100, 100); 
        totalRaised.textContent = `$${totalDonations}`;

        const listItem = document.createElement("li");
        listItem.textContent = `${name} donated $${amount}`;
        contributorList.appendChild(listItem);
        launchConfetti();
    }

    function launchConfetti() {
        const confettiSettings = { target: "confetti-canvas", max: 100, size: 1.2, clock: 25 };
        const confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
        setTimeout(() => confetti.clear(), 5000);
    }

    window.showWalletDetails = showWalletDetails;
    window.addDonation = addDonation;
    window.copyWalletAddress = copyWalletAddress;
});
