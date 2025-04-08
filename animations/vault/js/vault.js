const codePanel = document.getElementById("codePanel");
const codeInput = document.getElementById("codeInput");

// JavaScript to show/hide code panel
function showCodePanel() {
  if (codePanel) {
    codePanel.classList.remove("hidden");
    codePanel.style.display = "block";
  }
  
  if (codeInput) codeInput.focus();
}

function closeCodePanel() {
  if (codePanel) codePanel.classList.add("hidden");
  if (codeInput) codeInput.value = '';
}

function checkVaultCode() {
  const input = codeInput.value.trim().toUpperCase();
  const vault = document.getElementById("vault")
  const wrongCodeSound = document.getElementById("wrongCode");
  const correctCodeSound = document.getElementById("correctCode");
  const vaultOpenSound = document.getElementById("vaultOpen");

  const encodedInput = toBase64(input); // Encode the input code into Base64

  if (encodedInput === correctBase64) {
    correctCodeSound.play();

    setTimeout(function() {
      closeCodePanel();
      vaultOpenSound.play();
      vault.classList.add("opened");
      codeInput.value = '';
    }, 1000);
  } else {
    wrongCodeSound.play();
    alert("Wrong code!");
    codeInput.value = '';
  }
}

const correctBase64 = "MzEyQkVFUg==";

// Function to encode a string into Base64
function toBase64(str) {
  return btoa(str); // `btoa` is a built-in function to encode to Base64 in JavaScript
}