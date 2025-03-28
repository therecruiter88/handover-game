document.addEventListener('DOMContentLoaded', () => {
    const fabButton = document.getElementById('fab-button');
    const challengeList = document.getElementById('challenge-list');
    const challengeItems = document.querySelectorAll('.challenge-item');
    let isListVisible = false;
    
    fabButton.addEventListener('click', (event) => {
        //event.stopPropagation(); // Prevent closing the list when clicking the FAB button
        isListVisible = !isListVisible;
        
        // Toggle the challenge list visibility
        if (isListVisible) {
            challengeList.classList.add('show'); // Show the list with animation
        } else {
            challengeList.classList.remove('show'); // Hide the list
        }
    });

    // Close the challenge list if clicking outside
    document.addEventListener('click', (event) => {
        const target = event.target;
        const isInsideFab = fabButton.contains(target);
        const isInsideList = challengeList.contains(target);
    
        if (!isInsideFab && !isInsideList && isListVisible) {
            isListVisible = false;
            challengeList.classList.remove('show'); // Hide the list when clicking outside
        }
    });

    challengeItems.forEach(item => {
        item.addEventListener('click', (event) => {
            isListVisible = false;
        });
    });
});