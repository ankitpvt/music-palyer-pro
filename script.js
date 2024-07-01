// Initialize WaveSurfer
var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'yellow',
    progressColor: 'white',
    cursorColor: 'black',
    barWidth: 4,
    responsive: true,
    height: 90,
    barRadius: 4
});

// Song list
const songs = [
    { title: "Phir Bhi Tumko Chahunga", file: "song1.mp3", thumbnail: "img/Untitled design.jpg" },
    { title: "Sajda", file: "sajda.mp3", thumbnail: "img/sajda.jpeg" },
    { title: "Chashani", file: "Chashni.mp3", thumbnail: "img/chasni.jpeg" },
    {title: "Ishaqzaade", file: "Ishaqzaade.mp3", thumbnail: "img/ishqzade.jpeg"},
    {title: "Ve kamleya", file: "Ve Kamleya.mp3", thumbnail: "img/ve kamleye.jpeg"}
];

let currentSongIndex = 0;

// Load the first song
loadSong(currentSongIndex);

let progress = document.getElementById('progress');
let ctrlIcon = document.getElementById('ctrlIcon');
let isSeeking = false;

wavesurfer.on('ready', function () {
    progress.max = wavesurfer.getDuration();
    var durationSpan = document.getElementById('duration');
    durationSpan.innerHTML = formatTime(wavesurfer.getDuration());
});

function formatTime(time) {
    var minutes = Math.floor(time / 60);
    var seconds = Math.round(time % 60);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

function playPause() {
    if (ctrlIcon.classList.contains("fa-pause")) {
        wavesurfer.pause();
        ctrlIcon.classList.remove("fa-pause");
        ctrlIcon.classList.add("fa-play");
    } else {
        wavesurfer.play();
        ctrlIcon.classList.add("fa-pause");
        ctrlIcon.classList.remove("fa-play");
    }
}

progress.style.background = 'yellow';

wavesurfer.on('audioprocess', function () {
    if (!isSeeking) {
        progress.value = wavesurfer.getCurrentTime();
    }
    progress.style.background = 'linear-gradient(to right, black, black ' + (progress.value / progress.max) * 100 + '%, yellow ' + (progress.value / progress.max) * 100 + '%, yellow)';
});

progress.onmousedown = function () {
    isSeeking = true;
};

progress.onmouseup = function () {
    isSeeking = false;
    wavesurfer.seekTo(progress.value / wavesurfer.getDuration());
};

progress.onchange = function () {
    if (isSeeking) {
        wavesurfer.pause();
        wavesurfer.seekTo(progress.value / wavesurfer.getDuration());
    }
};

function restartSong() {
    wavesurfer.stop();
    wavesurfer.play();
    progress.value = 0;
    ctrlIcon.classList.add("fa-pause");
    ctrlIcon.classList.remove("fa-play");
}

wavesurfer.on('finish', function () {
    nextSong();
});

function loadSong(index) {
    currentSongIndex = index;
    const song = songs[index];
    wavesurfer.load(song.file);
    document.getElementById('song-title').textContent = "Song: " + song.title;
    document.getElementById('song-thumbnail').src = song.thumbnail;
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
}
