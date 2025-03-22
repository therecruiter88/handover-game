document.addEventListener("DOMContentLoaded", function () {
    // Fetch the players JSON file
    fetch('/data/players_discharged.json')
        .then(response => response.json())  // Parse JSON response
        .then(data => {
            const playersList = document.getElementById('players-list');
            
            // Loop through each player and create a list item
            data.players.forEach(player => {
                const li = document.createElement('li');
                li.textContent = `${player.name} ${player.badge}`;
                playersList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error loading players data:', error);
        });
});