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

    // Function to generate the leaderboard based on the selected tab
    function generateLeaderboard(tab) {
        leaderboardTable.innerHTML = '';
        const headerRow = leaderboardTable.insertRow();
        const headerPlayer = headerRow.insertCell();
        const headerScore = headerRow.insertCell();
        headerPlayer.textContent = "Player";
        headerScore.textContent = "Score";

        const data = leaderboardData[tab];

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