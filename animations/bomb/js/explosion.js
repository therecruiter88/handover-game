import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';
import { getPhase3PlayerTiles } from '/js/obfuscator-audio-2.js'
//import { getTextMesh } from "./js/getTextMesh.js";

const w = window.outerWidth;
const h = window.outerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  canvas
});
renderer.setSize(w, h);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
controls.enableZoom = false;

let isExploding = false;
let hasExploded = false; // Add a flag to track if the sound has already been played
let wall;
const wallChunksGroup = new THREE.Group();
wallChunksGroup.visible = false;
scene.add(wallChunksGroup);
wallChunksGroup.userData.update = () => {
  const explosiveForce = 0.0005;
  wallChunksGroup.visible = true;
  wall.visible = false;
  wallChunksGroup.children.forEach((chunk) => {
    if (chunk.position.z < 8) {
      chunk.position.add(chunk.userData.velocity);
      chunk.userData.velocity.z += explosiveForce;
      chunk.rotation.x += chunk.userData.rotationRate.x;
      chunk.rotation.y += chunk.userData.rotationRate.y;
      chunk.rotation.z += chunk.userData.rotationRate.z;
    }
  });
}
const wallMat = new THREE.MeshStandardMaterial({
  color: 0xff66b2,  
  transparent: true,
  opacity: 0,
  roughness: 0.1,  
  metalness: 0.6,  
  transmission: 0.9, // Adds glass-like effect
  clearcoat: 1.0,   // Adds shine
  clearcoatRoughness: 0.2
});
const loader = new GLTFLoader();
//const wallPath = "./assets/wallFractured.glb";
const wallPath = "./animations/bomb/assets/wallFractured.glb";
loader.load( `${wallPath}`, (gltf) => {
    wallChunksGroup.add(...gltf.scene.children);
    wallChunksGroup.children.forEach((chunk) => {
      chunk.material = wallMat;
      chunk.userData = {
        rotationRate: new THREE.Vector3(
          Math.random() * 0.04 - 0.02,
          Math.random() * 0.04 - 0.02,
          Math.random() * 0.04 - 0.02
        ),
        velocity: new THREE.Vector3(
          Math.random() * 0.02 - 0.01,
          Math.random() * 0.02 - 0.01,
          Math.random() * 0.02 - 0.01
        ),
      };
    });
    wall = wallChunksGroup.children.find((chunk) => chunk.name === 'wall');
    wallChunksGroup.remove(wall);
    scene.add(wall);
});

const sunLight = new THREE.DirectionalLight(0xffffff, 3);
sunLight.position.set(2, 0, 5);
scene.add(sunLight);

const fillLight = new THREE.DirectionalLight(0x99aaff, 1);
fillLight.position.set(-2, 0, -5);
scene.add(fillLight);

//const textMesh = await getTextMesh({ text: 'CLICK TO ENTER'});
//textMesh.position.set(0, 0, 1);
//scene.add(textMesh);

// Audio setup
const audioListener = new THREE.AudioListener();
camera.add(audioListener);
const glassShatterSound = new THREE.Audio(audioListener);
const audioLoader = new THREE.AudioLoader();
//const audioPath = "./assets/audio/glass-shatter.mp3";
const audioPath = "./animations/bomb/assets/audio/glass-shatter.mp3";

audioLoader.load(`${audioPath}`, (buffer) => {
  glassShatterSound.setBuffer(buffer);
  glassShatterSound.setLoop(false);
  glassShatterSound.setVolume(0.5); // Adjust volume if needed
});

function animate() {
  requestAnimationFrame(animate);
  if (isExploding === true) {
    //textMesh.visible = false;
    wallMat.opacity = 1; // Instantly make wall visible
    wallChunksGroup.userData.update();
    if (!hasExploded) {
      glassShatterSound.play();
      hasExploded = true; // Set the flag to true after playing the sound
    }
  }
  renderer.render(scene, camera);
  controls.update();
}
animate();

// Show background after explosion
//const content = document.getElementById('container');
//content.classList.add('rendered');

// Start the explosion only after clicking the CLICK TO ENTER text
//document.addEventListener('pointerdown', () => {
//  isExploding = true;
//});
function handleWindowResize() {
  camera.aspect = window.outerWidth / window.outerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.outerWidth, window.outerHeight);
}

window.addEventListener('resize', handleWindowResize, false);

// Start the explosion after 10 seconds without integration
//setTimeout(() => {
//  isExploding = true;
//}, 10000);

// Listen for the custom event
document.addEventListener('bombExploded', () => {
  isExploding = true;
  const playersTile = document.getElementById("img");

  // Force play new music
  const audio = document.getElementById("background-music");
  if (audio) audio.src = "./assets/audio/sg_theme_song_2.mp3";

  const music = document.getElementById("background-music");
  const volumeIcon = document.getElementById('volumeIcon');
  if (music) music.muted = false;
  if (volumeIcon) volumeIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';

  //const messageElement = document.getElementById('message');
  const message = "💥 KABOOM! 💥 \nWell… that escalated quickly. 😳 But hey, every explosion has its silver lining, right? \nAmidst the smoke and rubble, a new path emerges. Was it luck? Was it fate? Or was it all part of a twisted game? 😏 \nA secret challenge has been unlocked. Dare to take the next step… or was blowing things up the only trick you had? \n🔓 Proceed… if you dare.";

  // Replace \n with <br> for line breaks
  messageElement.innerHTML = message.replace(/\n/g, '<br>');

  // Unblock new challenge
  const challengeTwoItem = document.getElementById('challenge-2');
  const challengeThreeItem = document.getElementById('challenge-3');
  const challengeFourItem = document.getElementById('challenge-4');
  if (challengeTwoItem) challengeTwoItem.classList.remove('hidden');
  if (challengeThreeItem) challengeThreeItem.classList.remove('hidden');
  if (challengeFourItem) challengeFourItem.classList.remove('hidden');

  const ashesContainer = document.getElementById('canvascontainer');
  if (ashesContainer) {
    ashesContainer.style.display = '';
  }

  // Load new image
  getPhase3PlayerTiles();
});