const canvasSketch = require('canvas-sketch');
const THREE = require('three');

// Basic settings for canvas-sketch
const settings = {
  // We need to tell canvas-sketch to use a WebGL context and to animate
  dimensions: [1024, 1024],
  context: 'webgl',
  animate: true,
  attributes: { antialias: true } // Enable anti-aliasing for smoother edges
};

const sketch = ({ context, canvas, width, height }) => {
  // Create a three.js renderer that uses the canvas and context from canvas-sketch
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    context: context,
  });
  renderer.setClearColor(0x1a1a1a, 1); // Set background color

  // Create a three.js camera
  const fov = 75;
  const aspect = width / height;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 7;

  // Create a three.js scene
  const scene = new THREE.Scene();

  // Create the cube geometry and material
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const torusGeometry = new THREE.TorusGeometry(1, 0.4, 32, 100);
  // --- NEW: Create geometry for a cylinder ---
  // Parameters: radiusTop, radiusBottom, height, radialSegments
  const cylinderGeometry = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
const torusKnotGeometry = new THREE.TorusKnotGeometry(0.8, 0.25, 100, 16);


 const materials = [
    // 0: Normal Material (for debugging shape)
    new THREE.MeshNormalMaterial(),
    // 1: Standard Material (realistic, needs light)
    new THREE.MeshStandardMaterial({
      color: 0x668899, // An orange color
      roughness: 0.2,  // How shiny it is (0=mirror, 1=matte)
      metalness: 0.1   // How metallic it is
    }),
    // 2: Basic Material (flat green, no light needed)
    new THREE.MeshBasicMaterial({
      color: 0x00ff00
    }),
    // 3: Wireframe Material
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true
    })
  ];
  let currentMaterialIndex = 1;

  const cube = new THREE.Mesh(geometry, materials[currentMaterialIndex]);
  scene.add(cube);
  const torus = new THREE.Mesh(torusGeometry, materials[0]);
  scene.add(torus)
  const cylinder = new THREE.Mesh(cylinderGeometry, materials[0]);
  scene.add(cylinder)
  torus.position.x = 3;
  cylinder.position.y = 3;
  const torusKnot = new THREE.Mesh(torusKnotGeometry, materials[1]);
  scene.add(torusKnot);
   torusKnot.position.x = -3.6;

  // --- NEW: Add lights to the scene ---
  // Ambient light provides a soft, base light to the whole scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Point light acts like a light bulb, casting light from a single point
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(3, 4, 5); // Position the light
  scene.add(pointLight);

  // --- INTERACTIVITY LOGIC ---

  let isDragging = false;
  const previousMousePosition = {
    x: 0,
    y: 0
  };

  // Mouse drag handler
  const handleDrag = (clientX, clientY) => {
    const deltaX = clientX - previousMousePosition.x;
    const deltaY = clientY - previousMousePosition.y;

    // Rotate based on mouse movement
    cube.rotation.y += deltaX * 0.01;
    cube.rotation.x += deltaY * 0.01;
    cube.rotation.y += deltaX * 0.01;
    cube.rotation.x += deltaY * 0.01;
    torus.rotation.y += deltaX * 0.01;
    torus.rotation.x += deltaY * 0.01;
    cylinder.rotation.y += deltaX * 0.01;
    cylinder.rotation.x += deltaY * 0.01;
    // --- NEW: Rotate the torus knot ---
    torusKnot.rotation.y += deltaX * 0.01;
    torusKnot.rotation.x += deltaY * 0.01;

    previousMousePosition.x = clientX;
    previousMousePosition.y = clientY;
  };
  
  // Mouse events
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition.x = e.clientX;
    previousMousePosition.y = e.clientY;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    handleDrag(e.clientX, e.clientY);
  });

  canvas.addEventListener('mouseup', () => {
    isDragging = false;
  });

   canvas.addEventListener('mouseleave', () => {
    isDragging = false;
  });

  // Touch events for mobile
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      e.preventDefault();
      isDragging = true;
      previousMousePosition.x = e.touches[0].clientX;
      previousMousePosition.y = e.touches[0].clientY;
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && isDragging) {
      e.preventDefault();
      handleDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: false });

  canvas.addEventListener('touchend', () => {
    isDragging = false;
  });

  // The sketch function returns an object with render and resize methods
  return {
    // This is the animation loop, called on every frame
    render({ time }) {
      // If not dragging, apply a slow, constant rotation for a dynamic effect
      if (!isDragging) {
        cube.rotation.x += 0.001;
        cube.rotation.y += 0.001;
      }
      
      // Render the scene with the camera
      renderer.render(scene, camera);
    },
    // This is called by canvas-sketch when the browser window is resized
    resize({ viewportWidth, viewportHeight }) {
      renderer.setSize(viewportWidth, viewportHeight);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // This is called when the sketch is unloaded
    unload() {
      renderer.dispose();
      // You might want to remove event listeners here as well
    }
  };
};

// Start the sketch
canvasSketch(sketch, settings);
