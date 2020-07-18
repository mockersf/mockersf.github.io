---
title:  "Getting started with Godot and Rust"
categories: [development]
tags: [rust, godot, github, clever-cloud]
comments: true
---
Making it safer and setting up CI with Github Actions

## Signal binding to make Godot safer in Rust

As demoed in [Signals example of godot-rust](https://github.com/GodotNativeTools/godot-rust/blob/master/examples/signals/src/lib.rs#L78), the way to connect a method to a signal is:
```rust
emitter
    .connect(
        GodotString::from_str("tick"),
        Some(*object),
        GodotString::from_str("notify"),
        VariantArray::new(),
        0,
    )
    .unwrap();
```
With `tick` being the name of the signal, and `notify` the name of the function to call for this signal. As those two are strings, nothing check that the signal or the function actually exist.

### Available signals in an `enum`

I built an enum of the signals I'm using from Godot, that can be converted into a `GodotString`:
```rust
enum Signal {
    ScreenExited,
    BodyExited,
}
impl From<Signal> for GodotString {
    fn from(signal: Signal) -> Self {
        match signal {
            Signal::ScreenExited => "screen_exited".into(),
            Signal::BodyExited => "body_exited".into(),
        }
    }
}
```
This does not stop me from making a typo, but at least it will be the same everywhere I will use a signal, which will help spot an issue.

### Checking that function provided actually exists

For the function name, I used a macro that will fail to compile if the function does not exist:
```rust
macro_rules! stringify_fn {
    ($owner:ident, $fn:ident) => { {
        let _ = $owner::$fn;
        stringify!($fn).into()
    } };
}
```
This does not catch all errors possible, but it helps a lot with the typos.

Connecting a signal becomes then:
```rust
emitter
    .connect(
        Signal::Tick.into(),
        Some(*object),
        stringify_fn!(Self, notify),
        VariantArray::new(),
        0,
    )
    .unwrap();
```

Remaining sources of possible errors:
* The target funciton has to be available on the object specified. This means that the object must have a GDNative script written in rust that is using the struct targeted
* The parameters passed are not checked at compile time but at runtime

## CI, nightly builds, releases

### Running tests on every push

Like any Rust project, build, test, format and clippy can be run on every push in a github workflow.

* A build matrix to target all platforms (ubuntu, macos, windows)
* Using [`actions-rs/toolchain`](https://github.com/actions-rs/toolchain) to install target rust version (in this case, stable)
* On windows, an additional step is needed to install llvm which is a dependency of `gdnative`
* Finally, with [`cargo-make`](https://github.com/sagiegurari/cargo-make) and [`davidB/rust-cargo-make`](https://github.com/davidB/rust-cargo-make), the project can easily be built. With a makefile, complex behaviour can be shared with anyone working on the project and with CI

### Building nightly releases

My goal with a nightly build is to build an executable for every target platform if tests pass and there was changes on the code. Those executables should be easily available to download. For now, the only target is MacOS, as I don't really have the means to test that the release is correct on other platforms.

Here is the [workflow](https://github.com/mockersf/Komarowii/blob/691b55033fb2e619438d49e9b38b3c3d6145bc2c/.github/workflows/nightly.yaml) to do that:
* Run tests (on ubuntu only).
* Retrieve the latest build commit hash and make it available for other jobs as an artifact. This is saved at the end of the release in a public S3.
* If there was commit since last build, build the Rust library in release mode for MacOS, and save it as an artifact.
* If tests and release build were successful export the game based on the [`export_presets.cfg`](https://github.com/mockersf/Komarowii/blob/1599988eb8cf41ae1b96bf7561f9f0a953fb9427/export_presets.cfg) file, using the [`firebelley/godot-export`](https://github.com/firebelley/godot-export) github action. The macOS export is a zip with a permissions error that needs to be fixed.
* Unzip the export, fix the permissions issue and then create a dmg.
* Finally, prepare to upload to an S3 bucket the dmg and the commit sha that was built. I used [clever cloud Cellar](https://www.clever-cloud.com/doc/addons/cellar/) which offer a S3 compatible API. Then the github page for the project with the new URL is built and deployed: [https://mockersf.github.io/Komarowii/](https://mockersf.github.io/Komarowii/)
