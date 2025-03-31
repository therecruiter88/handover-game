// Flags for visibility
let isSoldierAndDialogVisible = true;
let isFabVisible = true;
let isChallengeOneVisible = true;
let isChallengeTwoVisible = true;
let isChallengeThreeVisible = true;
let isChallengeFourVisible = true;
let isLeaderboardVisible = true;
let isBombVisible = true;

document.addEventListener('DOMContentLoaded', () => {
    toggleSoldierAndDialog();
    toggleBomb();
    toggleGameChallengesSelector();
    toggleChallengeOne();
    toggleChallengeTwo();
    toggleChallengeThree();
    toggleChallengeFour();
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

function toggleBomb() {
    const bombContainer = document.getElementById('bomb-container');
    const canvasContainer = document.getElementById('three-canvas');

    if (isBombVisible) {
        if(bombContainer) {
            bombContainer.classList.remove('hidden');
            canvasContainer.classList.remove('hidden');
            bombContainer.classList.add('visible');
            canvasContainer.classList.add('visible');
        }
    } else {
        if(bombContainer) {
            bombContainer.classList.add('hidden');
            canvasContainer.classList.add('hidden');
            bombContainer.classList.remove('visible');
        }
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

function toggleChallengeTwo() {
    const challengeTwoItem = document.getElementById('challenge-2');

    if (isChallengeTwoVisible) {
        if(challengeTwoItem) challengeTwoItem.classList.remove('hidden');
    } else {
        if(challengeTwoItem) challengeTwoItem.classList.add('hidden');
    }
}

function toggleChallengeThree() {
    const challengeThreeItem = document.getElementById('challenge-3');

    if (isChallengeThreeVisible) {
        if(challengeThreeItem) challengeThreeItem.classList.remove('hidden');
    } else {
        if(challengeThreeItem) challengeThreeItem.classList.add('hidden');
    }
}

function toggleChallengeFour() {
    const challengeFourItem = document.getElementById('challenge-4');

    if (isChallengeFourVisible) {
        if(challengeFourItem) challengeFourItem.classList.remove('hidden');
    } else {
        if(challengeFourItem) challengeFourItem.classList.add('hidden');
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