# Twitch Downloader
![Twitch Downloader Logo](logo.png?raw=true "Twitch Downloader Logo")

## About
Twitch Downloader is a free utility made to download Twitch content (streams, videos, highlights, clips) including sub-only content. 
### Current version: 0.9

## Planned features:
  
| Feature  | v0.5  | v0.6 | v0.7 | v0.8 |  v0.9  |  v1.0  |  v2.0
| ------------- | ------------- | ------------- | ------------- |------------- |------------- |------------- |------------- |
| GUI  | ❌  | ❌  | ❌  | ❌  |  ✔  |  ✔  |  ✔  |
| Download live stream  | ❌  | ❌  | ✔  | ✔  |  ✔  |  ✔  |  ✔  |
| Download VOD/Highlight  | ✔  | ✔  | ✔  | ✔  |  ✔  |  ✔  |  ✔  |
| Download sub-only content  | ✔  | ✔  | ✔  | ✔  |  ✔  |  ✔  |  ✔  |
| Convert files  | ❌  | ❌  | ❌  | ❌  |  ❌  |  ❌  |  ✔  |
| Download a clip  | ❌  | ✔  | ✔  | ✔  |  ✔  |  ✔  |  ✔  |
| Download chat from live/clip/VOD  | ❌  | ❌  | ❌  | ❌  |  ❌  | ❌  |  ✔  |
| Mass download option  | ❌  | ❌  | ❌  | ✔  |  ✔  |  ✔  |  ✔  |
| User preferences  | ❌  | ❌  | ❌  | ❌  |  ❌  |  ✔  |  ✔  |
| Multi language support  | ❌  | ❌  | ❌  | ❌  |  ❌  |  ✔  |  ✔  |
| Detailed wiki and video tutorials  | ❌  | ❌  | ❌  | ❌  |  ❌  |  ✔  |  ✔  |

## How to execute

### GUI

```
npm install
npm run start
```

It will open a new window with the GUI. Enter the URL of the stream, video, highlight or clip you want to download. Then, select the folder, file name and click on Get Qualities button. Then,  select the quality you want to download and click on Download button.


### Terminal

```
npm install
npm run start:terminal
```

The terminal will ask you for the full URL of the content you want to download:
- Step 1: Enter the full URL of the content you want to download, for example: ```https://www.twitch.tv/videos/365670422```
- Step 2: Enter the path to download the video, it can be relative or absolute, and the file name. If no filename is passed, the default name will be the video ID. 
NOTE: It will always save the file as .mp4. For example: ```/home/sergio/downloads/awesomeVideo.mp4```
- Step 3: Enter the quality you want to download from the selector (use the arrows). For example: ```1080p60```
- It will start downloading the video, and you will see the progress in the terminal.

**NOTE:** If you put a live stream URL, it will download from the current time, and it will keep downloading until the stream ends. For example: ```https://www.twitch.tv/twitch```. It may display a wrong progress because it's not possible to know the total size of the stream.

**NOTE:**
After entering a path to download the content, the directory structure will be created if it does not exist. Windows users: The absolute path must be for example: ```C:\Users\torre\Downloads\awesomeVideo.mp4``` 

### How to download massively
- Create a .txt file with the URLs of the content you want to download, one per line (line break separator).
- Enter the path of the .txt file in the first input of  the program. Then, it will ask the download path and resolution.
- You can use the test/tmp/list.txt file as example.

## Technologies used
- [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white)](https://nodejs.org/en/)
- [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white)](https://www.typescriptlang.org/)
- [![Electron.js](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)](https://electronjs.org/)
- [![Vitest](https://img.shields.io/badge/Vitest-191970?style=for-the-badge&logo=Vite&logoColor=white)](https://vitest.dev/)

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
