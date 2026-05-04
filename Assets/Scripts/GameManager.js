// GameManager.js

// @input Component.ScriptComponent uiManager
// @input Component.ScriptComponent playerController
// @input Component.ScriptComponent spawner
// @input Component.ScriptComponent animationController

var score = 0;
var lives = 3;
var isPlaying = false;

function startGame() {
    score = 0;
    lives = 3;
    isPlaying = true;

    if (script.playerController && script.playerController.resetPlayer) {
        script.playerController.resetPlayer();
    }

    if (script.spawner && script.spawner.clearSpawnedItems) {
        script.spawner.clearSpawnedItems();
    }

    if (script.uiManager) {
        if (script.uiManager.updateScore) {
            script.uiManager.updateScore(score);
        }

        if (script.uiManager.updateLives) {
            script.uiManager.updateLives(lives);
        }

        if (script.uiManager.showGameplay) {
            script.uiManager.showGameplay();
        }
    }

    if (script.animationController && script.animationController.playRun) {
        script.animationController.playRun();
    }
}

function restartGame() {
    isPlaying = false;

    if (script.spawner && script.spawner.clearSpawnedItems) {
        script.spawner.clearSpawnedItems();
    }

    startGame();
}

function addScore(amount) {
    if (!isPlaying) {
        return;
    }

    score += amount;

    if (script.uiManager && script.uiManager.updateScore) {
        script.uiManager.updateScore(score);
    }
}

function loseLife() {
    if (!isPlaying) {
        return;
    }

    lives -= 1;

    if (script.uiManager && script.uiManager.updateLives) {
        script.uiManager.updateLives(lives);
    }

    if (lives <= 0) {
        gameOver();
    }
}

function gameOver() {
    if (!isPlaying) {
        return;
    }

    isPlaying = false;

    if (script.uiManager && script.uiManager.showGameOver) {
        script.uiManager.showGameOver(score);
    }

    if (script.spawner && script.spawner.clearSpawnedItems) {
        script.spawner.clearSpawnedItems();
    }

    if (script.animationController && script.animationController.playIdle) {
        script.animationController.playIdle();
    }
}

function getIsPlaying() {
    return isPlaying;
}

function getScore() {
    return score;
}

function getLives() {
    return lives;
}

script.startGame = startGame;
script.restartGame = restartGame;
script.addScore = addScore;
script.loseLife = loseLife;
script.gameOver = gameOver;
script.getIsPlaying = getIsPlaying;
script.getScore = getScore;
script.getLives = getLives;

isPlaying = false;

if (script.animationController && script.animationController.playIdle) {
    script.animationController.playIdle();
}