// UIManager.js

// @input SceneObject startScreen
// @input SceneObject gameplayUI
// @input SceneObject gameOverUI

// @input Component.Text scoreText
// @input Component.Text livesText
// @input Component.Text finalScoreText

function setObjectEnabled(obj, enabled) {
    if (obj) {
        obj.enabled = enabled;
    }
}

function showStart() {
    setObjectEnabled(script.startScreen, true);
    setObjectEnabled(script.gameplayUI, false);
    setObjectEnabled(script.gameOverUI, false);
}

function showGameplay() {
    setObjectEnabled(script.startScreen, false);
    setObjectEnabled(script.gameplayUI, true);
    setObjectEnabled(script.gameOverUI, false);
}

function showGameOver(finalScore) {
    setObjectEnabled(script.startScreen, false);
    setObjectEnabled(script.gameplayUI, false);
    setObjectEnabled(script.gameOverUI, true);

    if (script.finalScoreText) {
        script.finalScoreText.text = "Final Score: " + finalScore;
    }
}

function updateScore(score) {
    if (script.scoreText) {
        script.scoreText.text = "Score: " + score;
    }
}

function updateLives(lives) {
    if (script.livesText) {
        script.livesText.text = "Lives: " + lives;
    }
}

script.showStart = showStart;
script.showGameplay = showGameplay;
script.showGameOver = showGameOver;
script.updateScore = updateScore;
script.updateLives = updateLives;

showStart();