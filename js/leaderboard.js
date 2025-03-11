import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js'
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js'
// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
//import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js'
// Add Firebase products that you want to use
//import { getAuth } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js'
//import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js'

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

    // Initialize the leaderboard with the first active tab
    const activeTabButton = document.querySelector('#leaderboard-tab-button.active');
    if (activeTabButton) {
        const activeTab = activeTabButton.getAttribute('data-tab');
        generateLeaderboard(`${activeTab}`);
    }

    // Function to fetch leaderboard data from Firebase
    async function fetchLeaderboardData(tab) {
        try {
            const database = getDatabase(app);
            const leaderboardChallengesRef = ref(database, `leaderboards/${tab}`);
            const snapshot = await get(leaderboardChallengesRef);
            //console.log(`database: ${database}`);
            //console.log(`leaderboardChallengesRef: ${leaderboardChallengesRef}`);
            //console.log(`snapshot: ${snapshot}`);

            if (snapshot.exists()) {
                const data = snapshot.val();
                //console.log(`Fetched ${tab} data:`, data);

                // Convert the object to an array of { player, score }
                const leaderboardArray = Object.values(data).map(player => ({
                    player: player.player,
                    score: player.score
                }));

                return leaderboardArray;
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
    async function generateLeaderboard(tab) {
        leaderboardTable.innerHTML = '';
        const headerRow = leaderboardTable.insertRow();
        headerRow.insertCell().textContent = "Player";
        headerRow.insertCell().textContent = "Score";
    
        // Fetch data from Firebase
        const data = await fetchLeaderboardData(tab);
    
        if (!Array.isArray(data)) {
            console.error(`Data for ${tab} is not an array:`, data);
            return;
        }
    
        // Sort the data by score (descending order)
        data.sort((a, b) => b.score - a.score);
    
        // Populate the table
        data.forEach(entry => {
            const row = leaderboardTable.insertRow();
            row.insertCell().textContent = entry.player;
            row.insertCell().textContent = entry.score;
        });
    }

    // Event listener to toggle the leaderboard panel visibility
    scoreboardTrigger.addEventListener('click', (event) => {
        event.stopPropagation();
        isPanelVisible = !isPanelVisible;
        leaderboardPanel.style.display = isPanelVisible ? "block" : "none";
        overlay.style.display = isPanelVisible ? "block" : "none";

        const challengeList = document.getElementById('challenge-list');
        challengeList.classList.remove('show'); // Hide the list
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
    const tabButtons = document.querySelectorAll('#leaderboard-tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const selectedTab = event.target.dataset.tab;
            
            // Remove the "active" class from all tabs
            tabButtons.forEach(tab => tab.classList.remove('active'));
            
            // Add the "active" class to the clicked tab
            event.target.classList.add('active');
            
            // Generate the leaderboard for the selected tab
            if(isLeaderboardVisible) generateLeaderboard(selectedTab);
        });
    });
});