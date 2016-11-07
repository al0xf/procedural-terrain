function main() {
    getOptions();

    initControls();

    initPointerLock();
    
    initScene();

    placeLand();

    placeSea();

    placeCacti();

    placeLight();

    initPostprocessing();

    animate();
}

function getOptions(){
    //Get all the selected options from index.html and hide from view.
    document.getElementById('GUI').style.display = 'none';

    blocks = document.getElementById('segments').value*1; //More than 128 and things do not end well.
    magnitude = document.getElementById('magnitude').value*1; //Should be <= dimX.
    seed = document.getElementById('seed').value*1;
    dimX = document.getElementById('size').value*1;
    shadowsOn = Boolean(document.getElementById('shadows').checked);
    ssaoOn = Boolean(document.getElementById('ssao').checked);

    console.log("blocks " + blocks);
    console.log("magnitude " + magnitude);
    console.log("seed " + seed);
    console.log("dimXY " + dimX);
    console.log("shadows  " + shadowsOn);
    console.log("ssao " + ssaoOn);
}

function initScene() {
    //Set up scene, camera, and renderer
    scene = new THREE.Scene();
    //scene.fog = new THREE.Fog(0xe6ffff, 900, 1000);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 20000);

    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xe6ffff);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.autoUpdate = false; //Performance hack

    document.body.appendChild(renderer.domElement);

}

function animate() {
    //Render the scene
    requestAnimationFrame(animate);
    updateControls();

    if(ssaoOn){
        // This bit taken from: https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing_ssao.html
        // Render depth into depthRenderTarget
        scene.overrideMaterial = depthMaterial;
        renderer.render( scene, camera, depthRenderTarget, true );
        // Render renderPass and SSAO shaderPass
        scene.overrideMaterial = null;
        effectComposer.render();
    }
    else{
        renderer.render(scene, camera);
    }
}

function placeLand(){
    //Generate a new heightmap an add the vertices to the plane geometry to create the landscape.

    makeDiamond(seed);

    landGeometry = new THREE.PlaneGeometry(dimX, dimX, blocks, blocks);

    //Add vertices to plane geometry and do some extra smoothing.
    var i = 0;
    for(var x = 0; x < blocks + 1; x++) {
        for (var y = 0; y < blocks + 1; y++) {
            if (x > 0 && y > 0 && x < blocks && y < blocks) {
                landGeometry.vertices[i].z = (diamondArray[x][y] + diamondArray[x + 1][y] + diamondArray[x - 1][y] + diamondArray[x][y + 1] + diamondArray[x][y - 1] + diamondArray[x-1][y-1] + diamondArray[x-1][y+1] + diamondArray[x+1][y-1] + diamondArray[x+1][y-1]) / 9;
            }
            else if (x > 0 && x < blocks){
                landGeometry.vertices[i].z = (diamondArray[x][y] + diamondArray[x-1][y] + diamondArray[x+1][y])/3;
            }
            else if (y > 0 && y < blocks){
                landGeometry.vertices[i].z = (diamondArray[x][y] + diamondArray[x][y-1] + diamondArray[x][y+1])/3;
            }
            else if (x == 0 && y == 0){
                landGeometry.vertices[i].z = (diamondArray[x][y] + diamondArray[x+1][y] + diamondArray[x][y+1])/3;
            }
            else if (x == 0 && y == blocks){
                landGeometry.vertices[i].z = (diamondArray[x][y] + diamondArray[x+1][y] + diamondArray[x][y-1])/3;
            }
            else if (x == blocks && y == 0){
                landGeometry.vertices[i].z = (diamondArray[x][y] + diamondArray[x-1][y] + diamondArray[x][y+1])/3;
            }
            else if (x == blocks && y == blocks){
                landGeometry.vertices[i].z = (diamondArray[x][y] + diamondArray[x-1][y] + diamondArray[x][y-1])/3;
            }
            i++;
        }
    }

    landGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI/2));
    var texture = THREE.ImageUtils.loadTexture('data/sand.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(dimX/16, dimX/16);

    var landMaterial = new THREE.MeshLambertMaterial({ color: 0xffffcc, map: texture });

    landMaterial.castShadow = true;
    landMaterial.receiveShadow = true;
    var landPlane = new THREE.Mesh(landGeometry, landMaterial);
    landPlane.castShadow = true; //Slow and ugly...
    landPlane.receiveShadow = true;

    scene.add(landPlane);
}

function placeSea(){
    //Place a flat "sea" plane geometry at the average corner and first diamond height of the land.
    waterGeometry = new THREE.PlaneGeometry(dimX, dimX, 0, 0);
    waterZ = (diamondArray[0][0] + diamondArray[0][blocks] + diamondArray[blocks][0] + diamondArray[blocks][blocks] + diamondArray[blocks/2][blocks/2])/5;
    waterGeometry.vertices[0].z = waterZ;
    waterGeometry.vertices[1].z = waterZ;
    waterGeometry.vertices[2].z = waterZ;
    waterGeometry.vertices[3].z = waterZ;

    waterGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI/2));

    var waterTexture = new THREE.TextureLoader().load( "data/water.jpg" );
    waterTexture.wrapS = THREE.RepeatWrapping;
    waterTexture.wrapT = THREE.RepeatWrapping;
    waterTexture.repeat.set(dimX/16, dimX/16);
    waterMaterial = new THREE.MeshPhongMaterial({map: waterTexture});

    waterPlane = new THREE.Mesh( waterGeometry, waterMaterial );
    scene.add(waterPlane);

    //Place camera starting position in the middle of the newly created land, and above water!
    controls.getObject().position.set(landGeometry.vertices[blocks*blocks/2].x, waterZ+50, landGeometry.vertices[blocks*blocks/2].z);

}

function placeLight(){
    //Add ambient light
    var ambientLight = new THREE.AmbientLight( 0x404040 );
    scene.add( ambientLight );

    //Add a directional light, our sun in this case.
    light = new THREE.DirectionalLight(0xffffff, 1);
    light.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI/2));

    light.position.x = landGeometry.vertices[blocks*blocks/2].x;
    light.position.y =  landGeometry.vertices[blocks*blocks/2].y+5000;
    light.position.z = landGeometry.vertices[blocks*blocks/2].z;

    if(shadowsOn){
        light.castShadow = true;
        light.shadow.mapSize.width = light.shadow.mapSize.height = 8192;
        light.shadow.camera.near = 1;
        light.shadow.camera.far = camera.far;
        light.shadow.camera.fov = 75;
        light.shadow.camera.left = -dimX;
        light.shadow.camera.right = dimX;
        light.shadow.camera.top = dimX;
        light.shadow.camera.bottom = -dimX;
    }

    scene.add(light);
}

