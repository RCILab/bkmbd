window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        // This page carries no More Works dropdown, so both may be absent.
        if (dropdown) dropdown.classList.remove('show');
        if (button) button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Play every short result clip while it is on screen, and pause it once it scrolls away.
//
// The clips loop forever, so this is autoplay without the cost of it: an `autoplay`
// attribute makes the browser fetch each clip at page load, and the real-world and book
// clips alone are tens of megabytes. Here they stay at preload="metadata" until they are
// about to come into view, and only the clip you are looking at is decoding.
//
// A video carrying data-manual is deliberately left out: the narrated overview is watched
// on purpose, with its own sound and its own seeking, so forcing it to mute, loop and
// play/pause on scroll would fight the viewer and would also pull the whole file down
// the moment it scrolled past.
function setupVideoAutoplay() {
    const videos = document.querySelectorAll('main video:not([data-manual])');
    if (videos.length === 0) return;

    if (!('IntersectionObserver' in window)) {
        // No observer: fall back to playing everything and let the browser sort it out.
        videos.forEach(video => video.play().catch(() => {}));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                if (video.preload !== 'auto') video.preload = 'auto';
                // Autoplay is only allowed while muted, and a user may have unmuted this one.
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, {
        threshold: 0.25,      // a quarter of the video is enough to count as "watching"
        rootMargin: '200px'   // start fetching just before it reaches the viewport
    });

    videos.forEach(video => {
        video.loop = true;
        video.muted = true;   // required for autoplay to be permitted at all
        video.playsInline = true;
        observer.observe(video);
    });
}

// Keyboard control for the narrated overview player.
//
// Native controls only take arrow keys once the control bar itself has focus, so clicking
// the picture and pressing an arrow does nothing -- which reads as "the scrub bar will not
// move". Making the element focusable and handling the keys here gives the usual shortcuts
// wherever the player is focused. Seeking itself needs the moov atom at the front of the
// file (ffmpeg -movflags +faststart); without it the browser cannot seek until the whole
// file has arrived, and no amount of key handling helps.
function setupVideoKeyboard() {
    document.querySelectorAll('main video[data-manual]').forEach(video => {
        video.setAttribute('tabindex', '0');

        const seek = (delta) => {
            if (!isFinite(video.duration)) return;
            video.currentTime = Math.min(Math.max(video.currentTime + delta, 0), video.duration);
        };

        video.addEventListener('keydown', (event) => {
            if (event.altKey || event.ctrlKey || event.metaKey) return;
            let handled = true;

            switch (event.key) {
                case ' ':
                case 'k':      video.paused ? video.play().catch(() => {}) : video.pause(); break;
                case 'ArrowLeft':  seek(-5); break;
                case 'ArrowRight': seek(5); break;
                case 'j':      seek(-10); break;
                case 'l':      seek(10); break;
                case 'ArrowUp':    video.volume = Math.min(video.volume + 0.1, 1); break;
                case 'ArrowDown':  video.volume = Math.max(video.volume - 0.1, 0); break;
                case 'Home':   seek(-Infinity); break;
                case 'End':    if (isFinite(video.duration)) video.currentTime = video.duration; break;
                case 'm':      video.muted = !video.muted; break;
                case 'f':
                    if (document.fullscreenElement) document.exitFullscreen();
                    else if (video.requestFullscreen) video.requestFullscreen();
                    break;
                default:
                    // 0-9 jump to that tenth of the running time.
                    if (/^[0-9]$/.test(event.key) && isFinite(video.duration)) {
                        video.currentTime = video.duration * (Number(event.key) / 10);
                    } else {
                        handled = false;
                    }
            }

            // Only swallow the key once it has been used, so Tab and Escape still work.
            if (handled) event.preventDefault();
        });

        // Clicking the picture should focus the player, otherwise the keys above go to the
        // page and the arrows just scroll it.
        video.addEventListener('click', () => video.focus());
    });
}

// Start the videos on their own, not from inside the jQuery block below. That block depends
// on jQuery (a CDN script) and on bulmaCarousel, and if either is missing it throws before it
// reaches the videos -- which is exactly how autoplay silently stopped working.
// If the overview file cannot be fetched at all, say so and offer the download rather
// than leaving a dead player on the page. Same handling as the CAMP-MPPI page.
function setupVideoFallbackMessage() {
    const src = document.getElementById('overview-src');
    const msg = document.getElementById('overview-msg');
    if (src && msg) {
        src.addEventListener('error', () => { msg.hidden = false; });
    }
}

// On a sandboxed host, offer the video address instead of a tab that cannot load.
//
// The anonymous review mirror serves the page under
// `CSP: sandbox allow-scripts allow-popups allow-forms allow-modals`. Popups are granted, so
// the Video button does open a tab -- but that tab inherits the sandbox, lands on an opaque
// origin, and YouTube refuses to be loaded there (ERR_BLOCKED_BY_RESPONSE). Opening the
// window from script hits exactly the same wall, so there is no way to make a plain click
// reach the video from here.
//
// A ctrl-click does work, because the browser gives that tab a fresh context of its own. So
// on a sandboxed host only, intercept the click, put the address on the clipboard, and reveal
// it for copying. Everywhere else -- the real site included -- the anchor is left completely
// alone, which is why this checks the origin rather than the hostname.
function setupSandboxedVideoLink() {
    let sandboxed = false;
    try {
        sandboxed = (window.origin === 'null' || String(window.location.origin) === 'null');
    } catch (e) {
        sandboxed = true;   // Reading it threw, which only happens on an opaque origin.
    }
    if (!sandboxed) return;

    const note = document.getElementById('video-fallback');
    const field = document.getElementById('video-fallback-url');

    document.querySelectorAll('a[data-sandbox-copy]').forEach(link => {
        link.addEventListener('click', (event) => {
            // The modified clicks genuinely work here, so never take those over.
            if (event.button !== 0) return;
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

            event.preventDefault();
            if (!note) return;

            note.hidden = false;
            if (field) field.textContent = link.href;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(link.href).then(() => {
                    note.setAttribute('data-copied', 'yes');
                }).catch(() => {});
            }

            // Select the address so a manual copy is one keystroke.
            if (field && window.getSelection && document.createRange) {
                try {
                    const range = document.createRange();
                    range.selectNodeContents(field);
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } catch (e) { /* selection is a nicety, not a requirement */ }
            }
        });
    });
}

function setupVideos() {
    setupVideoAutoplay();
    setupVideoKeyboard();
    setupVideoFallbackMessage();
    setupSandboxedVideoLink();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupVideos);
} else {
    setupVideos();
}

// Carousel and slider are template leftovers: this page has no .carousel or .slider element.
// Keep them, but never let them take the rest of the script down with them.
if (typeof $ !== 'undefined') {
    $(document).ready(function() {
        var options = {
            slidesToScroll: 1,
            slidesToShow: 1,
            loop: true,
            infinite: true,
            autoplay: true,
            autoplaySpeed: 5000,
        };

        try {
            if (typeof bulmaCarousel !== 'undefined') bulmaCarousel.attach('.carousel', options);
            if (typeof bulmaSlider !== 'undefined') bulmaSlider.attach();
        } catch (e) {
            console.warn('carousel/slider init skipped:', e);
        }
    });
}
