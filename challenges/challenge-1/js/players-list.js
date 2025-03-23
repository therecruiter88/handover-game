document.addEventListener("DOMContentLoaded", function () {
    // Fetch the players JSON file
    fetch('../common/data/selectable_players.json')
        .then(response => response.json())  // Parse JSON response
        .then(data => {
            const selectElement = document.getElementById('player-number');

            // Create and append the default disabled option
            const defaultOption = document.createElement('option');
            defaultOption.value = "";
            defaultOption.textContent = "xxx";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            defaultOption.classList.add('sound-efx'); // Add the sound-efx clas
            selectElement.appendChild(defaultOption);

            // Loop through each player and create an option element
            data.players.forEach(player => {
                const option = document.createElement('option');
                option.value = player.id.toString().padStart(3, '0'); // Ensure it's a string with 3 digits
                option.textContent = option.value;
                option.classList.add('sound-efx'); // Add the sound-efx clas
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading players data:', error);
        });
});