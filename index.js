

const audio = new Audio();
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progressContainer = document.querySelector(".progress-container");
const progress = document.querySelector(".progress");
const currentTimeEl = document.querySelector(".current-time");
const durationEl = document.querySelector(".duration");
const volumeSlider = document.querySelector(".volume-slider");
const fileInput = document.getElementById("file-input");
const playlistEl = document.querySelector(".playlist");
const songTitle = document.querySelector(".song-title");

let songs = [];
let currentIndex = -1;

volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
});

playBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = "⏸";
    } else {
        audio.pause();
        playBtn.textContent = "▶";
    }
});

prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        loadSong(currentIndex - 1);
    }
});

nextBtn.addEventListener("click", () => {
    if (currentIndex < songs.length - 1) {
        loadSong(currentIndex + 1);
    }
});

fileInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        const url = URL.createObjectURL(file);
        songs.push({ name: file.name, url });
        renderPlaylist();
    });
});

function renderPlaylist() {
    playlistEl.innerHTML = "";
    songs.forEach((song, index) => {
        const div = document.createElement("div");
        div.classList.add("playlist-item");
        if (index === currentIndex) div.classList.add("active");
        div.textContent = song.name;
        div.addEventListener("click", () => loadSong(index));
        playlistEl.appendChild(div);
    });
}

function loadSong(index) {
    currentIndex = index;
    audio.src = songs[index].url;
    songTitle.textContent = songs[index].name;
    audio.play();
    playBtn.textContent = "⏸";
    renderPlaylist();
}

audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${progressPercent}%`;

        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    }
});

progressContainer.addEventListener("click", (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
});

audio.addEventListener("ended", () => {
    if (currentIndex < songs.length - 1) {
        loadSong(currentIndex + 1);
    }
});

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
        .toString()
        .padStart(2, "0");
    return `${minutes}:${seconds}`;
}
