// Stuff needed for the scene
let scene, camera, renderer, book, ambientLight, pointLight1, pointLight2;
let mouseX = 0, mouseY = 0;
let isLoaded = false;
let introActive = true;

// Setting up everything
function init() {
    // Make the scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf4e8d0, 10, 50);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 8;
    camera.position.y = 0.5;
    
    // Renderer setup
    const canvas = document.getElementById('scene-canvas');
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0xf4e8d0, 1);
    
    // Lights setup
    ambientLight = new THREE.AmbientLight(0xffd9a0, 0.6);
    scene.add(ambientLight);
    
    // Main light
    pointLight1 = new THREE.PointLight(0xffd700, 1.2, 30);
    pointLight1.position.set(5, 5, 5);
    pointLight1.castShadow = true;
    pointLight1.shadow.mapSize.width = 1024;
    pointLight1.shadow.mapSize.height = 1024;
    scene.add(pointLight1);
    
    // Another light for extra glow
    pointLight2 = new THREE.PointLight(0xffb347, 0.8, 25);
    pointLight2.position.set(-5, 3, 3);
    scene.add(pointLight2);
    
    // One more light to make it look better
    const directionalLight = new THREE.DirectionalLight(0xffeaa7, 0.5);
    directionalLight.position.set(0, 10, 5);
    scene.add(directionalLight);
    
    // Make the book
    createBook();
    
    // Add floating particles
    createParticles();
    
    // Listen for events
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);
    document.getElementById('intro-container').addEventListener('click', onIntroClick, false);
    
    // Hide the loading indicator
    setTimeout(() => {
        document.getElementById('loading-indicator').classList.add('hidden');
        isLoaded = true;
        animateIntroElements();
    }, 1000);
    
    // Start the animation
    animate();
}

// Building the 3d book from scratch
function createBook() {
    const bookGroup = new THREE.Group();
    
    // Book size
    const bookWidth = 2.5;
    const bookHeight = 3.5;
    const bookDepth = 0.4;
    
    // The cover
    const coverGeometry = new THREE.BoxGeometry(bookWidth, bookHeight, bookDepth);
    
    // Brown leather look
    const coverMaterial = new THREE.MeshStandardMaterial({
        color: 0x6b4423,
        roughness: 0.8,
        metalness: 0.1,
        emissive: 0x3d2415,
        emissiveIntensity: 0.2
    });
    
    const cover = new THREE.Mesh(coverGeometry, coverMaterial);
    cover.castShadow = true;
    cover.receiveShadow = true;
    bookGroup.add(cover);
    
    // Pages inside
    const pagesGeometry = new THREE.BoxGeometry(bookWidth - 0.1, bookHeight - 0.1, bookDepth - 0.05);
    const pagesMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5e6d3,
        roughness: 0.9,
        metalness: 0.0
    });
    
    const pages = new THREE.Mesh(pagesGeometry, pagesMaterial);
    pages.position.x = 0.05;
    pages.castShadow = true;
    bookGroup.add(pages);
    
    // Gold lines on the spine
    const spineGeometry = new THREE.BoxGeometry(0.05, bookHeight - 0.3, bookDepth + 0.02);
    const spineMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.3,
        metalness: 0.7,
        emissive: 0xd4af37,
        emissiveIntensity: 0.3
    });
    
    const spine1 = new THREE.Mesh(spineGeometry, spineMaterial);
    spine1.position.set(-bookWidth / 2 + 0.05, 0.8, 0);
    bookGroup.add(spine1);
    
    const spine2 = new THREE.Mesh(spineGeometry, spineMaterial);
    spine2.position.set(-bookWidth / 2 + 0.05, 0, 0);
    bookGroup.add(spine2);
    
    const spine3 = new THREE.Mesh(spineGeometry, spineMaterial);
    spine3.position.set(-bookWidth / 2 + 0.05, -0.8, 0);
    bookGroup.add(spine3);
    
    // Gold corners
    const cornerGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.05);
    const cornerMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.2,
        metalness: 0.8,
        emissive: 0xd4af37,
        emissiveIntensity: 0.4
    });
    
    // Put corners on all four edges
    const corners = [
        { x: bookWidth / 2 - 0.2, y: bookHeight / 2 - 0.2 },
        { x: -bookWidth / 2 + 0.2, y: bookHeight / 2 - 0.2 },
        { x: bookWidth / 2 - 0.2, y: -bookHeight / 2 + 0.2 },
        { x: -bookWidth / 2 + 0.2, y: -bookHeight / 2 + 0.2 }
    ];
    
    corners.forEach(pos => {
        const corner = new THREE.Mesh(cornerGeometry, cornerMaterial);
        corner.position.set(pos.x, pos.y, bookDepth / 2 + 0.02);
        bookGroup.add(corner);
    });
    
    // Gold circle in the middle
    const emblemGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 32);
    const emblemMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.2,
        metalness: 0.9,
        emissive: 0xffd700,
        emissiveIntensity: 0.5
    });
    
    const emblem = new THREE.Mesh(emblemGeometry, emblemMaterial);
    emblem.rotation.x = Math.PI / 2;
    emblem.position.z = bookDepth / 2 + 0.03;
    bookGroup.add(emblem);
    
    // Smaller circle inside
    const innerEmblemGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.06, 32);
    const innerEmblem = new THREE.Mesh(innerEmblemGeometry, new THREE.MeshStandardMaterial({
        color: 0x8b6914,
        roughness: 0.4,
        metalness: 0.6
    }));
    innerEmblem.rotation.x = Math.PI / 2;
    innerEmblem.position.z = bookDepth / 2 + 0.04;
    bookGroup.add(innerEmblem);
    
    // Rotate it a bit so it looks cooler
    bookGroup.rotation.set(0.1, -0.3, 0);
    
    book = bookGroup;
    scene.add(book);
    
    // Animate it coming in with gsap
    gsap.from(book.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 2,
        ease: "elastic.out(1, 0.5)",
        delay: 0.5
    });
    
    gsap.from(book.rotation, {
        y: Math.PI * 2,
        duration: 2,
        ease: "power2.out",
        delay: 0.5
    });
}

// Make some particles floating around
function createParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    const posArray = new Float32Array(particlesCount * 3);
    
    // Random positions for each particle
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Make them golden and glowy
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        color: 0xffd700,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Slowly spin them around
    gsap.to(particlesMesh.rotation, {
        y: Math.PI * 2,
        duration: 100,
        repeat: -1,
        ease: "none"
    });
}

// Track mouse movement
function onMouseMove(event) {
    // Move the custom cursor
    const cursor = document.getElementById('custom-cursor');
    cursor.style.left = event.clientX + 'px';
    cursor.style.top = event.clientY + 'px';
    
    // Show cursor
    document.body.classList.add('cursor-active');
    
    // Save mouse position for parallax
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

// What happens when you click the book
function onIntroClick() {
    if (!introActive || !isLoaded) return;
    
    introActive = false;
    
    // Cursor animation
    const cursor = document.getElementById('custom-cursor');
    cursor.classList.add('cursor-hover');
    setTimeout(() => cursor.classList.remove('cursor-hover'), 300);
    
    // Fade out the intro screen
    const introContainer = document.getElementById('intro-container');
    const mainContent = document.getElementById('main-content');
    
    gsap.to(introContainer, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut",
        onComplete: () => {
            introContainer.style.display = 'none';
            // Back to normal cursor
            document.body.style.cursor = 'auto';
        }
    });
    
    // Book zooms away
    gsap.to(book.position, {
        z: -20,
        duration: 1.5,
        ease: "power2.in"
    });
    
    gsap.to(book.rotation, {
        x: Math.PI,
        y: Math.PI,
        duration: 1.5,
        ease: "power2.in"
    });
    
    // Show the main content
    setTimeout(() => {
        mainContent.classList.add('visible');
    }, 800);
}

// Animate the text when it appears
function animateIntroElements() {
    const title = document.querySelector('.intro-title');
    const subtitle = document.querySelector('.intro-subtitle');
    
    // Scale up the title
    gsap.from(title, {
        scale: 0.8,
        duration: 2,
        ease: "power2.out",
        delay: 0.5
    });
    
    // Scale up subtitle a bit later
    gsap.from(subtitle, {
        scale: 0.9,
        duration: 2,
        ease: "power2.out",
        delay: 1.5
    });
}

// Main animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (book && introActive) {
        // Make it float up and down
        const time = Date.now() * 0.001;
        book.position.y = Math.sin(time * 0.5) * 0.3;
        
        // Slow rotation
        book.rotation.y += 0.003;
        book.rotation.x = Math.sin(time * 0.3) * 0.05;
        book.rotation.z = Math.cos(time * 0.4) * 0.03;
        
        // Follow mouse movement
        const targetX = mouseX * 0.3;
        const targetY = mouseY * 0.3;
        
        book.rotation.y += (targetX - book.rotation.y) * 0.05;
        book.rotation.x += (targetY - book.rotation.x) * 0.05;
        
        // Move lights around
        pointLight1.position.x = Math.sin(time * 0.7) * 3 + 5;
        pointLight1.position.y = Math.cos(time * 0.5) * 2 + 5;
        
        pointLight2.position.x = Math.cos(time * 0.6) * 3 - 5;
        pointLight2.position.y = Math.sin(time * 0.4) * 2 + 3;
    }
    
    renderer.render(scene, camera);
}

// Fix things when window is resized
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Check if quality needs lowering for performance
function checkPerformance() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowPower = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isMobile || isLowPower) {
        // Reduce quality on phones
        renderer.setPixelRatio(1);
        if (scene.fog) scene.fog.far = 30;
    }
}

// Start everything when page loads
window.addEventListener('DOMContentLoaded', () => {
    checkPerformance();
    init();
    setupSmoothScroll();
});

// Smooth scrolling for nav links
function setupSmoothScroll() {
    document.querySelectorAll('a.smooth-scroll').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Touch support for phones
document.getElementById('intro-container').addEventListener('touchstart', (e) => {
    if (introActive && isLoaded) {
        e.preventDefault();
        onIntroClick();
    }
}, { passive: false });

// Clean up memory when leaving page
window.addEventListener('beforeunload', () => {
    if (renderer) {
        renderer.dispose();
    }
    if (scene) {
        scene.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }
});
