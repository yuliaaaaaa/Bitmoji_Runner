// PlayerCollisionController.js

// @input Physics.ColliderComponent playerCollider
// @input Component.ScriptComponent gameManager
// @input Component.ScriptComponent playerController

// @input float laneHitTolerance = 0.45

function isObjectValid(obj) {
    if (!obj) {
        return false;
    }

    try {
        if (isNull(obj)) {
            return false;
        }
    } catch (e) {
    }

    return true;
}

function safeDestroy(obj) {
    if (!isObjectValid(obj)) {
        return;
    }

    try {
        obj.destroy();
    } catch (e) {
    }
}

function isRunnerItem(component) {
    return (
        component &&
        component.getItemType &&
        component.markHandled &&
        component.isHandled
    );
}

function findRunnerItemOnObject(sceneObject) {
    if (!isObjectValid(sceneObject)) {
        return null;
    }

    var components = null;

    try {
        components = sceneObject.getComponents("Component.ScriptComponent");
    } catch (e) {
        return null;
    }

    for (var i = 0; i < components.length; i++) {
        if (isRunnerItem(components[i])) {
            return components[i];
        }
    }

    return null;
}

function findRunnerItemInParents(sceneObject) {
    var current = sceneObject;

    while (isObjectValid(current)) {
        var item = findRunnerItemOnObject(current);

        if (item) {
            return {
                item: item,
                ownerObject: current
            };
        }

        try {
            current = current.getParent ? current.getParent() : null;
        } catch (e) {
            current = null;
        }
    }

    return null;
}

function getObjectWorldX(sceneObject) {
    if (!isObjectValid(sceneObject)) {
        return 0.0;
    }

    try {
        return sceneObject.getTransform().getWorldPosition().x;
    } catch (e) {
    }

    try {
        return sceneObject.getTransform().getLocalPosition().x;
    } catch (e2) {
    }

    return 0.0;
}

function isSamePhysicalLane(ownerObject) {
    if (!script.playerCollider || !isObjectValid(ownerObject)) {
        return false;
    }

    var playerObject = script.playerCollider.getSceneObject();

    if (!isObjectValid(playerObject)) {
        return false;
    }

    var playerX = getObjectWorldX(playerObject);
    var itemX = getObjectWorldX(ownerObject);

    return Math.abs(playerX - itemX) <= script.laneHitTolerance;
}

function isGamePlaying() {
    return (
        script.gameManager &&
        script.gameManager.getIsPlaying &&
        script.gameManager.getIsPlaying()
    );
}

function isPlayerJumping() {
    return (
        script.playerController &&
        script.playerController.getIsJumping &&
        script.playerController.getIsJumping()
    );
}

function handleItem(overlappedObject) {
    if (!isObjectValid(overlappedObject)) {
        return;
    }

    var found = findRunnerItemInParents(overlappedObject);

    if (!found || !found.item || !isObjectValid(found.ownerObject)) {
        return;
    }

    if (!isGamePlaying()) {
        return;
    }

    var item = found.item;
    var ownerObject = found.ownerObject;

    if (item.isHandled()) {
        return;
    }

    if (!isSamePhysicalLane(ownerObject)) {
        return;
    }

    var type = item.getItemType();

    item.markHandled();
    safeDestroy(ownerObject);

    if (type === "coin") {
        if (script.gameManager && script.gameManager.addScore) {
            script.gameManager.addScore(10);
        }

        return;
    }

    if (type === "obstacle") {
        if (script.gameManager && script.gameManager.loseLife) {
            script.gameManager.loseLife();
        }

        return;
    }

    if (type === "lowObstacle") {
        if (!isPlayerJumping()) {
            if (script.gameManager && script.gameManager.loseLife) {
                script.gameManager.loseLife();
            }
        }

        return;
    }
}

function getOtherObjectFromOverlapEvent(eventData) {
    if (eventData && eventData.overlap && eventData.overlap.collider) {
        try {
            return eventData.overlap.collider.getSceneObject();
        } catch (e) {
            return null;
        }
    }

    if (eventData && eventData.collider) {
        try {
            return eventData.collider.getSceneObject();
        } catch (e2) {
            return null;
        }
    }

    return null;
}

function onOverlapEnter(eventData) {
    var otherObject = getOtherObjectFromOverlapEvent(eventData);

    if (!isObjectValid(otherObject)) {
        return;
    }

    handleItem(otherObject);
}

function setupCollider() {
    if (!script.playerCollider) {
        return;
    }

    if (script.playerCollider.overlapFilter) {
        script.playerCollider.overlapFilter.includeStatic = true;
        script.playerCollider.overlapFilter.includeDynamic = true;
        script.playerCollider.overlapFilter.includeIntangible = true;
    }

    script.playerCollider.onOverlapEnter.add(onOverlapEnter);
}

setupCollider();