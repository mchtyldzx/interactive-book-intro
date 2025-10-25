# 3D Interactive Book Intro Animation

This is a portfolio showcase project demonstrating web animation techniques. It features a vintage-style book floating in 3D space with cinematic lighting, interactive parallax effects, and smooth GSAP transitions.

[![Live Page](https://img.shields.io/badge/page-live-orange?style=for-the-badge)](https://mchtyldzx.github.io/interactive-book-intro)
[![Three.js](https://img.shields.io/badge/Three.js-r128-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12.5-88CE02?style=for-the-badge)](https://greensock.com/gsap/)

![Project Preview](https://github.com/user-attachments/assets/7c7226fa-1e6f-4361-8d53-aa19105d4135)

## Features

- Procedurally generated 3D book model
- Interactive mouse parallax effects
- Dynamic golden lighting system
- Smooth GSAP animations
- Floating particle system
- Mobile touch support


## How It Works

The book is built entirely with Three.js geometry - no external 3D models. It uses:
- PBR materials for realistic lighting
- Multiple point lights for cinematic atmosphere
- GSAP for smooth entrance and exit animations
- RequestAnimationFrame for 60fps performance
- Mouse tracking for parallax rotation



## Quick Start

```bash
# Clone the repo
git clone https://github.com/mchtyldzx/interactive-book-intro.git
cd interactive-book-intro

# Start a local server
python -m http.server 8000

# Open http://localhost:8000
```


## Customization

Change book colors in `main.js`:
```javascript
const coverMaterial = new THREE.MeshStandardMaterial({
    color: 0x6b4423,  // Change this
    roughness: 0.8,
    metalness: 0.1
});
```

Adjust animation speed in `main.js`:
```javascript
book.position.y = Math.sin(time * 0.5) * 0.3;
//                              ^^^     ^^^
//                           speed   amplitude
```

 Inspired by website intros like [ImaginaryOnes](https://imaginaryones.com/).
