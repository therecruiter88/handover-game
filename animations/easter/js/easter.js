const canvas = document.getElementById("eggCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const eggs = [];
const eggImage = new Image();
eggImage.src = "./animations/easter/assets/img/egg.png";
let eggIdCounter = 0;

class Egg {
	constructor() {
	this.id = eggIdCounter++;
	this.x = Math.random() * canvas.width;
	this.y = -50;
	this.size = Math.random() * 30 + 30;
	//this.speed = Math.random() * 2 + 1;
	this.speed = Math.random() * 0.5 + 0.5; // Gives a speed between 0.5 and 1.0
	this.angle = Math.random() * Math.PI * 2;
}

	update() {
		this.y += this.speed; this.angle += 0.02;
	}

	draw() {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(Math.sin(this.angle) * 0.2);
		ctx.drawImage(eggImage, -this.size / 2, -this.size / 2, this.size, this.size);
		ctx.restore();
	}

	isClicked(mouseX, mouseY) {
		const dx = this.x - mouseX;
		const dy = this.y - mouseY;
		return Math.sqrt(dx * dx + dy * dy) < this.size / 2;
	}
}

function addEgg() {
	eggs.push(new Egg());
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	eggs.forEach((egg, index) => {
		egg.update();
		egg.draw();
		// Remove if some time has passed
		if (egg.y > canvas.height) {
			eggs.splice(index, 1);
		}
	});
	requestAnimationFrame(animate);
}

eggImage.onload = function () {
	setInterval(addEgg, 500);
	animate();
};