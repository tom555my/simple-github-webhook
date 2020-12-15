[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Simple Github Webhook

This project is aimed at to create simple github webhook server for quick and dirty CI/CD integration.

## Tech stack

- NodeJs
- [Vercel/Micro](https://github.com/vercel/micro)

## Usage

1. Edit config json

```json
{
  [repo name]: {
    [branch name]: {
      "cwd": "<where should the program run>",
      "cmd": [
        // List of string of command
      ]
    }
  }
}

// For example
{
  "simple-github-webhook": {
    "main": {
      "cwd": "/home/tom555my/repo/simple-github-webhook",
      "cmd": [
        "git checkout main",
        "git pull origin main",
        "yarn",
        "yarn build",
        "yarn start"
      ]
    }
  }
}
```

2. Start the server

`yarn start`

3. Config your github repo webhook

https://github.com/%username%/%your-repo%/settings/hooks

# License

MIT

Copyright (c) 2020-present, Chung Kwok Cheong
