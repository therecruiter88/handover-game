import { database, ref, get, set } from '/common/js/firebaseConfig.js';

// Function to update the player's score and bestScore in Firebase
export function saveScoreToDatabase(playerNumber, score, challengeName) {
    const playerId = `player${playerNumber.padStart(3, '0')}`;
    const playerName = `Player ${playerNumber}`;
    const playerRef = ref(database, `leaderboards/${challengeName}/${playerId}`);
  
    console.log(`Saving score to database: Player ID: ${playerId}, Player Name: ${playerName}, Challenge Name: ${challengeName}`);
  
    // Retrieve current player data from Firebase
    get(playerRef).then((snapshot) => {
        if (snapshot.exists()) {
            const playerData = snapshot.val();
            const bestScore = playerData.bestScore || 0; // Default to 0 if not set
  
            // Determine if bestScore should be updated
            const newBestScore = score > bestScore ? score : bestScore;
  
            // Update the score and bestScore if necessary
            set(playerRef, {
                player: playerName,
                score: score,
                bestScore: newBestScore
            }).then(() => {
                console.log(`Player "${playerName}" score updated to ${score}, best score is ${newBestScore}`);
            }).catch((error) => {
                console.error("Error updating score:", error);
            });
  
        } else {
            // If player doesn't exist, create a new player with initial bestScore
            set(playerRef, {
                player: playerName,
                score: score,
                bestScore: score
            }).then(() => {
                console.log(`New player "${playerName}" created with score ${score} and bestScore ${score}`);
            }).catch((error) => {
                console.error(`Error creating new player "${playerName}":`, error);
            });
        }
    }).catch((error) => {
        console.error(`Error checking player "${playerName}":`, error);
    });
  }