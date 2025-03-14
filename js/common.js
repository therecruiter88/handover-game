const music = document.getElementById("background-music");

window.onload = showMobileMessage;

document.addEventListener("contextmenu", (event) => event.preventDefault());

setInterval(() => {
    if (window.outerWidth - window.innerWidth > 200 || window.outerHeight - window.innerHeight > 200) {
        document.body.innerHTML = "DevTools access denied!";
    }
}, 1000);

document.addEventListener("keydown", (event) => {
    if (event.key === "F12" || 
        (event.ctrlKey && event.shiftKey && (event.key === "I" || event.key === "J")) || 
        (event.ctrlKey && event.key === "U")) {
        event.preventDefault();
    }
});

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Mobile|Opera Mini/i.test(navigator.userAgent);
}
  
function showMobileMessage() {
    const mobileMessageElement = document.getElementById("mobile-message");
    const tokenContainerElement = document.getElementById("token");
    const tokenInput = document.getElementById("token-input");
    
    if (isMobileDevice()) {
        if (mobileMessageElement) mobileMessageElement.className = "mobile-message";
        if (tokenContainerElement) tokenContainerElement.className = "hidden";
    } else {
        if (tokenContainerElement) tokenContainerElement.className = "token-container";
        if (mobileMessageElement) mobileMessageElement.className = "hidden";
        if (tokenInput) tokenInput.focus();
    }
}