function placeCacti(){
    var loader = new THREE.JSONLoader();
    loader.load( "data/cactus.json", function(geometry){
        var texture = THREE.ImageUtils.loadTexture('data/cactusTexture.png');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        var material = new THREE.MeshLambertMaterial({map: texture});
        material.castShadow = true;
        material.receiveShadow = true;

        var i = 0;
        for(var x = 0; x < blocks+1; x++) {
            for (var y = 0; y < blocks + 1; y++) {
                if (x > 0 && y > 0 && x < blocks && y < blocks) {
                    //More segments should not equal more cacti. Handle it here by increasing or decreasing the chances
                    //of a cacti spawning.
                    var segmentFactor = 1;
                    if(blocks < 64){
                        segmentFactor = 2;
                    }
                    else{
                        segmentFactor = 0.25;
                    }
                    if(dimX < 512){
                        segmentFactor += 1;
                    }
                    //"1.00581-0.000030872*dimX" basically means the chance of placing a cactus goes up with increasing
                    //map sizes. Therefore all sizes are somewhat as dense as each other.
                    //Also don't place cacti under water...
                    if(mt.real() > (1.00581-0.000030872*dimX*segmentFactor) && landGeometry.vertices[i].y > waterZ){
                        mesh = new THREE.Mesh(geometry, material);
                        mesh.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI/2));

                        mesh.position.x = landGeometry.vertices[i].x;
                        mesh.position.y = landGeometry.vertices[i].y-1;
                        mesh.position.z = landGeometry.vertices[i].z;

                        mesh.rotateY(3.14);
                        mesh.rotateZ(2*3.14*mt.real());

                        var scaleFactor = mt.real();
                        mesh.scale.x += 1+scaleFactor;
                        mesh.scale.y += 1+scaleFactor;
                        mesh.scale.z += 1+scaleFactor;

                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        scene.add(mesh);
                    }
                }
                i++;
            }
        }
        console.log("update shadows");
        renderer.shadowMap.needsUpdate = true;
    });

}