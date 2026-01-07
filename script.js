// Initialize Quantum Particle Background
particlesJS('quantum-particles', {
    particles: {
        number: { value: 100, density: { enable: true, value_area: 800 } },
        color: { value: ["#00d4ff", "#9d00ff", "#ff00ff"] },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#00d4ff",
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 }
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true
        }
    },
    retina_detect: true
});

// 3D Quantum Sphere
let quantumSphereScene, quantumSphereCamera, quantumSphereRenderer, quantumSphere;
function initQuantumSphere() {
    const container = document.getElementById('quantumSphere');
    if (!container || !THREE) return;

    quantumSphereScene = new THREE.Scene();
    quantumSphereCamera = new THREE.PerspectiveCamera(75, 400/400, 0.1, 1000);
    quantumSphereRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    quantumSphereRenderer.setSize(400, 400);
    quantumSphereRenderer.setClearColor(0x000000, 0);
    container.appendChild(quantumSphereRenderer.domElement);

    // Create quantum sphere
    const geometry = new THREE.SphereGeometry(100, 64, 64);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x00d4ff,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    quantumSphere = new THREE.Mesh(geometry, material);
    quantumSphereScene.add(quantumSphere);

    // Add particle system inside sphere
    const particleCount = 500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const radius = 80 + Math.random() * 20;

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        colors[i * 3] = Math.random() * 0.5 + 0.5;     // R
        colors[i * 3 + 1] = Math.random() * 0.5 + 0.3; // G
        colors[i * 3 + 2] = Math.random() * 0.5 + 0.8; // B
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    quantumSphereScene.add(particleSystem);

    quantumSphereCamera.position.z = 250;

    // Store references for cleanup
    window.quantumSphereScene = quantumSphereScene;
    window.quantumSphereCamera = quantumSphereCamera;
    window.quantumSphereRenderer = quantumSphereRenderer;
    window.quantumParticleSystem = particleSystem;

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        quantumSphere.rotation.x += 0.002;
        quantumSphere.rotation.y += 0.003;
        
        particleSystem.rotation.x += 0.001;
        particleSystem.rotation.y += 0.002;

        // Pulsing effect
        const time = Date.now() * 0.001;
        quantumSphere.scale.setScalar(1 + Math.sin(time) * 0.05);
        
        quantumSphereRenderer.render(quantumSphereScene, quantumSphereCamera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        if (quantumSphereRenderer && container) {
            quantumSphereRenderer.setSize(container.clientWidth, container.clientHeight);
            quantumSphereCamera.aspect = container.clientWidth / container.clientHeight;
            quantumSphereCamera.updateProjectionMatrix();
        }
    });
}

// Animated Counter
function animateCounters() {
    const counters = document.querySelectorAll('.stat-value');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                if (counter.classList.contains('percent')) {
                    counter.textContent = current.toFixed(1) + '%';
                } else {
                    counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '');
                }
                setTimeout(updateCounter, 16);
            } else {
                if (counter.classList.contains('percent')) {
                    counter.textContent = target.toFixed(1) + '%';
                } else {
                    counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
                }
            }
        };
        
        // Start animation when in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// Quantum Gate Drag & Drop
function initQuantumSimulator() {
    const gateItems = document.querySelectorAll('.gate-item');
    const gateSlots = document.querySelectorAll('.gate-slots');
    const runButton = document.getElementById('runCircuit');
    const clearButton = document.getElementById('clearCircuit');
    const saveButton = document.getElementById('saveCircuit');
    
    let draggedGate = null;
    
    // Make gates draggable
    gateItems.forEach(gate => {
        gate.setAttribute('draggable', 'true');
        
        gate.addEventListener('dragstart', (e) => {
            draggedGate = gate.cloneNode(true);
            draggedGate.style.opacity = '0.5';
            e.dataTransfer.setData('text/plain', gate.getAttribute('data-gate'));
            e.dataTransfer.effectAllowed = 'move';
        });
        
        gate.addEventListener('dragend', () => {
            draggedGate = null;
            gateItems.forEach(g => g.style.opacity = '1');
        });
    });
    
    // Make slots droppable
    gateSlots.forEach(slot => {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            slot.style.backgroundColor = 'rgba(0, 212, 255, 0.1)';
        });
        
        slot.addEventListener('dragleave', () => {
            slot.style.backgroundColor = '';
        });
        
        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.style.backgroundColor = '';
            
            const gateType = e.dataTransfer.getData('text/plain');
            const gateElement = document.createElement('div');
            gateElement.className = 'gate-placed';
            gateElement.textContent = gateType.toUpperCase();
            gateElement.style.cssText = `
                padding: 10px 20px;
                background: linear-gradient(135deg, var(--quantum-blue), var(--quantum-purple));
                color: var(--quantum-dark);
                border-radius: 6px;
                font-weight: 700;
                cursor: pointer;
                animation: quantumPulse 2s infinite;
                margin: 0 5px;
            `;
            
            // Remove existing gates in this slot
            slot.innerHTML = '';
            slot.appendChild(gateElement);
            
            // Add remove functionality
            gateElement.addEventListener('click', (e) => {
                e.stopPropagation();
                gateElement.remove();
            });
        });
    });
    
    // Run circuit simulation
    runButton.addEventListener('click', () => {
        const probabilityBars = document.querySelectorAll('.prob-bar');
        const results = generateQuantumResults();
        
        probabilityBars.forEach((bar, index) => {
            const height = results[index];
            bar.style.height = `${height}%`;
            bar.querySelector('.prob-value').textContent = `${height}%`;
            
            // Add animation
            bar.style.transition = 'height 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        // Show quantum effect
        showQuantumEffect();
        
        // Update terminal output
        updateTerminalWithResults(results);
    });
    
    // Clear circuit
    clearButton.addEventListener('click', () => {
        gateSlots.forEach(slot => {
            slot.innerHTML = '';
        });
        
        // Reset probability bars
        const probabilityBars = document.querySelectorAll('.prob-bar');
        probabilityBars.forEach(bar => {
            bar.style.height = '25%';
            bar.querySelector('.prob-value').textContent = '25%';
        });
    });
    
    // Save circuit
    saveButton.addEventListener('click', () => {
        const circuit = [];
        gateSlots.forEach((slot, index) => {
            const gate = slot.querySelector('.gate-placed');
            if (gate) {
                circuit.push({
                    qubit: index,
                    gate: gate.textContent
                });
            }
        });
        
        if (circuit.length > 0) {
            alert('Circuit saved successfully!');
            console.log('Saved circuit:', circuit);
        } else {
            alert('No gates to save. Add some gates first!');
        }
    });
}

function generateQuantumResults() {
    // Generate random but normalized quantum probabilities
    const results = [];
    let total = 0;
    
    for (let i = 0; i < 4; i++) {
        results.push(Math.random() * 50);
        total += results[i];
    }
    
    // Normalize to 100%
    const normalized = results.map(val => Math.round((val / total) * 100));
    
    // Ensure sum is 100
    const sum = normalized.reduce((a, b) => a + b, 0);
    if (sum !== 100) {
        normalized[0] += (100 - sum);
    }
    
    return normalized;
}

function updateTerminalWithResults(results) {
    const terminalOutput = document.querySelector('.terminal-output');
    const resultLine = document.createElement('div');
    resultLine.className = 'terminal-line';
    resultLine.innerHTML = `
        <span class="output">>> Measurement results: ${results.map((r, i) => `|${i.toString(2).padStart(3, '0')}⟩ = ${r}%`).join(', ')}</span>
    `;
    terminalOutput.appendChild(resultLine);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function showQuantumEffect() {
    // Create quantum effect animation
    const effect = document.createElement('div');
    effect.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(0, 212, 255, 0.2) 0%, transparent 70%);
        z-index: 9999;
        pointer-events: none;
        opacity: 0;
        animation: quantumFlash 1.5s ease-out;
    `;
    
    document.body.appendChild(effect);
    
    // Add CSS animation if not already present
    if (!document.querySelector('#quantum-flash-style')) {
        const style = document.createElement('style');
        style.id = 'quantum-flash-style';
        style.textContent = `
            @keyframes quantumFlash {
                0% { opacity: 0; transform: scale(0.5); }
                50% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(1.5); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove after animation
    setTimeout(() => {
        effect.remove();
    }, 1500);
}

// Quantum Terminal
function initQuantumTerminal() {
    const terminal = document.querySelector('.quantum-terminal');
    if (!terminal) return;
    
    const closeBtn = terminal.querySelector('.terminal-close');
    const output = terminal.querySelector('.terminal-output');
    
    // Auto-open terminal after delay
    setTimeout(() => {
        terminal.classList.add('active');
    }, 3000);
    
    // Close terminal
    closeBtn.addEventListener('click', () => {
        terminal.classList.remove('active');
    });
    
    // Auto-type commands
    const commands = [
        'entangle --qubits="0,1"',
        'measure --qubit=0 --shots=1024',
        'visualize --circuit=grover',
        'optimize --depth=3',
        'export --format=qasm'
    ];
    
    let commandIndex = 0;
    
    function typeNextCommand() {
        if (commandIndex >= commands.length) {
            commandIndex = 0;
        }
        
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `
            <span class="prompt">quantum@shift:~$</span>
            <span class="command">${commands[commandIndex]}</span>
        `;
        
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
        
        commandIndex++;
        
        // Add response after delay
        setTimeout(() => {
            const response = document.createElement('div');
            response.className = 'terminal-line';
            response.innerHTML = `
                <span class="output">>> Operation completed successfully. Quantum state updated.</span>
            `;
            output.appendChild(response);
            output.scrollTop = output.scrollHeight;
        }, 500);
        
        // Keep only last 10 lines
        const lines = output.querySelectorAll('.terminal-line');
        if (lines.length > 10) {
            lines[0].remove();
            lines[1].remove();
        }
    }
    
    // Type commands at intervals
    const terminalInterval = setInterval(typeNextCommand, 3000);
    
    // Store interval for cleanup
    window.terminalInterval = terminalInterval;
}

// Interactive Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const quantumMenu = document.querySelector('.quantum-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    
    // Mobile menu toggle
    if (quantumMenu) {
        quantumMenu.addEventListener('click', () => {
            navLinksContainer.classList.toggle('show');
            quantumMenu.classList.toggle('active');
        });
    }
    
    // Highlight active section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => observer.observe(section));
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinksContainer.classList.contains('show')) {
                    navLinksContainer.classList.remove('show');
                    quantumMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Launch Lab button
    const launchLabBtn = document.querySelector('.btn-quantum');
    if (launchLabBtn) {
        launchLabBtn.addEventListener('click', () => {
            showQuantumEffect();
            alert('Launching Quantum Lab...\n\nOpening in a new window with full simulation capabilities.');
        });
    }
    
    // Start Simulation button
    const startSimBtn = document.querySelector('.btn-primary.quantum-pulse');
    if (startSimBtn) {
        startSimBtn.addEventListener('click', () => {
            // Scroll to simulator section
            const simulatorSection = document.getElementById('simulator');
            if (simulatorSection) {
                window.scrollTo({
                    top: simulatorSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            showQuantumEffect();
        });
    }
}

// Dark Mode Toggle
function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;
    
    const savedTheme = localStorage.getItem('quantum-theme');
    
    if (savedTheme === 'dark') {
        toggle.checked = true;
        document.body.classList.add('dark-mode');
    } else if (savedTheme === 'light') {
        toggle.checked = false;
        document.body.classList.remove('dark-mode');
    } else {
        // Default to dark mode
        toggle.checked = true;
        document.body.classList.add('dark-mode');
        localStorage.setItem('quantum-theme', 'dark');
    }
    
    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('quantum-theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('quantum-theme', 'light');
        }
    });
}

// Quantum Algorithm Cards
function initAlgorithmCards() {
    const cards = document.querySelectorAll('.algorithm-card');
    const implementBtns = document.querySelectorAll('.btn-algorithm');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.algorithm-icon');
            icon.style.transform = 'rotateY(180deg) scale(1.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.algorithm-icon');
            icon.style.transform = 'rotateY(0deg) scale(1)';
        });
    });
    
    implementBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.algorithm-card');
            const algorithmName = card.querySelector('h3').textContent;
            
            showQuantumEffect();
            alert(`Implementing ${algorithmName}...\n\nOpening code editor with algorithm template.`);
        });
    });
}

// Create floating quantum elements
function createFloatingElements() {
    const container = document.querySelector('.quantum-hero');
    if (!container) return;
    
    // Remove existing floating elements
    const existingElements = container.querySelectorAll('.floating-quantum');
    existingElements.forEach(el => el.remove());
    
    for (let i = 0; i < 15; i++) {
        const element = document.createElement('div');
        element.className = 'floating-quantum';
        
        // Random properties
