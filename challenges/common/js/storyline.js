export function startIntro(storylineText, storyTitles) {
  const storylineSound = document.getElementById('storyline-sound');
  
  document.getElementById('player-name-prompt').style.display = 'none';
  document.getElementById('intro-container').style.display = 'flex';

  storylineSound.volume = 0.5;
  storylineSound.play();
  storylineSound.loop = true;

  let timeBeforeStoryline = 4000;
  if (window.location.href.includes('challenge-4')) timeBeforeStoryline = 5800;

  // Wait for intro animation to complete before starting storyline
  setTimeout(() => {
    // After the intro animation, start the storyline
    startStoryline(storylineText, storyTitles);
  }, timeBeforeStoryline); // 4000ms = 4 seconds, matching the duration of your logo reveal animation
}

export function startStoryline(storylineText, storyTitles) {
  const introContainer = document.getElementById('intro-container');
  const storyContainer = document.getElementById('story-container');
  const storyText = document.getElementById('story-text');
  const continueBtn = document.getElementById('continue-btn');

  introContainer.style.display = 'none';
  storyContainer.style.display = 'flex';
  document.getElementById('story-title').textContent = storyTitles[0];

  let storyStep = 0;
  let charIndex = 0;
  let currentParagraph = document.createElement('p');
  storyText.innerHTML = '';
  storyText.appendChild(currentParagraph);

  let typingInterval;

  // Function to start typing the current storyline step
  function typeStoryline() {
    typingInterval = setInterval(() => {
      if (charIndex < storylineText[storyStep].length) {
        currentParagraph.textContent += storylineText[storyStep][charIndex];
        charIndex++;
      } else {
        // Text complete, show continue button
        clearInterval(typingInterval);
        continueBtn.style.display = 'block';
      }
    }, 50);
  }

  // Function to skip typing and show the full text instantly
  function skipTyping() {
    clearInterval(typingInterval); // Stop the typing animation
    currentParagraph.textContent = storylineText[storyStep]; // Show the full text
    continueBtn.style.display = 'block'; // Show the continue button
  }

  // Start typing the first storyline step
  typeStoryline();

  // Add event listener to skip typing when the spacebar is pressed
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      event.preventDefault(); // Prevent default spacebar behavior (e.g., scrolling)
      skipTyping();
    }
  });

  continueBtn.addEventListener('click', () => {
    storyStep++;

    if (storyStep < storylineText.length) {
      // Move to the next story step
      document.getElementById('story-title').textContent = storyTitles[storyStep];
      storyText.innerHTML = '';
      currentParagraph = document.createElement('p');
      storyText.appendChild(currentParagraph);
      charIndex = 0;
      continueBtn.style.display = 'none';

      typeStoryline(); // Start typing the next storyline step
    } else {
      // Move to instructions
      storyContainer.style.display = 'none';
      instructionsPopup.style.display = 'block';
    }
  });
}