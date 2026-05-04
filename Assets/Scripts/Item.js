// Item.js

// @input string itemType = "coin"

var handled = false;
var lane = -1;

function getItemType() {
    return script.itemType;
}

function isHandled() {
    return handled;
}

function markHandled() {
    handled = true;
}

function setLane(newLane) {
    lane = newLane;
}

function getLane() {
    return lane;
}

script.getItemType = getItemType;
script.isHandled = isHandled;
script.markHandled = markHandled;
script.setLane = setLane;
script.getLane = getLane;