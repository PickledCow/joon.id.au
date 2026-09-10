---
title: "Basic Funny Glowy Touhou ReShade Setup"
date: "2022-12-20"
updated: "2026-09-11"
categories:
  - "touhou"
  - "guide"
coverImage: "https://files.joon.id.au/public/touhou-shader/thumb.png"
coverWidth: 200
coverHeight: 125
excerpt: My eyes!
---

Do you want to have your game be covered in bloom top to bottom to the point you can barely play the game? No? Well too bad because that's what this guide is for.

## Quick Access

[Gallery](#gallery)

[Reshade](#reshade)

[Additional Setup](#additional-setup)

[In-game Setup](#in-game-setup)

[Fine Tuning](#fine-tuning)

[Finding Bounds for Fangames](#finding-bounds-for-fangames)

[Disable/Uninstall](#disableuninstall)

## Gallery

| My | Eyes |
| - | - |
| ![Clownpiece](https://files.joon.id.au/public/touhou-shader/clownpiece.png){width=100%} | ![Doremy](https://files.joon.id.au/public/touhou-shader/doremy.png){width=100%} |
| ![Junko](https://files.joon.id.au/public/touhou-shader/junko.png){width=100%} | ![Satori](https://files.joon.id.au/public/touhou-shader/satori.png){width=100%} |
| ![Megumu](https://files.joon.id.au/public/touhou-shader/megumu.png){width=100%} | ![Moyomo](https://files.joon.id.au/public/touhou-shader/moyomo.png){width=100%} |
| ![Byakuren](https://files.joon.id.au/public/touhou-shader/byakuren.png){width=100%} | ![Shou](https://files.joon.id.au/public/touhou-shader/shou.png){width=100%} |

## ReShade

You first need to get [ReShade](https://reshade.me/) for any of this to work. Go and download it somewhere you'll remember, maybe next to your Touhou games.

ReShade works on a per-game basis, so yes you will have to likely repeat this multiple times.

To apply ReShade, first run ReShade, this will bring up the following window (or something similar).
![Epic](https://files.joon.id.au/public/touhou-shader/reshade-setup.png)
Click on ``Browse`` and find the executable of your touhou game. (**IMPORTANT:** The executable **must** be the base game's ``.exe``, not a thcrap shortcut or ``vpatch.exe``; the file is called ``th××.exe`` or just ``th××`` if you don't have file extensions as visible)

The graphics API will usually be preselected to DirectX 9, which is what most touhou games use.  If you're trying to apply it to a fangame then this may not be correct, but can be fixed later by just applying ReShade to the game again.

Press ``Next`` until you reach this page, you **must** have the ``qUINT`` package selected, other packages are optional and you may add them too if you want to play around with them.
![aaaa](https://files.joon.id.au/public/touhou-shader/reshade-setup-2.png)

Afterwards just keep pressing ``Next`` until it is installed.

## Additional Setup

Before starting the game up, download [this zip file](https://files.joon.id.au/public/touhou-shader/touhou-shader.zip) and extract the contents of either ``EoSD`` or ``Main`` in the root directory of the game (the same folder as where the game's ``.exe`` is).

Touhou 6 to Touhou 8 will also need [d3d8.dll](https://github.com/crosire/d3d8to9/releases) to run, and put into the root directory of the game.  They tend to have some issues though so you will have to make your own adjustments. Future revisions may have better presets for these games.
Touhou 9's split screen is currently unsupported, best you'll be able to do for now is stretch out the bounds over both fields.

## In-game Setup

If all is correct you should see that bar at the top of your game.
![Hurrah](https://files.joon.id.au/public/touhou-shader/in-game-intro.png){width=66%}

This is now technically ready to play, but if you want to tweak the visuals, continue to the next step

## Fine-tuning

Pressing the ``Home`` key will bring this menu up.  This is where you can make changes to the settings.  Messing with the settings to find what *you* prefer is recommended.
![Go Wild](https://files.joon.id.au/public/touhou-shader/fine-tuning.png){width=66%}

The first 3 "Bloom" values are worth touching the most in my opinion, lower Saturation (third one) if you feel it's too vibrant.

The settings are stored in ``ReShadePreset.ini`` and if you find values you like, you can just copy this file over to the other games.

## Finding Bounds for Fangames

Many fangames do not have the same playfield size or position as ZUN's games, so you will need to define custom bounds to the shader.  You can do this very easily with common image manipulation tools, even Paint if that's all you have.  I'll be demonstrating using Paint for better accessibility.

The order of the bounds in the ReShade shader is ``minX``, ``maxX``, ``minY``, ``maxY``.  Remember to tick the box for custom bounds or it will not do anything.

Note that this works far better if you can run the game at native resolution in windowed mode and no desktop scaling.  
![Desktop Scaling can make the pixels boundaries unclear](https://files.joon.id.au/public/touhou-shader/fangame.png){width=66%}

While in-game take a screenshot of the game, I personally use ``Alt+PrtSc`` and ``Ctrl+V`` in the image editor but all methods are fine.  
In the image editor, zoom into the top corner of the screenshot and measure the distance between the top left corner of the screenshot (exclude titlebar if that was included) and the top left of the playfield.
![Paint](https://files.joon.id.au/public/touhou-shader/funny-paint.png){width=75%}

In Paint you can see the size of the selection on the bottom left of the screen, here it's 96 × 48.  We then want to divide these by the window size, which is also shown in the screenshot, for us it's 1920 × 1440, so our final values are 96 / 1920 = 0.05 and 48 / 1440 = 0.03333.
Repeat this for the bottom right corner of the playfield, also starting from the top left.  

Alternatively you can start from the bottom right of the window and at the end subtract that value from 1, e.g. if from the right side of the screen to the right side of the playfield is 672 pixels and the window is 1920 px wide, you can do 1 - 672 / 1920 = 0.65 as our final maximum X bound.
![Right Edge](https://files.joon.id.au/public/touhou-shader/funny-paint-2.png){width=75%}

## Disable/Uninstall

If you wish to disable the shader, you can just untick the ``Bloom`` option from the list.

If you wish to uninstall ReShade from the game run ReShade again on the game.
