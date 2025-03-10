// Sound elements
const storylineSound = document.getElementById('storyline-sound');
const storyContainer = document.getElementById('story-container');
const storyText = document.getElementById('story-text');
const continueBtn = document.getElementById('continue-btn');

const storyTitles = ["Storyline", "Challenge"];

// Story text
const storylineText = [
    "Tomorrow was meant to be a simple farewell pizza party for Player 297. But something went horribly wrong. Dark forces have unleashed an unstoppable plague of pineapple pizzas, threatening to take over the planet and ruining the party...",
    "What was once a celebration has become a mission, a battle for survival. To save Player 297 farewell and stop the invasion, you must destroy every mutant pizza before it's too late!\nYou have 30 seconds to do it and 3 lifes to attempt the challenge..."
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