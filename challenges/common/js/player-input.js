// Display player number prompt
export function showPlayerNumberInput(startIntro, storylineText, storyTitles,) {
  const playerNumberInputElement = document.getElementById("player-name-prompt");

  if (urlHasPlayerNumberFromQuery() && isPlayerNumberValid(getPlayerNumberFromQuery())) {
    if (playerNumberInputElement) playerNumberInputElement.style.display = 'none';

    // Call the startIntro directly here, as player number is valid in the query string
    setTimeout(() => {
      startIntro(storylineText, storyTitles);
    }, 100);

    return; // Exit the function early if intro starts
  }

  const introContainerElement = document.getElementById("intro-container");
  const storyContainerElement = document.getElementById("story-container");
  const playerNumberSelect = document.getElementById('player-number');

  if (playerNumberInputElement) {

    playerNumberInputElement.style.display = 'flex';
    if (introContainerElement) introContainerElement.style.display = 'none';
    if (storyContainerElement) storyContainerElement.style.display = 'none';

    // Reset the select dropdown to its default state
    playerNumberSelect.value = ''; // This will select the first (disabled) option
  }

}

const validPlayers = [
  "001", "002", "016", "018", "019", "023", "026", "051", "054", "057", "065",
  "068", "077", "107", "120", "130", "135", "136", "141", "182", "183", "186",
  "187", "188", "194", "221", "222", "226", "229", "232", "243", "273", "278",
  "286", "287", "297", "301", "339", "343"
];

export function isPlayerNumberValid(playerNumber) {
  return validPlayers.includes(playerNumber);
}

export function getPlayerNumber() {
  if (urlHasPlayerNumberFromQuery()) {
    // If 'playerNumber' exists in query parameters, return that
    return getPlayerNumberFromQuery();
  } else {
    // Otherwise, return selectedPlayerNumber as fallback
    const playerNumberSelect = document.getElementById('player-number');
    return playerNumberSelect.value;
  }
}

function urlHasPlayerNumberFromQuery() {
  const queryParams = new URLSearchParams(window.location.search); // Get query parameters from URL
  // Check if 'playerNumber' exists in query parameters and return the result directly
  return queryParams.has('playerNumber');
}

function getPlayerNumberFromQuery() {
    // Grab the playerNumber from the URL query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const playerNumber = queryParams.get('playerNumber');

    if (playerNumber) {
      console.log("Welcome Player:" + playerNumber)
      return playerNumber;
    }
}