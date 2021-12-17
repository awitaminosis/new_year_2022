rotationControl = 0;
var scene, renderer, camera;
var controls;

geometry = {};
material = {};
mesh = {};

function animate () {
    controls.update();
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
};

function init() {
    renderer = new THREE.WebGLRenderer( {antialias:true} );
    renderer.setSize(window.innerWidth - 130, window.innerHeight - 100);
    document.body.appendChild (renderer.domElement);

    scene = new THREE.Scene();

    populate();

    ambient = new THREE.AmbientLight(0xDEDEDE);
    scene.add(ambient);

    camera = new THREE.PerspectiveCamera (15, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1;
    camera.position.y = 20;
    camera.lookAt (new THREE.Vector3(0,0,0));

    controls = new THREE.OrbitControls (camera, renderer.domElement);
}

function populate() {
    faces = [
        'static/white.png',
        'static/yellow.png',
        'static/blue.png',
        'static/green.png',
        'static/red.png',
        'static/orange.png',
        'static/empty.png', //    'static/black.png'
    ];

    step = 1.1
    idx = 0;

//    idx = drawCube(scene, 0, 0, 0, [0, 1, 2, 3, 4, 5], idx);

    //front - top - down - left - right - back
    //---right + left + top + bottom + front + back
    //slice1

    idx = drawCube(scene, 0, 0, 0, [F[0][0], U[2][0], 6, L[0][2], 6, 6], idx);
    idx = drawCube(scene, step, 0, 0, [F[0][1], U[2][1], 6, 6, 6, 6], idx);
    idx = drawCube(scene, 2*step, 0, 0, [F[0][2], U[2][2], 6, 6, R[0][0], 6], idx);

    idx = drawCube(scene, 0, -step, 0, [F[1][0], 6, 6, L[1][2], 6, 6], idx);
    idx = drawCube(scene, step, -step, 0, [F[1][1], 6, 6, 6, 6, 6], idx);
    idx = drawCube(scene, 2*step, -step, 0, [F[1][2], 6, 6, 6, R[1][0], 6], idx);

    idx = drawCube(scene, 0, -2*step, 0, [F[2][0], 6, D[2][0], L[2][2], 6, 6], idx);
    idx = drawCube(scene, step, -2*step, 0, [F[2][1], 6, D[2][1], 6, 6, 6], idx);
    idx = drawCube(scene, 2*step, -2*step, 0, [F[2][2], 6, D[2][2], 6, R[2][0], 6], idx);

    //front - top - down - left - right - back
    //---right + left + top + bottom + front + back
    //slice2
    idx = drawCube(scene, 0, -0, -step, [6, U[1][0], 6, L[0][1], 6, 6], idx);
    idx = drawCube(scene, step, -0, -step, [6, U[1][1], 6, 6, 6, 6], idx);
    idx = drawCube(scene, 2*step, -0, -step, [6, U[1][2], 6, 6, R[0][1], 6], idx);

    idx = drawCube(scene, 0, -step, -step, [6, 6, 6, L[1][1], 6, 6], idx);
    idx = drawCube(scene, step, -step, -step, [6, 6, 6, 6, 6, 6], idx);
    idx = drawCube(scene, 2*step, -step, -step, [6, 6, 6, 6, R[1][1], 6], idx);

    idx = drawCube(scene, 0, -2*step, -step, [6, 6, D[1][0], L[2][1], 6, 6], idx);
    idx = drawCube(scene, step, -2*step, -step, [6, 6, D[1][1], 6, 6, 6], idx);
    idx = drawCube(scene, 2*step, -2*step, -step, [6, 6, D[1][2], 6, R[2][1], 6], idx);

    //front - top - down - left - right - back
    //---right + left + top + bottom + front + back
    //slice3
    idx = drawCube(scene, 0, 0, -2*step, [6, U[0][0], 6, L[0][0], 6, B[0][0]], idx);
    idx = drawCube(scene, step, 0, -2*step, [6, U[0][1], 6, 6, 6, B[0][1]], idx);
    idx = drawCube(scene, 2*step, 0, -2*step, [6, U[0][2], 6, 6, R[0][2], B[0][2]], idx);

    idx = drawCube(scene, 0, -step, -2*step, [6, 6, 6, L[1][0], 6, B[1][0]], idx);
    idx = drawCube(scene, step, -step, -2*step, [6, 6, 6, 6, 6, B[1][1]], idx);
    idx = drawCube(scene, 2*step, -step, -2*step, [6, 6, 6, 6, R[1][2], B[1][2]], idx);

    idx = drawCube(scene, 0, -2*step, -2*step, [6, 6, D[0][0], L[2][0], 6, B[2][0]], idx);
    idx = drawCube(scene, step, -2*step, -2*step, [6, 6, D[0][1], 6, 6, B[2][1]], idx);
    idx = drawCube(scene, 2*step, -2*step, -2*step, [6, 6, D[0][2], 6, R[2][2], B[2][2]], idx);
}


function drawCube(scene, off_x, off_y, off_z, cubeColors, idx) {
    //front - top - down - left - right - back
    //---right + left + top + bottom + front + back
    var loader = new THREE.TextureLoader();
    materialArray = [];

    //MeshBasicMaterial has a side sequence unconvinient for standard cube. so not a for loop but a mapping
    materialArray.push(new THREE.MeshBasicMaterial( { map: loader.load(faces[cubeColors[4]]) } )); //right
    materialArray.push(new THREE.MeshBasicMaterial( { map: loader.load(faces[cubeColors[3]]) } )); //left
    materialArray.push(new THREE.MeshBasicMaterial( { map: loader.load(faces[cubeColors[1]]) } )); //top
    materialArray.push(new THREE.MeshBasicMaterial( { map: loader.load(faces[cubeColors[2]]) } )); //bottom
    materialArray.push(new THREE.MeshBasicMaterial( { map: loader.load(faces[cubeColors[0]]) } )); //front
    materialArray.push(new THREE.MeshBasicMaterial( { map: loader.load(faces[cubeColors[5]]) } )); //back

    geometry[idx] = new THREE.BoxGeometry();

    mesh[idx] = new THREE.Mesh( geometry[idx], materialArray );
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

function rotate(rot) {
    rotationControl = rot;
}

init();
animate();

mesh[0].rotation.x = -0.75;
mesh[0].rotation.y = 0.5;