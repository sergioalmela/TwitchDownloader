# Twitch Downloader
![Twitch Downloader Logo](public/logo.png "Twitch Downloader Logo")

## About
Twitch Downloader is a free utility made to download Twitch content (streams, videos, highlights, clips).

## Features

- Download live streams, VODs, highlights, and clips
- Quality selector for each content type
- Cancel a download, or stop a live recording and keep what was captured
- Dark and light theme
- 6 languages: English, Spanish, Portuguese, French, German, Italian
- Configurable download folder
- Open file in file manager after download
- Cross-platform (Linux, macOS, Windows)

## Download

Get the latest version from the [Releases page](https://github.com/sergioalmela/TwitchDownloader/releases/latest).

| System | File |
|---|---|
| Windows | `*_x64-setup.exe` or `*_x64_en-US.msi` |
| macOS (Apple Silicon) | `*_aarch64.dmg` |
| macOS (Intel) | `*_x64.dmg` |
| Linux | `*.AppImage`, `*.deb` or `*.rpm` |

The app is not code-signed, so the system may warn you on first launch:

- **Windows:** if SmartScreen says "Windows protected your PC", click **More info**, then **Run anyway**.
- **macOS:** if it says the app "is damaged and can't be opened", move it to Applications and run `xattr -cr /Applications/twitch-downloader.app`. If it says Apple cannot verify the developer, go to **System Settings > Privacy & Security** and click **Open Anyway**.

## Prerequisites

- [Node.js](https://nodejs.org/) (v20.19+ or v22.12+)
- [Rust](https://www.rust-lang.org/tools/install)
- System dependencies for Tauri: see [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)

## How to execute

### Development

```
npm install
npm run tauri dev
```

### Build for production

```
npm run tauri build
```

It will open a new window with the GUI. Enter the URL of the stream, video, highlight or clip you want to download. Then, select the folder, file name and click on Get Qualities button. Select the quality you want to download and click on Download.

![How to use the GUI](public/how-to-use.gif)

## Tests

```
npm test
```

Run every check (lint, frontend tests, Rust format, clippy and Rust tests):

```
npm run check
```

## Donate
If you want to support the project, you can buy me a coffee. Thanks!

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/sergioalmela)

## Technologies used
- [![Tauri](https://img.shields.io/badge/Tauri_2-421C87?style=for-the-badge&logo=Tauri&logoColor=white)](https://tauri.app/)
- [![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=Rust&logoColor=white)](https://www.rust-lang.org/)
- [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white)](https://www.typescriptlang.org/)
- [![Preact](https://img.shields.io/badge/Preact-673AB8?style=for-the-badge&logo=Preact&logoColor=white)](https://preactjs.com/)
- [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white)](https://vite.dev/)
- [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=TailwindCSS&logoColor=white)](https://tailwindcss.com/)
- [![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=Vitest&logoColor=white)](https://vitest.dev/)
- [![Biome](https://img.shields.io/badge/Biome-60A5FA?style=for-the-badge&logo=Biome&logoColor=white)](https://biomejs.dev/)

## Issues

Feel free to submit issues and enhancement requests here: [Report Issue](https://github.com/sergioalmela/TwitchDownloader/issues)

Before posting an issue, be sure to include (if applicable):
- URL of the content to download
- Path to save the file
- Resolution of the file to download

## Contributing

1. **Fork** the repo on GitHub
2. **Clone** the project to your own machine
3. **Commit** changes to your own branch
4. **Push** your work back up to your fork
5. Submit a **Pull request** so that we can review your changes

NOTE: Be sure to merge the latest from "upstream" before making a pull request!

Any contribution to the localization of the app is welcome. You can find the localization files in the `src/locales` folder. You can use the `en.json` file as example.
