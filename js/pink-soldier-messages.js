const pinkSoldierMessages = {
    firstChallengeIntro: "Player, you thought discovering the secret was the challenge? (laughs) \n Oh, you’re just getting started! \n Relax, this next game won’t be too hard...(giggle) but let’s find out, shall we? \n To proceed just click on the circle icon near the music controls...",
    secondChallengeIntro: "Oh no! There's a bomb right beside me, and it’s about to explode! 💣💥 What should I do?! Do I run? Do I hide? Or… do YOU have a plan? 🤔 Maybe there’s a way to stop it—or maybe… you just want to see if detonating this thing unlocks something far more dangerous… or exciting?! 🚀 I hope you make the right choice… for all of us! 😨",
    secondChallengeOutro: "💥 KABOOM! 💥 \nWell… that escalated quickly. 😳 But hey, every explosion has its silver lining, right? \nAmidst the smoke and rubble, a new path emerges. Was it luck? Was it fate? Or was it all part of a twisted game? 😏 \nA secret challenge has been unlocked. Dare to take the next step… or was blowing things up the only trick you had? \n🔓 Proceed… if you dare.",
    //thirdChallengeIntro: "Alright, alright… the dust is settling. 😏 \nI’m cooking up something new, and trust me, it’s gonna be a wild ride! 🔥 Ready to face the next challenge? 🧩 \n 🔓 Stay tuned, it's coming soon... if you dare!"
    thirdChallengeIntro: "Alright, alright… the dust is still swirling like a dramatic movie scene, but it's almost settling… 😏💨 \n Meanwhile, get ready! Another adventure awaits you... ⚔️✨ Brace yourselves, warriors! This game ain’t over yet, it's just getting spicy! 🌶️🔥 \n Think you’ve got what it takes for the next challenge? Let’s see if you can handle the heat! 🕹️😈",
    thirdChallengeOutro: "Now that the dust is set and the air seems more fresh...and you STILL didn't find out who is the person behind the mask, are you up for more two challenges? \n I know you are! \n I'm cooking up something new and maybe some enigmas to solve... \n 🔓 Stay tuned, it's coming soon... if you dare!",
    enigmasIntro: "Guess who’s back for more? ⚡️ \n I was starting to think you forgot about the challenges. 👀 But fear not, the adventure isn't over yet! 🌟 \n Guess what? A mysterious vault awaits you with some secrets inside! 🔐 C'mon, hurry up... that vault isn’t going to open itself! 🔑 \n Give it a try, if you're brave enough! I’ll even give you 5 hints to help you solve the enigma. 🧩",
    fourthChallengeIntro: "Well done Inspector Gadget!!! 🕵 \n I wonder what this key might open...🔑🔓 \n Will there be any more challenges ahead? 🎮 What pill should you take? 💊🔵🔴 \n  the answers you need?",
    fifthChallengeIntro: "Wow… you really made it this far? 😮 I’m impressed… and maybe just a little scared of you now. 😅 \n From clicks to kabooms, riddles to revelations—you've danced through chaos like a true champion. 🩰💥 \n But every game must come to an end... or does it? 😏 \n This is your final challenge—your last dance in the arena. 💃🕺 \n What lies beyond? Victory? Freedom? Or just... another mask? 🎭 Only one way to find out. \n Step forward, player. It’s time to finish what you started. 🏁🔓 \n And hey... thanks for playing. But don’t get too comfortable—games have a funny way of restarting when you least expect it. 😉🎮",
};

const pinkSoldierEnigmaHints = {
    hint1: "There is more than one path to follow. The right order will unlock the code...",
    hint2: "Look for the numbers hidden in plain sight...",
    hint3: "Listen to the clock carefully, it speaks in secret patterns...",
    hint4: "Some things are hidden behind color. Pay attention to the order...",
    hint5: "The color of the circle is a part of your path..."
};

// Function to randomly select a hint
function getRandomHint() {
    const hintsArray = Object.values(pinkSoldierEnigmaHints);
    const randomIndex = Math.floor(Math.random() * hintsArray.length);
    return hintsArray[randomIndex];
}

// Example: Display a random hint at a set interval
export function displayRandomHint() {
    const randomHint = getRandomHint();
    const messageElement = document.getElementById('message');
    messageElement.innerHTML = randomHint.replace(/\n/g, '<br>'); // Replace \n with <br> for line breaks
    const sound = new Audio('/animations/pink-soldier/assets/audio/new-hint.mp3');
    sound.play();
}

export function getPinkSoldierMessage(key) {
    return pinkSoldierMessages[key] || "Waiting for orders... the soldier is currently idle. 🕒";
}

export function getPinkSoldierHint() {
    return pinkSoldierEnigmaHints[key] || "No more hints to you... the soldier is currently idle. 🕒";
}