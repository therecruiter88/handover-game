// Flags for visibility
let isSoldierAndDialogVisible = true;
let isFabVisible = true;
let isChallengeOneVisible = true;
let isLeaderboardVisible = true;

document.addEventListener('DOMContentLoaded', () => {
    toggleSoldierAndDialog();
    toggleGameChallengesSelector();
    toggleChallengeOne();
    toggleLeaderboard();
});

function toggleSoldierAndDialog() {
    const soldierContainer = document.getElementById('soldier-container');

    if (isSoldierAndDialogVisible) {
        if(soldierContainer) soldierContainer.classList.remove('hidden');
    } else {
        if(soldierContainer) soldierContainer.classList.add('hidden');
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

function toggleChallengeOne() {
    const challengeOneItem = document.getElementById('challenge-1');

    if (isChallengeOneVisible) {
        if(challengeOneItem) challengeOneItem.classList.remove('hidden');
    } else {
        if(challengeOneItem) challengeOneItem.classList.add('hidden');
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