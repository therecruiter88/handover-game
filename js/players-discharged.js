const menuPlayersDisharged = document.getElementById('menuPlayers');
let playersDishargedPanel = document.getElementById('players-discharged-panel');
let playersDishargedTable = document.getElementById('players-discharged-table');
const overlayLeaderboard = document.createElement('div');
overlayLeaderboard.classList.add('overlay');
document.body.appendChild(overlayLeaderboard);
let isPlayersDischargedPanelVisible = false;

document.addEventListener("DOMContentLoaded", function () {
    // Fetch the players JSON file
    fetch('/data/players-discharged.json')
        .then(response => response.json())  // Parse JSON response
        .then(data => {
            populatePlayers(true, data);  // Call function to populate the players list
        })
        .catch(error => {
            console.error('Error loading players data:', error);
        });
});

function populatePlayers(table, data) {
    if (table === true) {
        populatePlayersTable(data);
    } else {
        populatePlayersList(data);
    }
}

function populatePlayersTable(data) {
    // Render as a table or alternative format
    const tableElement = document.createElement('table');
    tableElement.classList.add('players-discharged-table');
    tableElement.style.width = '100%';
    
    data.players.forEach(player => {
        const row = document.createElement('tr');
    
        const nameCell = document.createElement('td');
        nameCell.textContent = player.name;
    
        const badgeCell = document.createElement('td');
        badgeCell.textContent = player.badge;
    
        row.appendChild(nameCell);
        row.appendChild(badgeCell);
        tableElement.appendChild(row);
    });
    
    playersDishargedTable.appendChild(tableElement);
}

function populatePlayersList(data) {
    const playersList = document.getElementById('players-list');

    // Default rendering as list items
    data.players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name} ${player.badge}`;
        playersList.appendChild(li);
    });
}

// Event listener to toggle the Players Disharged panel visibility
menuPlayersDisharged.addEventListener('click', (event) => {
    isPlayersDischargedPanelVisible = !isPlayersDischargedPanelVisible;

    playersDishargedPanel.style.display = isPlayersDischargedPanelVisible ? "block" : "none";
    overlayLeaderboard.style.display = isPlayersDischargedPanelVisible ? "block" : "none";

    // Reset the scroll position to the top when the leaderboard is opened
    if (isPlayersDischargedPanelVisible) playersDishargedPanel.scrollTop = 0;
});

// Event listener to close the leaderboard panel when clicking outside of it
document.addEventListener('click', (event) => {
    if (isPlayersDischargedPanelVisible && !playersDishargedPanel.contains(event.target) && event.target !== menuPlayersDisharged) {
        isPlayersDischargedPanelVisible = false;
        playersDishargedPanel.style.display = "none";
        overlayLeaderboard.style.display = "none";
    }
});