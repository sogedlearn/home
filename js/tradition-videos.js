(function () {
    'use strict';

    function formatTime(seconds) {
        if (!isFinite(seconds) || seconds < 0) return '0:00';
        var mins = Math.floor(seconds / 60);
        var secs = Math.floor(seconds % 60);
        return mins + ':' + String(secs).padStart(2, '0');
    }

    function updateMuteIcon(btn, video) {
        var icon = btn.querySelector('i');
        if (!icon) return;
        if (video.muted || video.volume === 0) {
            icon.className = 'fas fa-volume-mute';
        } else if (video.volume < 0.5) {
            icon.className = 'fas fa-volume-down';
        } else {
            icon.className = 'fas fa-volume-up';
        }
    }

    function updatePlayIcon(btn, video) {
        var icon = btn.querySelector('i');
        if (!icon) return;
        icon.className = video.paused ? 'fas fa-play' : 'fas fa-pause';
    }

    function updateProgressUI(wrap, video, progressSlider, timeLabel) {
        if (!video.duration || !isFinite(video.duration)) {
            progressSlider.value = 0;
            progressSlider.style.setProperty('--progress', '0%');
            if (timeLabel) timeLabel.textContent = '0:00 / 0:00';
            return;
        }

        var ratio = video.currentTime / video.duration;
        var percent = Math.min(Math.max(ratio * 100, 0), 100);
        progressSlider.value = Math.round(ratio * 1000);
        progressSlider.style.setProperty('--progress', percent + '%');

        if (timeLabel) {
            timeLabel.textContent = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
        }
    }

    function initVideoWrap(wrap) {
        var video = wrap.querySelector('.trad-video');
        var playBtn = wrap.querySelector('.trad-play-btn');
        var muteBtn = wrap.querySelector('.trad-mute-btn');
        var volumeSlider = wrap.querySelector('.trad-volume-slider');
        var progressSlider = wrap.querySelector('.trad-progress-slider');
        var timeLabel = wrap.querySelector('.trad-time-label');
        var fullscreenBtn = wrap.querySelector('.trad-fullscreen-btn');
        var isSeeking = false;

        if (!video || !playBtn || !muteBtn || !volumeSlider || !progressSlider) return;

        video.volume = 0.8;
        video.muted = false;
        updateProgressUI(wrap, video, progressSlider, timeLabel);

        playBtn.addEventListener('click', function () {
            if (video.paused) {
                document.querySelectorAll('.trad-video').forEach(function (other) {
                    if (other !== video && !other.paused) {
                        other.pause();
                        var otherWrap = other.closest('.trad-video-wrap');
                        if (otherWrap) {
                            var otherPlay = otherWrap.querySelector('.trad-play-btn');
                            if (otherPlay) updatePlayIcon(otherPlay, other);
                        }
                    }
                });
                video.play();
            } else {
                video.pause();
            }
            updatePlayIcon(playBtn, video);
        });

        muteBtn.addEventListener('click', function () {
            video.muted = !video.muted;
            if (!video.muted && video.volume === 0) {
                video.volume = 0.8;
                volumeSlider.value = 80;
            }
            updateMuteIcon(muteBtn, video);
        });

        volumeSlider.addEventListener('input', function () {
            video.volume = volumeSlider.value / 100;
            video.muted = video.volume === 0;
            updateMuteIcon(muteBtn, video);
        });

        progressSlider.addEventListener('pointerdown', function () {
            isSeeking = true;
        });

        progressSlider.addEventListener('input', function () {
            if (!video.duration || !isFinite(video.duration)) return;
            var ratio = progressSlider.value / 1000;
            var percent = Math.min(Math.max(ratio * 100, 0), 100);
            progressSlider.style.setProperty('--progress', percent + '%');
            video.currentTime = ratio * video.duration;
            if (timeLabel) {
                timeLabel.textContent = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
            }
        });

        progressSlider.addEventListener('pointerup', function () {
            isSeeking = false;
        });

        progressSlider.addEventListener('change', function () {
            isSeeking = false;
            if (!video.duration || !isFinite(video.duration)) return;
            video.currentTime = (progressSlider.value / 1000) * video.duration;
            updateProgressUI(wrap, video, progressSlider, timeLabel);
        });

        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', function () {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                    return;
                }

                if (wrap.requestFullscreen) {
                    wrap.requestFullscreen();
                } else if (video.webkitEnterFullscreen) {
                    video.webkitEnterFullscreen();
                }
            });
        }

        video.addEventListener('loadedmetadata', function () {
            updateProgressUI(wrap, video, progressSlider, timeLabel);
        });

        video.addEventListener('timeupdate', function () {
            if (isSeeking) return;
            updateProgressUI(wrap, video, progressSlider, timeLabel);
        });

        video.addEventListener('play', function () {
            updatePlayIcon(playBtn, video);
        });

        video.addEventListener('pause', function () {
            updatePlayIcon(playBtn, video);
        });

        video.addEventListener('ended', function () {
            updatePlayIcon(playBtn, video);
            updateProgressUI(wrap, video, progressSlider, timeLabel);
        });

        updatePlayIcon(playBtn, video);
        updateMuteIcon(muteBtn, video);
    }

    document.querySelectorAll('.trad-video-wrap').forEach(initVideoWrap);
})();
