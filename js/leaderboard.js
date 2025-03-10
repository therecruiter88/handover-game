import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js'
// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js'
// Add Firebase products that you want to use
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js'
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js'

const firebaseConfig = {
    apiKey: "AIzaSyDyj0Awkh6K4AATQdLnxP8AgEmTD2WqdM4",
    authDomain: "handover-game.firebaseapp.com",
    databaseURL: "https://handover-game-default-rtdb.firebaseio.com",
    projectId: "handover-game",
    storageBucket: "handover-game.firebasestorage.app",
    messagingSenderId: "611197045900",
    appId: "1:611197045900:web:49afa6563517dd16523fa9",
    measurementId: "G-Z1F7ZPCL1L"
};

// Initialize Firebase bd
const app = initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', () => {
    const scoreboardTrigger = document.getElementById('challenge-leaderboard');
    const leaderboardPanel = document.getElementById('leaderboard-panel');
    const leaderboardTable = document.getElementById('leaderboard-table');
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
    let isPanelVisible = false;

    // Example leaderboard data for different challenges
    const leaderboardData = {
        total: [
            { player: "Player 001", score: 70 },
            { player: "Player 002", score: 60 },
            { player: "Player 003", score: 50 },
            { player: "Player 004", score: 200 },
            { player: "Player 005", score: 250 },
            { player: "Player 006", score: 110 },
            { player: "Player 007", score: 10 },
            { player: "Player 008", score: 90 },
            { player: "Player 009", score: 400 },
            { player: "Player 010", score: 370 },
            { player: "Player 011", score: 70 },
            { player: "Player 012", score: 40 },
            { player: "Player 013", score: 30 },
            { player: "Player 014", score: 20 },
            { player: "Player 015", score: 10 }
        ],
        challenge1: [
            { player: "Player 001", score: 30 },
            { player: "Player 002", score: 50 },
            { player: "Player 003", score: 40 },
            { player: "Player 004", score: 200 },
            { player: "Player 005", score: 250 },
            { player: "Player 006", score: 110 },
            { player: "Player 007", score: 10 },
            { player: "Player 008", score: 90 },
            { player: "Player 009", score: 400 },
            { player: "Player 010", score: 370 },
            { player: "Player 011", score: 70 },
            { player: "Player 012", score: 40 },
            { player: "Player 013", score: 30 },
            { player: "Player 014", score: 20 },
            { player: "Player 015", score: 10 }
        ],
        /*challenge2: [
            { player: "Player 001", score: 40 },
            { player: "Player 002", score: 30 },
            { player: "Player 003", score: 30 },
            { player: "Player 004", score: 200 },
            { player: "Player 005", score: 250 },
            { player: "Player 006", score: 110 },
            { player: "Player 007", score: 10 },
            { player: "Player 008", score: 90 },
            { player: "Player 009", score: 400 },
            { player: "Player 010", score: 370 },
            { player: "Player 011", score: 70 },
            { player: "Player 012", score: 40 },
            { player: "Player 013", score: 30 },
            { player: "Player 014", score: 20 },
            { player: "Player 015", score: 10 }
        ],*/
        /*challenge3: [
            { player: "Player 001", score: 60 },
            { player: "Player 002", score: 40 },
            { player: "Player 003", score: 50 },
            { player: "Player 004", score: 200 },
            { player: "Player 005", score: 250 },
            { player: "Player 006", score: 110 },
            { player: "Player 007", score: 10 },
            { player: "Player 008", score: 90 },
            { player: "Player 009", score: 400 },
            { player: "Player 010", score: 370 },
            { player: "Player 011", score: 70 },
            { player: "Player 012", score: 40 },
            { player: "Player 013", score: 30 },
            { player: "Player 014", score: 20 },
            { player: "Player 015", score: 10 }
        ]*/
    };


    // Function to fetch leaderboard data from Firebase
    async function fetchLeaderboardData(tab) {
        try {
            const db = getDatabase(app);
            const snapshot = await get(ref(db, `leaderboards/${tab}`)); // Adjust this based on your DB structure
            if (snapshot.exists()) {
                return Object.values(snapshot.val()); // Convert object to array
            } else {
                console.warn(`No data found for ${tab}`);
                return [];
            }
        } catch (error) {
            console.error(`Error fetching ${tab} data:`, error);
            return [];
        }
    }

    // Function to generate the leaderboard based on the selected tab
    function generateLeaderboard(tab) {
        leaderboardTable.innerHTML = '';
        const headerRow = leaderboardTable.insertRow();
        const headerPlayer = headerRow.insertCell();
        const headerScore = headerRow.insertCell();
        headerPlayer.textContent = "Player";
        headerScore.textContent = "Score";

        // When need to test static data
        //const data = leaderboardData[tab];
        // For dynamic data from firebase connection
        const data = fetchLeaderboardData(tab);

        // Sort the data by score in descending order
        data.sort((a, b) => b.score - a.score);

        // Populate the table with sorted data
        data.forEach(entry => {
            const row = leaderboardTable.insertRow();
            const cellPlayer = row.insertCell();
            const cellScore = row.insertCell();
            cellPlayer.textContent = entry.player;
            cellScore.textContent = entry.score;
        });
    }

    // Initialize the leaderboard with the "Total" tab data
    generateLeaderboard('total');

    // Event listener to toggle the leaderboard panel visibility
    scoreboardTrigger.addEventListener('click', (event) => {
        event.stopPropagation();
        isPanelVisible = !isPanelVisible;
        leaderboardPanel.style.display = isPanelVisible ? "block" : "none";
        overlay.style.display = isPanelVisible ? "block" : "none";
    });

    // Event listener to close the leaderboard panel when clicking outside of it
    document.addEventListener('click', (event) => {
        if (isPanelVisible && !leaderboardPanel.contains(event.target) && event.target !== scoreboardTrigger) {
            isPanelVisible = false;
            leaderboardPanel.style.display = "none";
            overlay.style.display = "none";
        }
    });

    // Event listener to switch between leaderboard tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const selectedTab = event.target.dataset.tab;
            
            // Remove the "active" class from all tabs
            tabButtons.forEach(tab => tab.classList.remove('active'));
            
            // Add the "active" class to the clicked tab
            event.target.classList.add('active');
            
            // Generate the leaderboard for the selected tab
            generateLeaderboard(selectedTab);
        });
    });
});