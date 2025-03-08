// Select the soldier and dialog elements
const soldier = document.getElementById('soldier');
const dialog = document.getElementById('dialog');

// Define the message for the dialog
const message = "Welcome to the Squid Game! You need to survive and win!";

// Add a click event to the soldier
soldier.addEventListener('click', () => {
  // Change the message inside the dialog
  document.getElementById('message').textContent = message;

  // Show the dialog
  dialog.classList.add('show');

  // Optional: Hide the dialog after a few seconds
  setTimeout(() => {
    dialog.classList.remove('show');
  }, 5000);  // Hide after 5 seconds (you can adjust the time)
});