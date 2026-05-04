// SwipeInputController.js

// @input SceneObject swipeArea
// @input Component.ScriptComponent playerController
// @input Component.ScriptComponent gameManager

var startTouchPos = null;
var lastTouchPos = null;
var minSwipeDistance = 0.06;

function getTouchPosition(eventData) {
    if (!eventData) {
        return null;
    }

    if (eventData.position) {
        return eventData.position;
    }

    if (eventData.getTouchPosition) {
        return eventData.getTouchPosition();
    }

    return null;
}

function isGamePlaying() {
    return (
        script.gameManager &&
        script.gameManager.getIsPlaying &&
        script.gameManager.getIsPlaying()
    );
}

function onTouchStart(eventData) {
    startTouchPos = getTouchPosition(eventData);
    lastTouchPos = startTouchPos;
}

function onTouchMove(eventData) {
    var pos = getTouchPosition(eventData);

    if (pos) {
        lastTouchPos = pos;
    }
}

function onTouchEnd(eventData) {
    if (!startTouchPos) {
        return;
    }

    if (!isGamePlaying()) {
        startTouchPos = null;
        lastTouchPos = null;
        return;
    }

    var endTouchPos = getTouchPosition(eventData);

    if (!endTouchPos) {
        endTouchPos = lastTouchPos;
    }

    if (!endTouchPos) {
        startTouchPos = null;
        lastTouchPos = null;
        return;
    }

    var deltaX = endTouchPos.x - startTouchPos.x;
    var deltaY = endTouchPos.y - startTouchPos.y;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
            if (script.playerController && script.playerController.moveRight) {
                script.playerController.moveRight();
            }
        } else {
            if (script.playerController && script.playerController.moveLeft) {
                script.playerController.moveLeft();
            }
        }
    } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minSwipeDistance) {
        if (script.playerController && script.playerController.jump) {
            script.playerController.jump();
        }
    }

    startTouchPos = null;
    lastTouchPos = null;
}

function setupSwipeArea() {
    if (!script.swipeArea) {
        return;
    }

    var interaction = script.swipeArea.getComponent("Component.InteractionComponent");

    if (!interaction) {
        return;
    }

    interaction.onTouchStart.add(onTouchStart);

    if (interaction.onTouchMove) {
        interaction.onTouchMove.add(onTouchMove);
    }

    interaction.onTouchEnd.add(onTouchEnd);
}

setupSwipeArea();