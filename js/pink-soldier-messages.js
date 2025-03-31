const pinkSoldierMessages = {
    firstChallengeIntro: "Player, you thought discovering the secret was the challenge? (laughs) \n Oh, you’re just getting started! \n Relax, this next game won’t be too hard...(giggle) but let’s find out, shall we? \n To proceed just click on the circle icon near the music controls...",
    secondChallengeIntro: "Oh no! There's a bomb right beside me, and it’s about to explode! 💣💥 What should I do?! Do I run? Do I hide? Or… do YOU have a plan? 🤔 Maybe there’s a way to stop it—or maybe… you just want to see if detonating this thing unlocks something far more dangerous… or exciting?! 🚀 I hope you make the right choice… for all of us! 😨",
    secondChallengeOutro: "💥 KABOOM! 💥 \nWell… that escalated quickly. 😳 But hey, every explosion has its silver lining, right? \nAmidst the smoke and rubble, a new path emerges. Was it luck? Was it fate? Or was it all part of a twisted game? 😏 \nA secret challenge has been unlocked. Dare to take the next step… or was blowing things up the only trick you had? \n🔓 Proceed… if you dare.",
    //thirdChallengeIntro: "Alright, alright… the dust is settling. 😏 \nI’m cooking up something new, and trust me, it’s gonna be a wild ride! 🔥 Ready to face the next challenge? 🧩 \n 🔓 Stay tuned, it's coming soon... if you dare!"
    thirdChallengeIntro: "Alright, alright… the dust is still swirling like a dramatic movie scene, but it's almost settling… 😏💨 \n Meanwhile, get ready! Another adventure awaits you... ⚔️✨ Brace yourselves, warriors! This game ain’t over yet, it's just getting spicy! 🌶️🔥 \n Think you’ve got what it takes for the next challenge? Let’s see if you can handle the heat! 🕹️😈"
};

export function getPinkSoldierMessage(key) {
    return pinkSoldierMessages[key] || "Waiting for orders... the soldier is currently idle. 🕒";
}