const pinkSoldierMessages = {
    firstChallengeIntro: "Player, you thought discovering the secret was the challenge? (laughs) \n Oh, you’re just getting started! \n Relax, this next game won’t be too hard...(giggle) but let’s find out, shall we? \n To proceed just click on the circle icon near the music controls...",
    secondChallengeIntro: "Oh no! There's a bomb right beside me, and it’s about to explode! 💣💥 What should I do?! Do I run? Do I hide? Or… do YOU have a plan? 🤔 Maybe there’s a way to stop it—or maybe… you just want to see if detonating this thing unlocks something far more dangerous… or exciting?! 🚀 I hope you make the right choice… for all of us! 😨",
    secondChallengeOutro: "💥 KABOOM! 💥 \nWell… that escalated quickly. 😳 But hey, every explosion has its silver lining, right? \nAmidst the smoke and rubble, a new path emerges. Was it luck? Was it fate? Or was it all part of a twisted game? 😏 \nA secret challenge has been unlocked. Dare to take the next step… or was blowing things up the only trick you had? \n🔓 Proceed… if you dare.",
    thirdChallengeIntro: "Alright, alright… the dust is settling. 😏 \nI’m cooking up something new, and trust me, it’s gonna be a wild ride! 🔥 Ready to face the next challenge? 🧩 \n 🔓 Stay tuned, it's coming soon... if you dare!"
};

export function getPinkSoldierMessage(key) {
    return pinkSoldierMessages[key] || "Message not found. 😕";
}