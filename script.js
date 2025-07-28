document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation Toggle ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // --- Close Mobile Menu When a Link is Clicked ---
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });
    
    // --- Active Link Highlighting & Fade-in Animation on Scroll ---
    const sections = document.querySelectorAll('.content-section');
    const sectionObserverOptions = { root: null, threshold: 0.2 };
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(currentId)) {
                        link.classList.add('active');
                    }
                });
                observer.unobserve(entry.target);
            }
        });
    }, sectionObserverOptions);
    sections.forEach(section => sectionObserver.observe(section));

    // --- THREE.JS 3D NEURON ANIMATION ---
    let scene, camera, renderer, neuronGroup, particles;
    let mouseX = 0, mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    function init3D() {
        // Scene
        scene = new THREE.Scene();
        
        // Camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 50;

        // Renderer
        const canvas = document.getElementById('canvas');
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // --- Create the Neuron and Particle System ---
        neuronGroup = new THREE.Group();
        
        // Nodes (Neurons)
        const nodeGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB, transparent: true, opacity: 0.8 });
        const nodes = [];
        for (let i = 0; i < 50; i++) {
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
            node.position.set(x, y, z);
            nodes.push(node);
            neuronGroup.add(node);
        }

        // Connections (Axons)
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 });
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (Math.random() > 0.95) { // Randomly connect some nodes
                    const points = [nodes[i].position, nodes[j].position];
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    neuronGroup.add(line);
                }
            }
        }
        
        scene.add(neuronGroup);

        // Particle System (Bee Swarm)
        const particleCount = 5000;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 200;
            colors[i] = Math.random() * 0.5 + 0.5;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });

        particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // --- Event Listeners ---
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) / 5;
        mouseY = (event.clientY - windowHalfY) / 5;
    }

    function animate() {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.00005;

        // Animate the main neuron group
        neuronGroup.rotation.x += 0.0005;
        neuronGroup.rotation.y += 0.001;

        // Animate the particle swarm
        particles.rotation.x += 0.0002;
        particles.rotation.y += 0.0004;

        // Mouse interaction
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    // Initialize and start the animation
    init3D();
    animate();
});
