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
                document.body.prepend(mobileMessageContainer); // Add as the first last of <body>
            })
            .catch(error => console.error("Error loading mobile message:", error));
        if (contentElement) contentElement.classList.add('hidden');
    } else {
        if (contentElement) contentElement.classList.remove('hidden');
        if (tokenInput) tokenInput.focus();
    }
}