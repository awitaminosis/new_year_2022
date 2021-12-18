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
    renderer.setSize(window.innerWidth - 130, window.innerHeight - 80);
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

    idx = drawCube(scene, 0, -2*step, 0, [F[2][0], 6, D[0][0], L[2][2], 6, 6], idx);
    idx = drawCube(scene, step, -2*step, 0, [F[2][1], 6, D[0][1], 6, 6, 6], idx);
    idx = drawCube(scene, 2*step, -2*step, 0, [F[2][2], 6, D[0][2], 6, R[2][0], 6], idx);

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
    idx = drawCube(scene, 0, 0, -2*step, [6, U[0][0], 6, L[0][0], 6, B[0][2]], idx);
    idx = drawCube(scene, step, 0, -2*step, [6, U[0][1], 6, 6, 6, B[0][1]], idx);
    idx = drawCube(scene, 2*step, 0, -2*step, [6, U[0][2], 6, 6, R[0][2], B[0][0]], idx);

    idx = drawCube(scene, 0, -step, -2*step, [6, 6, 6, L[1][0], 6, B[1][2]], idx);
    idx = drawCube(scene, step, -step, -2*step, [6, 6, 6, 6, 6, B[1][1]], idx);
    idx = drawCube(scene, 2*step, -step, -2*step, [6, 6, 6, 6, R[1][2], B[1][0]], idx);

    idx = drawCube(scene, 0, -2*step, -2*step, [6, 6, D[2][0], L[2][0], 6, B[2][2]], idx);
    idx = drawCube(scene, step, -2*step, -2*step, [6, 6, D[2][1], 6, 6, B[2][1]], idx);
    idx = drawCube(scene, 2*step, -2*step, -2*step, [6, 6, D[2][2], 6, R[2][2], B[2][0]], idx);
}


function drawCube(scene, off_x, off_y, off_z, cubeColors, idx) {
    faces = [
        'static/img/white.png',         //0
        'static/img/yellow.png',        //1
        'static/img/red.png',           //2
        'static/img/orange.png',        //3
        'static/img/green.png',         //4
        'static/img/blue.png',          //5
        'static/img/black.png', //6 meaning empty
        //special
        '/static/img/special/_.png',    //7
        '/static/img/special/M.png',    //8
        '/static/img/special/j.png',    //9
        '/static/img/special/A.png',    //10
        '/static/img/special/y.png',    //11
        '/static/img/special/g.png',    //12
        '/static/img/special/=.png',    //13
    ];

    //sequence from model:      front - top - down - left - right - back
    //sequence for renderer:    right + left + top + bottom + front + back
    var loader = new THREE.TextureLoader();
    materialArray = [];



    //--special case?--{
    var wPos = false;
    var specialValue = false;
    for (i=0; i<cubeColors.length; i++) {
        if (cubeColors[i] == 0) {
            wPos = i;
        }
    }

    if (wPos !== false) {
        sorted = cubeColors.filter(side => side!=6).sort();
        if (sorted.length == 3 && sorted[0] === 0 && sorted[1] == 3 && sorted[2] == 5) {
            specialValue = 7
        }
        if (sorted.length == 2 && sorted[0] === 0 && sorted[1] == 5) {
            specialValue = 8
        }
        if (sorted.length == 3 && sorted[0] === 0 && sorted[1] == 2 && sorted[2] == 5) {
            specialValue = 9
        }
        if (sorted.length == 2 && sorted[0] === 0 && sorted[1] == 3) {
            specialValue = 10
        }
        if (sorted.length == 1 && sorted[0] === 0) {
            specialValue = 11
        }
        if (sorted.length == 2 && sorted[0] === 0 && sorted[1] == 2) {
            specialValue = 8
        }
        if (sorted.length == 3 && sorted[0] === 0 && sorted[1] == 3 && sorted[2] == 4) {
            specialValue = 12
        }
        if (sorted.length == 2 && sorted[0] === 0 && sorted[1] == 4) {
            specialValue = 13
        }
        if (sorted.length == 3 && sorted[0] === 0 && sorted[1] == 2 && sorted[2] == 4) {
            specialValue = 13
        }
        if (specialValue !== false) {
            cubeColors[wPos] = specialValue
        }
    }
    //--special case?--}

    s_right = faces[cubeColors[4]];
    s_left = faces[cubeColors[3]];
    s_top = faces[cubeColors[1]];
    s_bottom = faces[cubeColors[2]];
    s_front = faces[cubeColors[0]];
    s_back = faces[cubeColors[5]];

    //MeshBasicMaterial has a side sequence inconvenient for standard cube. so not a for loop but a mapping
    materialArray.push(new THREE.MeshBasicMaterial( { map: loader.load(s_right) } )); //right
    materialArray.push(new THREE.MeshBasicMaterial( { map: loader.load(s_left) } )); //left
    materialArray.push(new THREE.MeshBasicMaterial( { map: loader.load(s_top) } )); //top
    materialArray.push(new THREE.MeshBasicMaterial( { map: loader.load(s_bottom) } )); //bottom
    materialArray.push(new THREE.MeshBasicMaterial( { map: loader.load(s_front) } )); //front
    materialArray.push(new THREE.MeshBasicMaterial( { map: loader.load(s_back) } )); //back

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