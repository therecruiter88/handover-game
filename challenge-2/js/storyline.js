// Sound elements
const storylineSound = document.getElementById('storyline-sound');
const storyContainer = document.getElementById('story-container');
const storyText = document.getElementById('story-text');
const continueBtn = document.getElementById('continue-btn');

const storyTitles = ["Storyline", "Challenge"];

// Story text
const storylineText = [
  "The handover was going fine for Player 136...until VIC went rogue, rejecting every processing without reason, RabbitMQ clogged, messages stuck in a purgatory of retries, and the Pipeline Guardian activated its failsafe: the Compliance Sentinel! Armed with precision lasers, it is ready to decommision any player out of sync!",
  "Advance through the pipeline when processing is allowed to distribute the hotfix correctly and end this madness. Stop when a validation check is in progress. Any unauthorized movement will trigger an immediate rollback...and termination. Reach the end before the time runs out, or be stuck in the handover phase forever! Will you do it in 45 seconds?!"
];

function startStoryline() {
  introContainer.style.display = 'none';
  storyContainer.style.display = 'flex';
  document.getElementById('story-title').textContent = storyTitles[0];
  
  // Stop intro sound and start typing sound at a low volume
  //introSound.pause();
  //storylineSound.volume = 0.5;
  //storylineSound.play();
  //storylineSound.loop = true;
  
  // Type out the storyline text
  let storyStep = 0;
  let charIndex = 0;
  let currentParagraph = document.createElement('p');
  storyText.innerHTML = ''; // Clear any existing content
  storyText.appendChild(currentParagraph);
  
  const typingInterval = setInterval(() => {
    if (charIndex < storylineText[storyStep].length) {
      currentParagraph.textContent += storylineText[storyStep][charIndex];
      charIndex++;
    } else {
      // Text complete, show continue button
      clearInterval(typingInterval);
      continueBtn.style.display = 'block';
    }
  }, 50);
  
  continueBtn.addEventListener('click', () => {
    storyStep++;
    
    if (storyStep < storylineText.length) {
      // Move to next story step
      document.getElementById('story-title').textContent = storyTitles[storyStep];
      storyText.innerHTML = '';
      currentParagraph = document.createElement('p');
      storyText.appendChild(currentParagraph);
      charIndex = 0;
      continueBtn.style.display = 'none';
      
      const nextTypingInterval = setInterval(() => {
        if (charIndex < storylineText[storyStep].length) {
          currentParagraph.textContent += storylineText[storyStep][charIndex];
          charIndex++;
        } else {
          // Text complete, show continue button
          clearInterval(nextTypingInterval);
          continueBtn.style.display = 'block';
        }
      }, 50);
    } else {
      // Move to instructions
      storyContainer.style.display = 'none';
      instructionsPopup.style.display = 'block';
    }
  });

}