// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function initializeTheme() {
    if (prefersDarkScheme.matches) {
        document.body.setAttribute('data-theme', 'dark');
    } else {
        document.body.setAttribute('data-theme', 'light');
    }
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    playSound('switch');
});

// Sound Effects
const sounds = {
    hover: new Howl({
        src: ['https://assets.codepen.io/217233/pop.mp3'],
        volume: 0.1
    }),
    switch: new Howl({
        src: ['https://assets.codepen.io/217233/switch.mp3'],
        volume: 0.1
    })
};

function playSound(soundName) {
    sounds[soundName].play();
}

// Progress Indicator
const progressDots = document.querySelectorAll('.progress-dot');
const sections = document.querySelectorAll('.week-section');

function updateProgress() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop - windowHeight / 2 &&
            scrollPosition < sectionTop + sectionHeight - windowHeight / 2) {
            progressDots.forEach(dot => dot.classList.remove('active'));
            progressDots[index].classList.add('active');
        }
    });
}

// Smooth scroll to section when clicking progress dots
progressDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        sections[index].scrollIntoView({ behavior: 'smooth' });
        playSound('hover');
    });
});

// Enhanced Digital Clock
function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const clockElement = document.getElementById('digital-clock');
    
    if (clockElement.textContent !== time) {
        clockElement.style.opacity = '0';
        setTimeout(() => {
            clockElement.textContent = time;
            clockElement.style.opacity = '1';
        }, 200);
    }
}

// Initialize clock with transition
document.getElementById('digital-clock').style.transition = 'opacity 0.2s ease';
setInterval(updateClock, 1000);
updateClock();

// GSAP Animations
sections.forEach((section, i) => {
    // Heading animation
    gsap.from(section.querySelector('h2'), {
        scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power2.out'
    });

    // Description animation
    gsap.from(section.querySelector('.section-description'), {
        scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.3,
        ease: 'power2.out'
    });

    // Background parallax
    gsap.to(section, {
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        },
        backgroundPosition: `50% ${-50 * (i + 1)}%`,
        ease: 'none'
    });
});

// Add hover sound effect to interactive elements
document.querySelectorAll('.speech-bubble, .theme-toggle, .progress-dot').forEach(element => {
    element.addEventListener('mouseenter', () => playSound('hover'));
});

// 3D Tilt Effect for Speech Bubbles
document.querySelectorAll('.speech-bubble').forEach(bubble => {
    bubble.addEventListener('mousemove', (e) => {
        const rect = bubble.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 20;
        const angleY = (centerX - x) / 20;
        
        bubble.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    bubble.addEventListener('mouseleave', () => {
        bubble.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// Initialize theme and add scroll listener
window.addEventListener('scroll', updateProgress);
window.addEventListener('resize', updateProgress);
initializeTheme();
updateProgress();

// Create floating bubbles for each section
function createBubbles(container) {
    const bubbleCount = 15;
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.width = Math.random() * 100 + 50 + 'px';
        bubble.style.height = bubble.style.width;
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.top = Math.random() * 100 + '%';
        bubble.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(bubble);
    }
}

// Initialize bubbles for each section
document.querySelectorAll('.bubble-container').forEach(createBubbles);

// Parallax effect
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    document.querySelectorAll('.parallax').forEach(element => {
        const speed = element.dataset.speed || 20;
        const x = (window.innerWidth - mouseX * speed) / 100;
        const y = (window.innerHeight - mouseY * speed) / 100;
        element.style.setProperty('--parallax-offset', `${y}px`);
    });
});

// Smooth scroll initialization
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add intersection observer for section visibility
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.3
});

document.querySelectorAll('.week-section').forEach(section => {
    observer.observe(section);
}); 