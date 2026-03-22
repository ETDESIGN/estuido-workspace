name: "hello-world"
version: "1.0"
description: "Simple test pipeline to verify Lobster installation"

args:
  name:
    default: "World"
    description: "Name to greet"

steps:
  - id: greeting
    name: "Say Hello"
    run: echo "Hello, ${name}!"
    timeoutMs: 5000
