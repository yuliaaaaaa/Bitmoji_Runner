// Spawner.js

// @input Asset.ObjectPrefab obstaclePrefab
// @input Asset.ObjectPrefab lowObstaclePrefab
// @input Asset.ObjectPrefab coinPrefab

// @input SceneObject obstaclesRoot
// @input SceneObject coinsRoot

// @input Component.ScriptComponent gameManager

// @input float leftLaneX = -1.0
// @input float centerLaneX = 0.0
// @input float rightLaneX = 1.0

// @input float spawnY = 0.0
// @input float lowObstacleSpawnY = -0.5
// @input float spawnZ = -12.0
// @input float despawnZ = 55.0

// @input float baseSpeed = 5.0
// @input bool difficultyEnabled = true
// @input float speedIncreasePerSecond = 0.08
// @input float maxSpeed = 12.0

// @input float baseSpawnInterval = 1.5
// @input float spawnIntervalDecreasePerSecond = 0.02
// @input float minSpawnInterval = 0.65

// @input float coinChance = 0.45
// @input float lowObstacleChance = 0.35

// @input vec3 obstacleScale = {1.0, 1.0, 1.0}
// @input vec3 lowObstacleScale = {1.0, 1.0, 1.0}
// @input vec3 coinScale = {1.0, 1.0, 1.0}

// @input vec3 obstacleRotation = {0.0, 0.0, 0.0}
// @input vec3 lowObstacleRotation = {0.0, 0.0, 0.0}
// @input vec3 coinRotation = {0.0, 0.0, 0.0}

// @input bool rotateCoins = true
// @input float coinSpinSpeed = 4.0

var spawnedItems = [];
var spawnTimer = 0.0;
var elapsedTime = 0.0;
var wasPlaying = false;

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180.0;
}

function rotationFromDegrees(rotationDegrees) {
    return quat.fromEulerAngles(
        degreesToRadians(rotationDegrees.x),
        degreesToRadians(rotationDegrees.y),
        degreesToRadians(rotationDegrees.z)
    );
}

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

function getLaneX(lane) {
    if (lane === 0) {
        return script.leftLaneX;
    }

    if (lane === 1) {
        return script.centerLaneX;
    }

    return script.rightLaneX;
}

function getRandomLane() {
    return Math.floor(Math.random() * 3);
}

function getCurrentSpeed() {
    if (!script.difficultyEnabled) {
        return script.baseSpeed;
    }

    var speed = script.baseSpeed + elapsedTime * script.speedIncreasePerSecond;
    return Math.min(speed, script.maxSpeed);
}

function getCurrentSpawnInterval() {
    if (!script.difficultyEnabled) {
        return script.baseSpawnInterval;
    }

    var interval = script.baseSpawnInterval - elapsedTime * script.spawnIntervalDecreasePerSecond;
    return Math.max(script.minSpawnInterval, interval);
}

function instantiatePrefab(prefab, parentObject) {
    if (!prefab || !parentObject) {
        return null;
    }

    return prefab.instantiate(parentObject);
}

function findRunnerItemComponent(sceneObject) {
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
        var component = components[i];

        if (
            component &&
            component.setLane &&
            component.getLane &&
            component.getItemType
        ) {
            return component;
        }
    }

    return null;
}

function setupItemLane(obj, lane) {
    var item = findRunnerItemComponent(obj);

    if (item) {
        item.setLane(lane);
    }
}

function setupVisualTransform(obj, type) {
    if (!isObjectValid(obj)) {
        return;
    }

    var tr = obj.getTransform();

    if (type === "coin") {
        tr.setLocalScale(script.coinScale);
        tr.setLocalRotation(rotationFromDegrees(script.coinRotation));
        return;
    }

    if (type === "lowObstacle") {
        tr.setLocalScale(script.lowObstacleScale);
        tr.setLocalRotation(rotationFromDegrees(script.lowObstacleRotation));
        return;
    }

    tr.setLocalScale(script.obstacleScale);
    tr.setLocalRotation(rotationFromDegrees(script.obstacleRotation));
}

function getSpawnYForType(type) {
    if (type === "lowObstacle") {
        return script.lowObstacleSpawnY;
    }

    return script.spawnY;
}

function spawnItem() {
    var lane = getRandomLane();
    var x = getLaneX(lane);

    var spawnCoin = Math.random() < script.coinChance;

    var obj = null;
    var type = "";

    if (spawnCoin) {
        obj = instantiatePrefab(script.coinPrefab, script.coinsRoot);
        type = "coin";
    } else {
        var spawnLowObstacle = Math.random() < script.lowObstacleChance;

        if (spawnLowObstacle && script.lowObstaclePrefab) {
            obj = instantiatePrefab(script.lowObstaclePrefab, script.obstaclesRoot);
            type = "lowObstacle";
        } else {
            obj = instantiatePrefab(script.obstaclePrefab, script.obstaclesRoot);
            type = "obstacle";
        }
    }

    if (!isObjectValid(obj)) {
        return;
    }

    obj.enabled = true;

    var tr = obj.getTransform();
    var y = getSpawnYForType(type);

    tr.setLocalPosition(new vec3(x, y, script.spawnZ));

    setupVisualTransform(obj, type);
    setupItemLane(obj, lane);

    spawnedItems.push({
        obj: obj,
        type: type
    });
}

function destroyItem(index) {
    if (index < 0 || index >= spawnedItems.length) {
        return;
    }

    var item = spawnedItems[index];

    if (item && isObjectValid(item.obj)) {
        item.obj.destroy();
    }

    spawnedItems.splice(index, 1);
}

function updateItems() {
    var speed = getCurrentSpeed();
    var dt = getDeltaTime();

    for (var i = spawnedItems.length - 1; i >= 0; i--) {
        var item = spawnedItems[i];

        if (!item || !isObjectValid(item.obj)) {
            spawnedItems.splice(i, 1);
            continue;
        }

        var tr = null;

        try {
            tr = item.obj.getTransform();
        } catch (e) {
            spawnedItems.splice(i, 1);
            continue;
        }

        if (!tr) {
            spawnedItems.splice(i, 1);
            continue;
        }

        var pos = tr.getLocalPosition();

        pos.z += speed * dt;
        tr.setLocalPosition(pos);

        if (item.type === "coin" && script.rotateCoins) {
            var baseRot = script.coinRotation;

            tr.setLocalRotation(
                quat.fromEulerAngles(
                    degreesToRadians(baseRot.x),
                    degreesToRadians(baseRot.y) + getTime() * script.coinSpinSpeed,
                    degreesToRadians(baseRot.z)
                )
            );
        }

        if (pos.z > script.despawnZ) {
            destroyItem(i);
        }
    }
}

function clearSpawnedItems() {
    for (var i = spawnedItems.length - 1; i >= 0; i--) {
        var item = spawnedItems[i];

        if (item && isObjectValid(item.obj)) {
            item.obj.destroy();
        }
    }

    spawnedItems = [];
    spawnTimer = 0.0;
    elapsedTime = 0.0;
}

function onUpdate() {
    if (!script.gameManager || !script.gameManager.getIsPlaying) {
        return;
    }

    var isPlaying = script.gameManager.getIsPlaying();

    if (isPlaying && !wasPlaying) {
        clearSpawnedItems();
    }

    wasPlaying = isPlaying;

    if (!isPlaying) {
        return;
    }

    elapsedTime += getDeltaTime();
    spawnTimer += getDeltaTime();

    if (spawnTimer >= getCurrentSpawnInterval()) {
        spawnTimer = 0.0;
        spawnItem();
    }

    updateItems();
}

script.createEvent("UpdateEvent").bind(onUpdate);

script.clearSpawnedItems = clearSpawnedItems;
script.spawnItem = spawnItem;
script.getCurrentSpeed = getCurrentSpeed;
script.getCurrentSpawnInterval = getCurrentSpawnInterval;