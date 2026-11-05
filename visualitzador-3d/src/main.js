import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 1. CREACIÓ DE L'ESCENA
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// 2. CREACIÓ DE LA CÀMERA
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 10);

// 3. CREACIÓ DEL RENDERITZADOR
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

document.body.style.margin = '0';
document.body.style.overflow = 'hidden';

// 4. CONTROLS DE RATOLÍ (OrbitControls)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 5. IL·LUMINACIÓ
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0, 10, 0);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// 6. CÀRREGA DELS MATERIALS (MTL) I DEL MODEL (OBJ)
const mtlLoader = new MTLLoader();

// Carreguem el fitxer .mtl amb el nom exacte de la teva carpeta
mtlLoader.load('/QuickMapleOptimized.mtl', (materials) => {
  materials.preload();

  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials); // Assignem els materials

  objLoader.load(
    '/QuickMapleOptimized.obj',
    (object) => {
      // Centrar el model automàticament
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      object.position.sub(center);

      scene.add(object);
      console.log('Model i textures carregats correctament!');
    },
    undefined,
    (error) => {
      console.error("Error en carregar el model .obj:", error);
    }
  );
}, 
undefined,
(error) => {
  console.error("Error en carregar el fitxer .mtl:", error);
});

// 7. RESPONSIVITAT
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 8. BUCLE D'ANIMACIÓ
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();