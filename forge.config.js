module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        iconUrl: "https://raw.githubusercontent.com/sergioalmela/TwitchDownloader/master/src/renderer/public/images/logo.ico",
        setupIcon: "src/renderer/public/images/logo.ico",
        name: "twitch-downloader"
      }
    },
    {
      name: '@electron-forge/maker-zip'
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          productName: "Twitch Downloader",
          icon: "src/renderer/public/images/logo.png",
          genericName: "Twitch Downloader",
          categories: [
            "AudioVideo",
            "Audio",
            "Video"
            ]
        },
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          productName: "Twitch Downloader",
          icon: "src/renderer/public/images/logo.png",
          genericName: "Twitch Downloader",
          categories: [
            "AudioVideo",
            "Audio",
            "Video"
          ]
        },
      }
    }
  ]
}
