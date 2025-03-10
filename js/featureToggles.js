// Flags for visibility
let isSoldierAndDialogVisible = false;
let isFabVisible = false;
let isLeaderboardVisible = false;

document.addEventListener('DOMContentLoaded', () => {
    toggleSoldierAndDialog();
    toggleGameChallengesSelector();
    toggleLeaderboard();
});

// Functions to toggle visibility
function toggleSoldierAndDialog() {
    const soldierContainer = document.getElementById('soldier-container');

    if (isSoldierAndDialogVisible) {
        soldierContainer.classList.remove('hidden');
    } else {
        soldierContainer.classList.add('hidden');
    }
}

function toggleGameChallengesSelector() {   
    const fab = document.getElementById('fab-container');

    if (isFabVisible) {
        if(fab) fab.classList.remove('hidden');
    } else {
        if(fab) fab.classList.add('hidden');
    }
}

function toggleLeaderboard() {
    const leaderboardItem = document.getElementById('challenge-leaderboard');
    const leaderboardPanel = document.getElementById('leaderboard-panel');

    if (isLeaderboardVisible) {
        if(leaderboardItem) leaderboardItem.classList.remove('hidden');
        if(leaderboardPanel) leaderboardPanel.classList.remove('hidden');
    } else {
        if(leaderboardItem) leaderboardItem.classList.add('hidden');
        if(leaderboardPanel) leaderboardPanel.classList.add('hidden');
    }
}