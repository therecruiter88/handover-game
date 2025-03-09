<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDyj0Awkh6K4AATQdLnxP8AgEmTD2WqdM4",
    authDomain: "handover-game.firebaseapp.com",
    projectId: "handover-game",
    storageBucket: "handover-game.appspot.com",  // ✅ FIXED
    messagingSenderId: "611197045900",
    appId: "1:611197045900:web:49afa6563517dd16523fa9",
    measurementId: "G-Z1F7ZPCL1L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const scoreboardTrigger = document.getElementById('scoreboard-trigger');
    const leaderboardPanel = document.getElementById('leaderboard-panel');
    const leaderboardTable = document.getElementById('leaderboard-table');
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
    let isPanelVisible = false;

    function generateLeaderboard(data) {
        leaderboardTable.innerHTML = '';
        const headerRow = leaderboardTable.insertRow();
        const headerPlayer = headerRow.insertCell();
        const headerScore = headerRow.insertCell();
        headerPlayer.textContent = "Player";
        headerScore.textContent = "Score";

        // Sort the data by score in descending order
        const sortedData = Object.entries(data).sort(([, a], [, b]) => b.score - a.score);

        sortedData.forEach(([key, entry]) => {
            const row = leaderboardTable.insertRow();
            const cellPlayer = row.insertCell();
            const cellScore = row.insertCell();
            cellPlayer.textContent = entry.player;
            cellScore.textContent = entry.score;
        });
    }

    // Listen for changes in the database
    const leaderboardRef = ref(database, 'leaderboard');
    onValue(leaderboardRef, (snapshot) => { // ✅ CORRECT
        const data = snapshot.val();
        if (data) {
            generateLeaderboard(data);
        }
    });

    scoreboardTrigger.addEventListener('click', (event) => {
        event.stopPropagation();
        isPanelVisible = !isPanelVisible
        leaderboardPanel.style.display = isPanelVisible ? "block" : "none";
        overlay.style.display = isPanelVisible ? "block" : "none";
    });

    document.addEventListener('click', (event) => {
        if (isPanelVisible && !leaderboardPanel.contains(event.target) && event.target !== scoreboardTrigger) {
            isPanelVisible = false;
            leaderboardPanel.style.display = "none";
            overlay.style.display = "none";
        }
    });
});
</script>