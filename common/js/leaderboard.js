import { database, ref, get } from '/common/js/firebaseConfig.js';

// Add more challenges here if needed
const challenges = ['challenge-1', 'challenge-2', 'challenge-3'];
const leaderboardButton = document.getElementById('menuLeaderboard');
//const leaderboardButton = document.getElementById('challenge-leaderboard');

document.addEventListener('DOMContentLoaded', () => {
    // Check if the URL ends with "challenge.html" to trigger the leaderboard from the end game challenge
    if (window.location.pathname.endsWith("challenge.html")) {
        //console.log("Challenge window detected. Waiting for Scoreboard button to be displayed...");
        const maxWaitTime = 10000;
        const startTime = Date.now();

        const interval = setInterval(() => {
            if (leaderboardButton && leaderboardButton.offsetParent !== null) {
                // Stop checking once the button is visible
                clearInterval(interval);
                createLeaderboardPanel();
            }
        }, 1000); // Check every second
    } else {
        createLeaderboardPanel();
    }
});

// Get the common html for scoreboard to inject on the current html page
function createLeaderboardPanel() {
    fetch("/common/html/leaderboard.html")
        .then(response => response.text())
        .then(data => {
            const leaderboardContainer = document.createElement("div");
            leaderboardContainer.innerHTML = data;
    
            // Find the first <div> inside the <body>
            const firstDiv = document.querySelector("body div#content");
    
            if (firstDiv) {
                // Append the leaderboardContainer as the last child of the first <div>
                firstDiv.appendChild(leaderboardContainer);
                loadLeaderboardBehavior();
            } else {
                console.error("No <div> found inside <body> to inject the leaderboard.");
            }
        }).catch(error => console.error("Error loading leaderboard:", error));
}

function loadLeaderboardBehavior() {;
    let leaderboardPanel = document.getElementById('leaderboard-panel');
    let leaderboardTable = document.getElementById('leaderboard-table');
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
    let isPanelVisible = false;

    // Function to fetch leaderboard data from the database (Firebase db)
    async function getLeaderboardDataFromDatabase(tab) {
        try {
            const leaderboardChallengesRef = ref(database, `leaderboards/${tab}`);
            const snapshot = await get(leaderboardChallengesRef);

            if (snapshot.exists()) {
                const data = snapshot.val();

                // Convert the object to an array of { player, score, bestScore }
                const leaderboardArray = Object.values(data).map(player => ({
                    player: player.player,
                    score: player.score,
                    bestScore: player.bestScore
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

    // Function to calculate the total score that each player accomplished in all games
    async function getTotalScores() {
        const allPlayerData = {};

        for (const challenge of challenges) {
            const data = await getLeaderboardDataFromDatabase(challenge);
            data.forEach(playerData => {
                if (!allPlayerData[playerData.player]) {
                    allPlayerData[playerData.player] = {
                        player: playerData.player,
                        totalScore: 0
                    };
                }
                allPlayerData[playerData.player].totalScore += playerData.bestScore;
            });
        }

        return Object.values(allPlayerData);
    }

    // Function to generate the leaderboard based on the selected tab
    async function createLeaderboardForTab(tab) {
        const tempTable = document.createElement('table');
        tempTable.classList.add('leaderboard-table');
    
        const headerRow = tempTable.insertRow();
        headerRow.insertCell().textContent = "Player";
        const scoreCell = headerRow.insertCell(); 
    
        if (tab === 'total') {
            scoreCell.textContent = "Total Score";
        } else {
            scoreCell.textContent = "Last Score";
            headerRow.insertCell().textContent = "Best Score";
        }

        // Add trophy column header
        headerRow.insertCell().textContent = "";
    
        let data = tab === 'total' ? await getTotalScores() : await getLeaderboardDataFromDatabase(tab);
        if (!Array.isArray(data)) return;
    
        data.sort((a, b) => tab === 'total' ? b.totalScore - a.totalScore : b.bestScore - a.bestScore);
    
        data.forEach(entry => {
            const row = tempTable.insertRow();
            const playerCell = row.insertCell();
            playerCell.textContent = entry.player;
    
            const scoreCell = row.insertCell();
            if (tab === 'total') {
                scoreCell.textContent = entry.totalScore;
            } else {
                scoreCell.textContent = entry.score;
                const bestScoreCell = row.insertCell();
                bestScoreCell.textContent = entry.bestScore;
            }

            // Add a new column for the trophy icon
            const trophyCell = row.insertCell();
            const challengeOneGoldenScore = 500;
            const challengeTwoGoldenScore = 250;
            const challengeThreeGoldenScore = 450;
            const totalGoldenPlayerScore = challengeOneGoldenScore + challengeTwoGoldenScore + challengeThreeGoldenScore;
            
            if (
                (tab === 'total' && entry.totalScore >= totalGoldenPlayerScore) ||
                (tab === 'challenge-1' && entry.bestScore >= challengeOneGoldenScore) ||
                (tab === 'challenge-2' && entry.bestScore >= challengeTwoGoldenScore) ||
                (tab === 'challenge-3' && entry.bestScore >= challengeTwoGoldenScore)
            ) {
                trophyCell.innerHTML = '<span class="trophy-icon">🏆</span>'
            } else {
                trophyCell.textContent = '';
            }
        });
    
        // Check if leaderboardTable exists before replacing its children
        if (!leaderboardTable) {
            leaderboardTable = document.getElementById('leaderboard-table');
        }

        leaderboardTable.replaceChildren(...tempTable.children);
    }    

    // Event listener to toggle the leaderboard panel visibility
    leaderboardButton.addEventListener('click', (event) => {
        //event.stopPropagation();
        isPanelVisible = !isPanelVisible;

        if (!leaderboardPanel) {
            leaderboardPanel = document.getElementById('leaderboard-panel');
        }

        leaderboardPanel.style.display = isPanelVisible ? "block" : "none";
        overlay.style.display = isPanelVisible ? "block" : "none";

        // Reset the scroll position to the top when the leaderboard is opened
        if (isPanelVisible) leaderboardPanel.scrollTop = 0;

        // Hide the list
        const challengeList = document.getElementById('challenge-list');
        if (challengeList) challengeList.classList.remove('show');
    });

    // Event listener to close the leaderboard panel when clicking outside of it
    document.addEventListener('click', (event) => {
        if (isPanelVisible && !leaderboardPanel.contains(event.target) && event.target !== leaderboardButton) {
            isPanelVisible = false;
            leaderboardPanel.style.display = "none";
            overlay.style.display = "none";
        }
    });

    // Event listener to switch between leaderboard tabs
    const tabButtons = document.querySelectorAll('#leaderboard-tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            //event.stopPropagation();
            const selectedTab = event.target.dataset.tab;

            // Remove the "active" class from all tabs
            tabButtons.forEach(tab => tab.classList.remove('active'));

            // Add the "active" class to the clicked tab
            event.target.classList.add('active');

            // Generate the leaderboard for the selected tab
            createLeaderboardForTab(selectedTab);
        });
    });

    // Generate the leaderboard for the "Total Score" tab initially
    createLeaderboardForTab('total');
}