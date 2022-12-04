---
name: Bevy, WASM and the Browser
conference: EuroRust
date: "2022-10-13"
lang: en
files:
    - file: "https://www.youtube.com/watch?v=xbh_AeeXwkc"
      name: youtube
---
[Bevy](https://bevyengine.org) is a game engine using an Entity - Component - System architecture and a modern renderer. One of its main goal is to be cross-platform, and that means supporting WASM running in the browser!

We'll see how Bevy uses a few crates to interact with the browser:

* [winit](https://crates.io/crates/winit) to get a canvas and all the interactions
* [wgpu](https://wgpu.rs) to render, in WebGL2 for now, and soon WebGPU
* [web-sys](https://crates.io/crates/web-sys) (and [js-sys](https://crates.io/crates/js-sys)) to handle some (light) multithreading and game assets access

And the limitations, around multithreading, renderer, native library usage and networking.

We'll finish with some patterns on how to interact between a Bevy game and the JS world of the browser.
