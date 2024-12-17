let player;
const playlistItems = document.querySelectorAll('.playlist li');
const lazyLoadButton = document.getElementById('lazyLoad');
const videoContainer = document.getElementById('youtubePlayer');
let currentIndex = 0;

// Lazy Load: Initialize Player
function initializePlayer(index) {
    lazyLoadButton.style.display = 'none';
    videoContainer.style.display = 'block';

    player = new YT.Player('youtubePlayer', {
        height: '100%',
        width: '100%',
        videoId: playlistItems[index].getAttribute('data-video-id'),
        playerVars: { autoplay: 1, controls: 1 },
        events: {
            'onReady': () => loadVideo(index),
            'onStateChange': onPlayerStateChange
        }
    });
}

// Load video and handle active state
function loadVideo(index) {
    if (player) {
        const videoId = playlistItems[index].getAttribute('data-video-id');
        const startTime = playlistItems[index].getAttribute('data-start') || 0;
        player.loadVideoById({ videoId: videoId, startSeconds: parseInt(startTime) });
    }

    // Update active class
    playlistItems.forEach(item => item.classList.remove('active'));
    playlistItems[index].classList.add('active');

    currentIndex = index;
}

// Play next video when current video ends
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        currentIndex = (currentIndex + 1) % playlistItems.length;
        loadVideo(currentIndex);
    }
}

// Playlist click handler
playlistItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        if (!player) {
            initializePlayer(index); // Initialize player if lazy load is still active
        } else {
            loadVideo(index); // Directly load video if player is active
        }
    });
});

// Lazy Load Initialization
lazyLoadButton.addEventListener('click', () => initializePlayer(currentIndex));