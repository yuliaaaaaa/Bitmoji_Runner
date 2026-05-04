# Bitmoji_Runner
<img width="437" height="748" alt="image" src="https://github.com/user-attachments/assets/f99e3337-cabc-4736-a4d0-f555baa7fc56" />

<img width="435" height="697" alt="image" src="https://github.com/user-attachments/assets/1b210470-09ab-4b33-8971-871364930b2b" />

**Bitmoji Runner** is an endless runner prototype built in **Lens Studio** as a test task.

The player controls a Bitmoji character, switches between three lanes, collects coins, avoids obstacles, and tries to survive as long as possible.

## Features

- Bitmoji player character
- 3-lane movement: left / center / right
- Swipe controls:
  - swipe left — move to the left lane
  - swipe right — move to the right lane
  - swipe up — jump
- Coins that increase the score
- Obstacles that decrease lives
- Low obstacles that can be jumped over
- 3 lives system
- Game Over after losing all lives
- Restart without leaving the Lens
- Score and lives UI
- Increasing difficulty over time: object speed increases and spawn interval decreases
- Idle / Run Bitmoji animations
- Physics Collider / overlap-based interactions

## Gameplay Logic

After pressing **START**, the game begins: score and lives are reset, Bitmoji switches to Run animation, and coins and obstacles start moving toward the player.

Coins increase the score. Regular obstacles reduce lives. Low obstacles can be avoided by jumping with swipe up.

After all lives are lost, the Game Over screen appears with a restart option.

## Controls

```text
Swipe Left  → move to the left lane
Swipe Right → move to the right lane
Swipe Up    → jump
