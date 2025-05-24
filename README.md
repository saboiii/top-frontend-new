# CCDS TOP Official Website

A web portal for NTU CCDS TOP orientation camp, designed to welcome incoming freshmen with an interactive and visually engaging experience. This year's theme is **The Hunger Games**, featuring a custom 3D Mockingjay emblem rendered in real time. The site is built for both desktop and mobile, with a focus on performance and immersive graphics.

## Tech Stack

- **Next.js 15**
- **React 19**
- **Three.js**
- **React-Three Fiber and Drei**
- **Tailwind CSS**
- **Framer Motion** 
- **gltfpack Compression**

## Features

- **3D Mockingjay Emblem**: Interactive, animated particle mesh using custom GLSL shaders with custom loader with smooth progress animation.
- **Performance Optimizations**:
  - gltfpack-compressed GLTF model for fast asset delivery.
  - Dynamic device pixel ratio (DPR) adjustment based on real-time performance.
  - Efficient use of draw calls (1 call per frame) and minimal geometry for high FPS.
- **Responsive Design**: Adapts camera and layout for mobile and desktop.
- **Performance Metrics**:
  - **Load Time**: ~728 ms on desktop, ~13.5s on 4x CPU throttling + slow 4G.
  - **GPU**: ~1.95 ms/frame on Apple M2
  - **CPU**: ~0.90 ms/frame on Apple M2
- **Custom Shaders**: Mouse movement and velocity affect particle displacement for an interactive feel.
- **Accessible Navigation**: Responsive navbar and dropdown menus for all devices.
- **Error Handling**: Graceful fallback UI for loading or rendering errors.

## Authors

- [@saboiii](https://www.github.com/saboiii)
