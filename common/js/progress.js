import { database, ref, get, set } from '/common/js/firebaseConfig.js';

export function getProgressFlag(playerNumber, flagName) {
    const playerId = `player${playerNumber.padStart(3, '0')}`;
    const flagRef = ref(database, `progress/${playerId}/${flagName}`);

    return get(flagRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                //console.log(`Flag "${flagName}" for ${playerId} is:`, snapshot.val());
                return snapshot.val();
            } else {
                console.warn(`Flag "${flagName}" not found for ${playerId}. Returning false.`);
                return false; // default to false if not found
            }
        })
        .catch((error) => {
            console.error(`Error getting progress flag "${flagName}" for ${playerId}:`, error);
            return false;
        });
}

export function setProgressFlag(playerNumber, flagName, value) {
    const playerId = `player${playerNumber.padStart(3, '0')}`;
    const flagRef = ref(database, `progress/${playerId}/${flagName}`);

    return set(flagRef, value)
        .then(() => {
            //console.log(`Flag "${flagName}" for ${playerId} set to ${value}`);
            console.log("Player did some progress...");
        })
        .catch((error) => {
            console.error(`Error setting progress flag "${flagName}" for ${playerId}:`, error);
        });
}