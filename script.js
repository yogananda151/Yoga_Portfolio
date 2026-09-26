/* ============================================
   K YOGANANDA REDDY - PORTFOLIO JAVASCRIPT
   3D Animations, Vanta, Three.js, GSAP
   ============================================ */

// ==========================================
// 1. VANTA.JS NEURAL NETWORK BACKGROUND
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    if (window.VANTA && THREE) {
        try {
            VANTA.NET({
                el: '#vanta-bg',
                THREE: THREE,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x4d7fff,
                backgroundColor: 0x070b1a,
                points: 12.00,
                maxDistance: 25.00,
                spacing: 18.00,
                showDots: true
            });
        } catch(e) {
            console.log('Vanta fallback:', e);
        }
    }
});

// ==========================================
// 2. FLOATING PARTICLES CANVAS
// ==========================================
(function() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const PARTICLE_COUNT = 40;
    const particles = [];

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = Math.random() < 0.5 ? '139, 92, 246' : '96, 165, 250';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(96, 165, 250, ${(1 - dist/120) * 0.12})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
})();

// ==========================================
// 3. THREE.JS - HERO DNA/NEURAL ORB
// ==========================================
(function() {
    const canvas = document.getElementById('dna-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(300, 300);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 3.5;

    // Create a glowing sphere with wireframe
    const geometry = new THREE.IcosahedronGeometry(1.2, 2);
    const wireframe = new THREE.WireframeGeometry(geometry);
    const lineMat = new THREE.LineBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.6
    });
    const mesh = new THREE.LineSegments(wireframe, lineMat);
    scene.add(mesh);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(0.9, 32, 32);
    const innerMat = new THREE.MeshPhongMaterial({
        color: 0x1a0a3a,
        emissive: 0x3b1a7a,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7,
        wireframe: false
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerSphere);

    // Orbiting particles around the sphere
    const orbitParticles = [];
    const orbitGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const orbitColors = [0xb855f7, 0x60a5fa, 0x22d3ee, 0xec4899];

    for (let i = 0; i < 8; i++) {
        const mat = new THREE.MeshBasicMaterial({
            color: orbitColors[i % orbitColors.length]
        });
        const particle = new THREE.Mesh(orbitGeo, mat);
        const angle = (i / 8) * Math.PI * 2;
        const radius = 1.6;
        particle.userData = { angle, radius, speed: 0.3 + Math.random() * 0.4, yOffset: (Math.random() - 0.5) * 0.8 };
        orbitParticles.push(particle);
        scene.add(particle);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x4040ff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x8b5cf6, 2, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);
    const pointLight2 = new THREE.PointLight(0x60a5fa, 1.5, 10);
    pointLight2.position.set(-2, -1, 1);
    scene.add(pointLight2);

    let t = 0;
    function animate() {
        requestAnimationFrame(animate);
        t += 0.005;

        mesh.rotation.x = t * 0.5;
        mesh.rotation.y = t * 0.7;
        innerSphere.rotation.y = -t * 0.3;

        orbitParticles.forEach(p => {
            p.userData.angle += p.userData.speed * 0.016;
            p.position.x = Math.cos(p.userData.angle) * p.userData.radius;
            p.position.z = Math.sin(p.userData.angle) * p.userData.radius;
            p.position.y = p.userData.yOffset + Math.sin(t + p.userData.angle) * 0.3;
        });

        renderer.render(scene, camera);
    }
    animate();
})();

// ==========================================
// 4. THREE.JS - CONTACT 3D ROBOT/SPHERE
// ==========================================
(function() {
    const canvas = document.getElementById('robot-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const w = canvas.parentElement.offsetWidth || 400;
    const h = 180;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w/h, 0.1, 100);
    camera.position.z = 5;
    camera.position.y = 0.5;

    // Create a torus knot - looks futuristic
    const torusGeo = new THREE.TorusKnotGeometry(1, 0.35, 100, 16);
    const torusMat = new THREE.MeshPhongMaterial({
        color: 0x1a0a3a,
        emissive: 0x6b21a8,
        emissiveIntensity: 0.4,
        wireframe: false,
        transparent: true,
        opacity: 0.85,
        shininess: 100
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torus);

    // Wireframe overlay
    const wireGeo = new THREE.TorusKnotGeometry(1, 0.35, 60, 8);
    const wireMat = new THREE.LineBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.3 });
    const wireKnot = new THREE.LineSegments(new THREE.WireframeGeometry(wireGeo), wireMat);
    scene.add(wireKnot);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const pLight = new THREE.PointLight(0x8b5cf6, 3, 20);
    pLight.position.set(3, 3, 3);
    scene.add(pLight);
    const pLight2 = new THREE.PointLight(0xec4899, 2, 20);
    pLight2.position.set(-3, -2, 2);
    scene.add(pLight2);

    let t = 0;
    function animate() {
        requestAnimationFrame(animate);
        t += 0.008;
        torus.rotation.x = t * 0.5;
        torus.rotation.y = t * 0.7;
        wireKnot.rotation.x = t * 0.5;
        wireKnot.rotation.y = t * 0.7;
        renderer.render(scene, camera);
    }
    animate();
})();

// ==========================================
// 5. NAVIGATION
// ==========================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

// Scroll behavior
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    updateActiveNav();
    animateOnScroll();
    animateSkillBars();
});

// Mobile menu toggle
if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const spans = hamburger.querySelectorAll('span');
        if (mobileMenu.classList.contains('open')) {
            spans[0].style.transform = 'translateY(7px) rotate(45deg)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
        } else {
            spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        }
    });
}

// Close mobile menu on link click
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
});

// Active nav link
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ==========================================
// 6. SCROLL REVEAL ANIMATIONS
// ==========================================
function addRevealClasses() {
    const selectors = [
        '.section-header',
        '.about-grid',
        '.project-card',
        '.timeline-item',
        '.skill-category-card',
        '.coding-card',
        '.contact-form-col',
        '.connect-info',
        '.tech-pills-section'
    ];

    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.1}s`;
        });
    });
}

function animateOnScroll() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            el.classList.add('visible');
        }
    });
}

// ==========================================
// 7. SKILL BARS ANIMATION
// ==========================================
let barsAnimated = false;

function animateSkillBars() {
    if (barsAnimated) return;
    
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;
    
    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
        barsAnimated = true;
        document.querySelectorAll('.bar-fill').forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = targetWidth + '%';
            }, 200);
        });
    }
}

// ==========================================
// 8. COUNTER ANIMATION
// ==========================================
function animateCounters() {
    const counters = document.querySelectorAll('[data-target]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.textContent = target + '+';
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// ==========================================
// 9. TILT EFFECT ON PROJECT CARDS
// ==========================================
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ==========================================
// 10. CONTACT FORM
// ==========================================
function handleSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('form-success');
    
    btn.disabled = true;
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;animation:spin 1s linear infinite"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Sending...';
    
    setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> <span>Send Message</span>';
        
        if (successMsg) {
            successMsg.classList.remove('hidden');
            setTimeout(() => successMsg.classList.add('hidden'), 4000);
        }
        
        document.getElementById('contact-form').reset();
    }, 1500);
}

// ==========================================
// 11. CSS SPIN KEYFRAME (for button loading)
// ==========================================
const style = document.createElement('style');
style.textContent = `
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);

// ==========================================
// 12. SMOOTH TYPING EFFECT ON HERO
// ==========================================
(function() {
    const phrases = [
        'Generative AI Enthusiast',
        'LLM & RAG Developer',
        'Multi-Agent System Builder',
        'Python Developer',
        'CS & AI Engineering Student'
    ];
    
    const heroRole = document.querySelector('.hero-role');
    if (!heroRole) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            heroRole.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            heroRole.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(type, 2000);
            return;
        }
        
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }
        
        const speed = isDeleting ? 60 : 100;
        setTimeout(type, speed);
    }

    setTimeout(type, 1500);
})();

// ==========================================
// 13. CURSOR GLOW EFFECT
// ==========================================
(function() {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: transform 0.1s ease;
        display: none;
    `;
    document.body.appendChild(cursor);

    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed;
        width: 40px;
        height: 40px;
        border: 1px solid rgba(139, 92, 246, 0.2);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%);
        transition: all 0.15s ease;
        display: none;
    `;
    document.body.appendChild(trail);

    let mouseX = 0, mouseY = 0;
    
    if (window.innerWidth > 768) {
        cursor.style.display = 'block';
        trail.style.display = 'block';
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        setInterval(() => {
            trail.style.left = mouseX + 'px';
            trail.style.top = mouseY + 'px';
        }, 80);
    }
})();

// ==========================================
// 14. INITIALIZE ALL ON LOAD
// ==========================================
window.addEventListener('load', () => {
    addRevealClasses();
    animateOnScroll();
    animateCounters();
    
    // Initial check for skill bars in view
    setTimeout(animateSkillBars, 100);
});

// Also trigger on scroll once initially
window.addEventListener('scroll', animateOnScroll, { passive: true });
