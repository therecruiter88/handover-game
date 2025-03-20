import { database, ref, get } from '../common/js/firebaseConfig.js';

document.addEventListener('DOMContentLoaded', () => {
    const scoreboardTrigger = document.getElementById('challenge-leaderboard');
    const leaderboardPanel = document.getElementById('leaderboard-panel');
    const leaderboardTable = document.getElementById('leaderboard-table');
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
    let isPanelVisible = false;

    // Function to fetch leaderboard data from Firebase
    async function fetchLeaderboardData(tab) {
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

    // Function to calculate the total score for each player
    async function calculateTotalScores() {
        const challenges = ['challenge-1', 'challenge-2']; // Add more challenges here if needed
        const allPlayerData = {};

        for (const challenge of challenges) {
            const data = await fetchLeaderboardData(challenge);
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
    async function generateLeaderboard(tab) {
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

        headerRow.insertCell().textContent = ""; // Add trophy column header
    
        let data = tab === 'total' ? await calculateTotalScores() : await fetchLeaderboardData(tab);
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
            const totalGoldenPlayerScore = challengeOneGoldenScore + challengeTwoGoldenScore;

            if (
                (tab === 'total' && entry.totalScore >= totalGoldenPlayerScore) ||
                (tab === 'challenge-1' && entry.bestScore >= challengeOneGoldenScore) ||
                (tab === 'challenge-2' && entry.bestScore >= challengeTwoGoldenScore)
            ) {
                trophyCell.innerHTML = '<span class="trophy-icon">🏆</span>'
            } else {
                trophyCell.textContent = '';
            }
        });
    
        leaderboardTable.replaceChildren(...tempTable.children);
    }    

    // Event listener to toggle the leaderboard panel visibility
    scoreboardTrigger.addEventListener('click', (event) => {
        event.stopPropagation();
        isPanelVisible = !isPanelVisible;
        leaderboardPanel.style.display = isPanelVisible ? "block" : "none";
        overlay.style.display = isPanelVisible ? "block" : "none";

        const challengeList = document.getElementById('challenge-list');
        if (challengeList) challengeList.classList.remove('show'); // Hide the list
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
            generateLeaderboard(selectedTab);
        });
    });

    // Generate the leaderboard for the "Total Score" tab initially
    generateLeaderboard('total');
});