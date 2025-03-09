document.addEventListener('DOMContentLoaded', () => {
    const scoreboardTrigger = document.getElementById('scoreboard-trigger');
    const leaderboardPanel = document.getElementById('leaderboard-panel');
    const leaderboardTable = document.getElementById('leaderboard-table');
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
    let isPanelVisible = false;
    
    const leaderboardData = [
        { player: "Player 001", score: Math.floor(Math.random() * 100) },
        { player: "Player 002", score: Math.floor(Math.random() * 100) },
        { player: "Player 003", score: Math.floor(Math.random() * 100) },
        { player: "Player 004", score: Math.floor(Math.random() * 100) },
        { player: "Player 005", score: Math.floor(Math.random() * 100) },
        { player: "Player 006", score: Math.floor(Math.random() * 100) },
        { player: "Player 007", score: Math.floor(Math.random() * 100) },
        { player: "Player 008", score: Math.floor(Math.random() * 100) },
        { player: "Player 009", score: Math.floor(Math.random() * 100) },
        { player: "Player 010", score: Math.floor(Math.random() * 100) },
        { player: "Player 011", score: Math.floor(Math.random() * 100) },
        { player: "Player 012", score: Math.floor(Math.random() * 100) },
        { player: "Player 013", score: Math.floor(Math.random() * 100) },
        { player: "Player 014", score: Math.floor(Math.random() * 100) },
        { player: "Player 015", score: Math.floor(Math.random() * 100) },
    ];
    
    function generateLeaderboard() {
        leaderboardTable.innerHTML = '';
        const headerRow = leaderboardTable.insertRow();
        const headerPlayer = headerRow.insertCell();
        const headerScore = headerRow.insertCell();
        headerPlayer.textContent = "Player";
        headerScore.textContent = "Score";
    
        leaderboardData.forEach(entry => {
            const row = leaderboardTable.insertRow();
            const cellPlayer = row.insertCell();
            const cellScore = row.insertCell();
            cellPlayer.textContent = entry.player;
            cellScore.textContent = entry.score;
        });
    }
    
    generateLeaderboard()
    
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