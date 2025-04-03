import { showPlayerNumberInput } from '/challenges/common/js/player-input.js';

window.addEventListener("load", showMobileMessage);

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Mobile|Opera Mini/i.test(navigator.userAgent);
}
  
function showMobileMessage() {
    const contentElement = document.getElementById("content");
    const tokenInput = document.getElementById("token-input");

    if (isMobileDevice()) {
        console.log("Detected mobile device.")
        const mobileMessageContainer = document.createElement("div");
        fetch("/common/html/mobile-message.html")
            .then(response => response.text())
            .then(data => {
                mobileMessageContainer.innerHTML = data;
                document.body.prepend(mobileMessageContainer);
            })
            .catch(error => console.error("Error loading mobile message:", error));
        if (contentElement) contentElement.classList.add('hidden');
    } else {
        var path = window.location.pathname;
        if (path === "/handovergame" || path === "/index.html") {
            showPlayerNumberInput();
        }
        if (contentElement) contentElement.classList.remove('hidden');
        if (tokenInput) tokenInput.focus();
    }
}