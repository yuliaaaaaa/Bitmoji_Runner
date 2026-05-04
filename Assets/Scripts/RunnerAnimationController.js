// RunnerAnimationController.js

// @input Component.AnimationPlayer animationPlayer
// @input string idleClipName = "Idle"
// @input string runClipName = "Run"

var currentState = "";

function setClipWeights(idleWeight, runWeight) {
    if (!script.animationPlayer) {
        return;
    }

    try {
        var idleClip = script.animationPlayer.getClip(script.idleClipName);
        var runClip = script.animationPlayer.getClip(script.runClipName);

        if (idleClip) {
            idleClip.weight = idleWeight;
        }

        if (runClip) {
            runClip.weight = runWeight;
        }
    } catch (e) {
    }
}

function playClip(clipName) {
    if (!script.animationPlayer) {
        return;
    }

    if (currentState === clipName) {
        return;
    }

    try {
        script.animationPlayer.playClipAt(clipName, 0);
        currentState = clipName;
    } catch (e) {
    }
}

function playIdle() {
    setClipWeights(1.0, 0.0);
    playClip(script.idleClipName);
}

function playRun() {
    setClipWeights(0.0, 1.0);
    playClip(script.runClipName);
}

script.playIdle = playIdle;
script.playRun = playRun;

playIdle();