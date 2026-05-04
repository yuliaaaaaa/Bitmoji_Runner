// UIInputController.js

// @input SceneObject startButton
// @input SceneObject restartButton
// @input Component.ScriptComponent gameManager

function onStartPressed() {
    if (script.gameManager && script.gameManager.startGame) {
        script.gameManager.startGame();
    }
}

function onRestartPressed() {
    if (script.gameManager && script.gameManager.restartGame) {
        script.gameManager.restartGame();
    }
}

function setupButtonTap(buttonObject, callback) {
    if (!buttonObject) {
        return;
    }

    var interactionComponent = buttonObject.getComponent("Component.InteractionComponent");

    if (!interactionComponent) {
        return;
    }

    interactionComponent.onTap.add(callback);
}

setupButtonTap(script.startButton, onStartPressed);
setupButtonTap(script.restartButton, onRestartPressed);