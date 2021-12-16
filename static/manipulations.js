rotationControl = 0;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

ambient = new THREE.AmbientLight(0xDEDEDE);
scene.add(ambient);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth - 130, window.innerHeight - 100);
document.body.appendChild( renderer.domElement );

geometry = {};
material = {};
mesh = {};

faces = [
    'static/red.png',
    'static/green.png',
    'static/white.png',
    'static/yellow.png',
    'static/blue.png',
    'static/orange.png',
    'static/empty.png', //    'static/black.png'
]

step = 1.1
idx = 0;

//slice1
idx = drawCube(scene, 0, 0, 0, [F[0][0], U[2][0], 6, L[0][2], 6, 6], idx);
idx = drawCube(scene, step, 0, 0, [F[0][1], U[2][1], 6, 6, 6, 6], idx);
idx = drawCube(scene, 2*step, 0, 0, [F[0][2], U[2][2], 6, R[0][0], 6, 6], idx);

idx = drawCube(scene, 0, step, 0, [F[1][0], 6, 6, L[1][2], 6, 6], idx);
idx = drawCube(scene, step, step, 0, [F[1][1], 6, 6, 6, 6, 6], idx);
idx = drawCube(scene, 2*step, step, 0, [F[1][2], 6, 6, R[1][0], 6, 6], idx);

idx = drawCube(scene, 0, 2*step, 0, [F[2][0], D[2][0], 6, L[2][2], 6, 6], idx);
idx = drawCube(scene, step, 2*step, 0, [F[2][1], D[2][1], 6, 6, 6, 6], idx);
idx = drawCube(scene, 2*step, 2*step, 0, [F[2][2], D[2][2], 6, R[2][0], 6, 6], idx);


//slice2
idx = drawCube(scene, 0, 0, step, [6, U[1][0], 6, L[0][1], 6, 6], idx);
idx = drawCube(scene, step, 0, step, [6, U[1][1], 6, 6, 6, 6], idx);
idx = drawCube(scene, 2*step, 0, step, [6, U[1][2], 6, R[0][1], 6, 6], idx);

idx = drawCube(scene, 0, step, step, [6, 6, 6, L[1][1], 6, 6], idx);
idx = drawCube(scene, step, step, step, [6, 6, 6, 6, 6, 6], idx);
idx = drawCube(scene, 2*step, step, step, [6, 6, 6, R[1][1], 6, 6], idx);

idx = drawCube(scene, 0, 2*step, step, [6, 6, D[1][0], L[2][1], 6, 6], idx);
idx = drawCube(scene, step, 2*step, step, [6, D[1][1], 6, 6, 6, 6], idx);
idx = drawCube(scene, 2*step, 2*step, step, [6, D[1][2], 6, R[2][1], 6, 6], idx);

//slice3
idx = drawCube(scene, 0, 0, 2*step, [6, U[0][0], 6, L[0][0], 6, B[0][0]], idx);
idx = drawCube(scene, step, 0, 2*step, [6, U[0][1], 6, 6, 6, B[0][1]], idx);
idx = drawCube(scene, 2*step, 0, 2*step, [6, U[0][2], 6, R[0][2], 6, B[0][2]], idx);

idx = drawCube(scene, 0, step, 2*step, [6, 6, 6, L[1][0], 6, B[1][0]], idx);
idx = drawCube(scene, step, step, 2*step, [6, 6, 6, 6, 6, B[1][1]], idx);
idx = drawCube(scene, 2*step, step, 2*step, [6, 6, 6, R[1][2], 6, B[1][2]], idx);

idx = drawCube(scene, 0, 2*step, 2*step, [6, 6, D[0][0], L[2][0], 6, B[2][0]], idx);
idx = drawCube(scene, step, 2*step, 2*step, [6, D[0][1], 6, 6, 6, B[2][1]], idx);
idx = drawCube(scene, 2*step, 2*step, 2*step, [6, D[0][2], 6, R[2][2], 6, B[2][2]], idx);

function drawCube(scene, off_x, off_y, off_z, cubeColors, idx) {
    //front - top - down - left - right - back
    var cubeToLoad = []
    for (i=0; i<cubeColors.length; i++) {
        cubeToLoad.push(faces[cubeColors[i]]);
    }
    const envTexture = new THREE.CubeTextureLoader().load(cubeToLoad)
    material.envMap = envTexture

    geometry[idx] = new THREE.BoxGeometry();
    material = new THREE.MeshLambertMaterial();
    material.envMap = envTexture
    material[idx] = material;
    mesh[idx] = new THREE.Mesh(geometry[idx], material[idx]);
    mesh[idx].position.x = off_x;
    mesh[idx].position.y = off_y;
    mesh[idx].position.z = off_z;

    if (idx==0) {
        scene.add( mesh[idx] );
    } else {
        mesh[0].add( mesh[idx] );
    }
    idx++;
    return idx;
}

camera.position.z = 5;

mesh[0].rotation.x = -0.75;
mesh[0].rotation.y = 0.5;

const animate = function () {
    requestAnimationFrame( animate );

    if (rotationControl == 1) {
        mesh[0].rotation.x += 0.01;
        mesh[0].rotation.y += 0.01;
    } else if (rotationControl == -1) {
        mesh[0].rotation.x -= 0.01;
        mesh[0].rotation.y -= 0.01;
    }

    renderer.render( scene, camera );
};

animate();

function rotate(rot) {
    rotationControl = rot;
}