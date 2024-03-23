function playVideo(youtubeLink) {
    var videoModal = document.getElementById("videoModal");
    var youtubeVideo = document.getElementById("youtubeVideo");

    // Extracting the video ID from the YouTube link
    var videoId = youtubeLink.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^&\s]+)/)[1];

    youtubeVideo.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1";
    console.log("Embed URL: " + youtubeVideo.src);
    videoModal.style.display = "block";
}

function closeVideoModal() {
    var videoModal = document.getElementById("videoModal");
    var youtubeVideo = document.getElementById("youtubeVideo");

    videoModal.style.display = "none";
    youtubeVideo.src = ""; // Stop the video when modal is closed
}
