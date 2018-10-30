---
title:  "Rust - Quick and Dirty"
categories: [development]
tags: [rust]
comments: true
---
Rust may be quite hard to get into, but there are a few tricks to write ugly code that may speed you up.


* Choose your scope:
  - small enough to have results quickly
  - a CLI tool
  - something internal
  - sidecar service
  - replacing a (small) microservice (harder to sell)
  - library called from another language (python, node.js, ...) (harder to do)
* Prerequisite:
  - a few things to set up / understand
  - rustup, cargo
  - rust language server in IDE (nice to have)
  - stable VS nightly & feature gates
* Deliver quickly:
  - avoid most Rust difficulties: clone all the things
  - don't worry too much about internal implementation, you will fix it later
  - if replacing something existing, aim for "as good"
  - external API matters, this is what your users will see
* What you will gain:
  - Rust proficiency, getting used to the language syntax
  - discover the crates useful for your case : are we web yet, awesome rust, ...
  - the tool you are writing, hopefully something useful to you; if replacing something in Java, you should get better memory management
* Iterate:
  - improve your code! version control is your friend
  - trust the compiler: #![deny(warnings)]
  - cargo format, clippy
  - add tests: unit & integration
  - think about what is pub and what is not - this will become very visible as you add integration tests
  - remove the clones
  - discover lifetimes and references, mutability
* Learn:
  - 24 days of rust
  - rust by example
  - the rust programming language book
  - when you read something that could apply to you, try it as soon as possible
* Be part of the community:
  - talk about Rust: IRC, rust forums, stack overflow, rust gitter
  - about a crate: gitter of crates, open an issue for a bug you found, request a feature and talk about it, open a PR (it can be as simple as adding useful tests)
  - publish a crate if you built a helper that can be generalized along with your tool
  - build a rust community at work (open a slack channel, quick presentations, ...)
* Example ideas:
  - a CLI tool to manage issues in your issue tracker of choice (API client)
  - a CLI tool to do some file operation you often do (file management)
  - a slack bot to help you decide where to get lunch with your teammates (http server) (a real problem in Paris if you don't have an canteen where you work, there are just too many choices)

