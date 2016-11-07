//Based on: https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html

function checkForPointerLock() {
    return 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
}

function initPointerLock() {
    element = document.body;

    clock = new THREE.Clock();

    havePointerLock = checkForPointerLock();

    velocity = new THREE.Vector3();

    moveForward = false;
    moveLeft = false;
    moveBackward = false;
    moveRight = false;
    moveUp = false;
    moveDown = false;

    if (havePointerLock) {
        var pointerlockchange = function (event) {
            if (document.pointerLockElement === element ||
                document.mozPointerLockElement === element ||
                document.webkitPointerLockElement === element) {
                controlsEnabled = true;
                controls.enabled = true;
            } else {
                controls.enabled = false;
            }
        };

        var pointerlockerror = function (event) {
            element.innerHTML = 'PointerLock Error';
        };

        document.addEventListener('pointerlockchange', pointerlockchange, false);
        document.addEventListener('mozpointerlockchange', pointerlockchange, false);
        document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

        document.addEventListener('pointerlockerror', pointerlockerror, false);
        document.addEventListener('mozpointerlockerror', pointerlockerror, false);
        document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

        var requestPointerLock = function(event) {
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
            element.requestPointerLock();
        };

        element.addEventListener('click', requestPointerLock, false);
    } else {
        element.innerHTML = 'Bad browser; No pointer lock';
    }
}

function onKeyDown(e) {
    //console.log(e.keyCode);
    switch (e.keyCode) {
        case 87: // w
            moveForward = true;
            break;
        case 65: // a
            moveLeft = true;
            break;
        case 83: // s
            moveBackward = true;
            break;
        case 68: // d
            moveRight = true;
            break;
        case 32: // space
            moveUp = true;
            break;
        case 16: // shift
            moveDown = true;
            break;
    }
}

function onKeyUp(e) {
    switch(e.keyCode) {
        case 87: // w
            moveForward = false;
            break;
        case 65: // a
            moveLeft = false;
            break;
        case 83: // s
            moveBackward = false;
            break;
        case 68: // d
            moveRight = false;
            break;
        case 32: // space
            moveUp = false;
            break;
        case 16: // shift
            moveDown = false;
            break;
    }
}

function initControls() {
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

}

function updateControls() {
        var delta = clock.getDelta();
        var walkingSpeed = dimX/2; //Increases with bigger land sizes.

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.y -= velocity.y * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        if (moveForward) velocity.z -= walkingSpeed * delta;
        if (moveBackward) velocity.z += walkingSpeed * delta;

        if (moveLeft) velocity.x -= walkingSpeed * delta;
        if (moveRight) velocity.x += walkingSpeed * delta;

        if (moveDown) velocity.y -= walkingSpeed * delta;
        if (moveUp) velocity.y += walkingSpeed * delta;

        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateY(velocity.y * delta);
        controls.getObject().translateZ(velocity.z * delta);

}