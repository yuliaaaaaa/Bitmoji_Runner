// PlayerController.js

// @input SceneObject player
// @input Component.ScriptComponent gameManager

// @input float leftLaneX = -1.0
// @input float centerLaneX = 0.0
// @input float rightLaneX = 1.0
// @input float moveSpeed = 8.0

// @input float jumpDuration = 0.6
// @input float jumpHeight = 0.45

var currentLane = 1;
var targetX = script.centerLaneX;

var startY = 0.0;
var startZ = 0.0;

var isJumping = false;
var jumpTimer = 0.0;
var initialized = false;

function initializePlayerPosition() {
    if (!script.player || initialized) {
        return;
    }

    var tr = script.player.getTransform();
    var pos = tr.getLocalPosition();

    startY = pos.y;
    startZ = pos.z;

    initialized = true;
}

function resetPlayer() {
    initializePlayerPosition();

    currentLane = 1;
    targetX = script.centerLaneX;

    isJumping = false;
    jumpTimer = 0.0;

    if (script.player) {
        var tr = script.player.getTransform();
        tr.setLocalPosition(new vec3(targetX, startY, startZ));
    }
}

function updateTargetX() {
    if (currentLane === 0) {
        targetX = script.leftLaneX;
    } else if (currentLane === 1) {
        targetX = script.centerLaneX;
    } else {
        targetX = script.rightLaneX;
    }
}

function canMove() {
    return script.gameManager &&
        script.gameManager.getIsPlaying &&
        script.gameManager.getIsPlaying();
}

function moveLeft() {
    if (!canMove()) {
        return;
    }

    if (currentLane > 0) {
        currentLane -= 1;
        updateTargetX();
    }
}

function moveRight() {
    if (!canMove()) {
        return;
    }

    if (currentLane < 2) {
        currentLane += 1;
        updateTargetX();
    }
}

function jump() {
    if (!canMove() || isJumping) {
        return;
    }

    isJumping = true;
    jumpTimer = 0.0;
}

function getJumpOffset() {
    if (!isJumping) {
        return 0.0;
    }

    jumpTimer += getDeltaTime();

    var t = jumpTimer / script.jumpDuration;

    if (t >= 1.0) {
        isJumping = false;
        jumpTimer = 0.0;
        return 0.0;
    }

    return Math.sin(t * Math.PI) * script.jumpHeight;
}

function updatePlayerPosition() {
    if (!script.player) {
        return;
    }

    initializePlayerPosition();

    var tr = script.player.getTransform();
    var currentPos = tr.getLocalPosition();

    var newX = MathUtils.lerp(currentPos.x, targetX, getDeltaTime() * script.moveSpeed);
    var newY = startY + getJumpOffset();

    tr.setLocalPosition(new vec3(newX, newY, startZ));
}

function getCurrentLane() {
    return currentLane;
}

function getIsJumping() {
    return isJumping;
}

function onUpdate() {
    updatePlayerPosition();
}

script.createEvent("UpdateEvent").bind(onUpdate);

script.moveLeft = moveLeft;
script.moveRight = moveRight;
script.jump = jump;
script.resetPlayer = resetPlayer;
script.getCurrentLane = getCurrentLane;
script.getIsJumping = getIsJumping;

initializePlayerPosition();