# Bitmoji_Runner

<img width="446" height="733" alt="image" src="https://github.com/user-attachments/assets/177bd09a-b57f-4619-9318-cb55ebb8295a" />

<img width="443" height="752" alt="image" src="https://github.com/user-attachments/assets/c6ad6d44-17c5-4df1-97d7-12799f74041a" />

<img width="437" height="748" alt="image" src="https://github.com/user-attachments/assets/f99e3337-cabc-4736-a4d0-f555baa7fc56" />

**Bitmoji Runner** is an endless runner prototype built in **Lens Studio** as a test task.

The player controls a Bitmoji character, switches between three lanes, collects coins, avoids obstacles, and tries to survive as long as possible.

## Features

- Bitmoji player character
- 3-lane movement: left / center / right
- Swipe controls:
  - swipe left — move to the left lane
  - swipe right — move to the right lane
  - swipe up — jump
  - swipe down — restart the game during gameplay
- Coins that increase the score
- Obstacles that decrease lives
- Low obstacles that can be jumped over
- 3 lives system
- Game Over after losing all lives
- Restart without leaving the Lens
- In-game restart using swipe down
- Game Over restart button
- Score and lives UI
- Increasing difficulty over time: object speed increases and spawn interval decreases
- Idle / Run Bitmoji animations
- Physics Collider / overlap-based interactions

## Gameplay Logic

After pressing **START**, the game begins: the score and lives are reset, the Bitmoji switches to the Run animation, and coins and obstacles start moving toward the player.

Coins increase the score. Regular obstacles reduce lives. Low obstacles can be avoided by jumping with swipe up.

During gameplay, the player can restart the run at any moment by swiping down. This resets the score, restores lives, clears spawned objects, returns the player to the center lane, and starts the game again without leaving the Lens.

After all lives are lost, the Game Over screen appears with a **Restart** button. Pressing it starts a new run with reset score, lives, player position, and difficulty.

## Controls

- **Swipe left** — move to the left lane
- **Swipe right** — move to the right lane
- **Swipe up** — jump
- **Swipe down** — restart during gameplay
- **Start button** — start the game from the start screen
- **Restart button** — restart from the Game Over screen

## Restart System

The project supports restart without exiting the Lens.

There are two restart options:

1. **Swipe down during gameplay**  
   Allows the player to immediately restart the current run while the game is still active.

2. **Restart button on the Game Over screen**  
   Allows the player to start again after losing all lives.

On restart, the game resets:

- score to 0
- lives to 3
- player position to the center lane
- jump state
- spawned coins and obstacles
- difficulty timer
- spawn timer

## Difficulty

The game becomes harder over time. The object movement speed gradually increases, while the spawn interval gradually decreases. This creates a simple endless runner difficulty curve.

## Technical Notes

The project is structured into separate scripts for cleaner logic:

- `GameManager.js` — controls game state, score, lives, start, restart, and game over
- `PlayerController.js` — controls lane movement and jumping
- `SwipeInputController.js` — handles swipe input, including swipe down restart
- `Spawner.js` — spawns and moves coins and obstacles
- `Item.js` — stores item type and handled state
- `PlayerCollisionController.js` — handles overlap-based interactions
- `UIManager.js` — controls start, gameplay, and game over UI
- `UIInputController.js` — handles Start and Game Over Restart buttons
- `RunnerAnimationController.js` — switches between Idle and Run animations
```text
Swipe Left  → move to the left lane
Swipe Right → move to the right lane
Swipe Up    → jump
