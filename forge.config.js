module.exports = {
  config: {
    forge: {
      makers: [
        {
          name: '@electron-forge/maker-deb',
          config: {
            options: {
              icon: 'src/renderer/public/images/logo.png'
            }
          }
        },
        {
          name: '@electron-forge/maker-rpm',
          config: {
            options: {
              icon: 'src/renderer/public/images/logo.png'
            }
          }
        }
      ],
      packagerConfig: {
        icon: 'src/renderer/public/images/logo'
      }
    }
  },
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {}
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {}
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    }
  ]
}
