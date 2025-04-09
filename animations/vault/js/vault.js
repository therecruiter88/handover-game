import { displayRandomHint} from '/js/pink-soldier-messages.js';
import { getProgressFlag, setProgressFlag } from '/common/js/progress.js';

const overlayVault = document.createElement('div');
overlayVault.classList.add('overlay-vault');
document.body.appendChild(overlayVault);

const codePanel = document.getElementById("code-panel");
const codeDisplay = document.getElementById("code-display");
const vault = document.getElementById("vault");
const unblockButton = document.getElementById("unblock");

let isCodePanelVisible = false;
let isVaultClickedOnce = false;

// Allowed characters for numbers and letters
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const characters = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

// Grab the playerNumber from the URL query parameters
const queryParams = new URLSearchParams(window.location.search);
const playerNumber = queryParams.get('playerNumber');

vault.addEventListener("click", async (event) => {
  const isVaultOpened = await getProgressFlag(playerNumber, 'isVaultOpened');
  const isVaultKeyFound = await getProgressFlag(playerNumber, 'isVaultKeyFound');

  // If the vault is not opened, then show the code panel
  if (!isVaultOpened) {
     showCodePanel();

     if (!isVaultClickedOnce) setInterval(displayRandomHint, 30000);
     isVaultClickedOnce = true;
  };
  
  // If the vault is opened but the key was not picked up
  if (isVaultOpened && !isVaultKeyFound) {
    const sound = new Audio('/animations/vault/assets/audio/item-grab.mp3');
    sound.play();
    vault.classList.add("opened-no-key");
    setProgressFlag(playerNumber, 'isVaultKeyFound', true);
  }

});

vault.addEventListener("mouseenter", async (event) => {
  // Wait for the flags to be fetched from the database
  const isVaultOpened = await getProgressFlag(playerNumber, 'isVaultOpened');
  const isVaultKeyFound = await getProgressFlag(playerNumber, 'isVaultKeyFound');

  // Check if the vault is opened but the key is not found
  if (isVaultOpened && !isVaultKeyFound) {
    vault.style.cursor = 'grab';
  } else {
    vault.style.cursor = 'url("/assets/cursors/sg-pointer.png") 16 16, auto';
  }
});

document.querySelector('.code-input').addEventListener('click', (event) => {
  const arrow = event.target;

  if (arrow.classList.contains('arrow-up') || arrow.classList.contains('arrow-down')) {
    const direction = arrow.getAttribute("data-direction");
    cycleBox(arrow, direction);
  }
});

// Cycle through boxes based on up/down direction
function cycleBox(arrow, direction) {
  const boxId = arrow.getAttribute("data-box");
  const box = document.getElementById(boxId);
  const span = box.querySelector("span");

  let currentValue = span.textContent;
  let nextValue;

  const isNumberBox = boxId === "box1" || boxId === "box2" || boxId === "box3";
  const valuesArray = isNumberBox ? numbers : characters;
  const index = valuesArray.indexOf(currentValue);

  if (direction === 'up') {
    nextValue = valuesArray[(index + 1) % valuesArray.length];
  } else {
    nextValue = valuesArray[(index - 1 + valuesArray.length) % valuesArray.length];
  }

  span.textContent = nextValue;
  updateCodeDisplay();
  playArrowDialSound();
}

// Construct the current code string
function getCodeFromBoxes() {
  let code = '';
  for (let i = 1; i <= 7; i++) {
    const box = document.getElementById(`box${i}`);
    const val = box?.querySelector('span')?.textContent || '';
    code += val;
    if (i === 3) code += '-';
  }
  return code;
}

// Display the current code in the visual display
function updateCodeDisplay() {
  codeDisplay.textContent = getCodeFromBoxes();
}

// Play sound on each arrow click
function playArrowDialSound() {
  const sound = new Audio('/animations/vault/assets/audio/dial.mp3');
  sound.play();
}

// Base64 encoding for comparison
function toBase64(str) {
  return btoa(str); // native browser encoder
}

// Check the entered code
function checkVaultCode() {
  const enteredCode = getCodeFromBoxes().replace("-", "");
  const encodedCode = toBase64(enteredCode);

  const wrongCodeSound = document.getElementById("wrong-code");
  const correctCodeSound = document.getElementById("correct-code");
  const vaultOpenSound = document.getElementById("vault-open");

  const correctBase64 = "MzEyQkVFUg==";

  if (encodedCode === correctBase64) {
    correctCodeSound.play();

    setTimeout(function () {
      closeCodePanel();
      vaultOpenSound.play();
      vault.classList.add("opened");
    }, 1000);

    setProgressFlag(playerNumber, 'isVaultOpened', true);
  } else {
    wrongCodeSound.play();
    const panelWrapper = document.getElementById("panel-content-wrapper");
    // Add visual indicator
    panelWrapper.classList.add("shake");

    // Remove it after the animation finishes so it can re-trigger next time
    setTimeout(() => {
      panelWrapper.classList.remove("shake");
    }, 400);
  }
}

// Show panel and overlay
function showCodePanel() {
  isCodePanelVisible = true;

  codePanel.classList.remove("hidden");
  codePanel.style.display = "block";
  overlayVault.style.display = "block";
}

// Hide panel and overlay
function closeCodePanel() {
  codePanel.classList.add("hidden");
  overlayVault.style.display = "none";
  isCodePanelVisible = false;
}

// Click outside the panel closes it
document.addEventListener('click', (event) => {
  if (
    isCodePanelVisible &&
    codePanel &&
    !codePanel.contains(event.target) &&
    !vault.contains(event.target)
  ) {
    closeCodePanel();
  }
});

// Trigger unlock on button
unblockButton.addEventListener("click", function () {
  checkVaultCode();
});