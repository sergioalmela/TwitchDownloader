import path from 'path'
import { app, Menu } from 'electron'
import ElectronPreferences from 'electron-preferences'

const preferences = new ElectronPreferences({
  /**
     * Where should preferences be saved?
     */
  dataStore: path.resolve(app.getPath('userData'), 'preferences.json'),
  /**
     * Default values.
     */
  defaults: {
    global: {
      language: 'en'
    },
    downloader: {
      defaultDownloadFolder: '',
      openFolderOnDownload: false
    }
  },
  /**
     * The preferences window is divided into sections. Each section has a label, an icon, and one or
     * more fields associated with it. Each section should also be given a unique ID.
     */
  sections: [
    {
      id: 'about',
      label: 'About You',
      /**
             * See the list of available icons below.
             */
      icon: 'single-01',
      form: {
        groups: [
          {
            /**
                         * Group heading is optional.
                         */
            label: 'About You',
            fields: [
              {
                label: 'First Name',
                key: 'first_name',
                type: 'text',
                /**
                                 * Optional text to be displayed beneath the field.
                                 */
                help: 'What is your first name?'
              },
              {
                label: 'Last Name',
                key: 'last_name',
                type: 'text',
                help: 'What is your last name?'
              },
              {
                label: 'Password',
                key: 'password',
                type: 'secret'
              },
              {
                label: 'Enable Gender',
                key: 'enableGender',
                type: 'radio',
                options: [
                  { label: 'No', value: false },
                  { label: 'Yes', value: true }
                ],
                help: 'So woke!'
              },
              {
                label: 'Gender',
                key: 'gender',
                type: 'dropdown',
                options: [
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                  { label: 'Unspecified', value: 'unspecified' }
                ],
                help: 'What is your gender?'
              },
              {
                label: 'Which of the following foods do you like?',
                key: 'foods',
                type: 'checkbox',
                options: [
                  { label: 'Ice Cream', value: 'ice_cream' },
                  { label: 'Carrots', value: 'carrots' },
                  { label: 'Cake', value: 'cake' },
                  { label: 'Spinach', value: 'spinach' }
                ],
                help: 'Select one or more foods that you like.'
              },
              {
                label: 'Coolness',
                key: 'coolness',
                type: 'slider',
                min: 0,
                max: 9001
              },
              {
                label: 'Eye Color',
                key: 'eye_color',
                type: 'color',
                format: 'hex', // can be hex, hsl or rgb
                help: 'Your eye color'
              },
              {
                label: 'Ipc button',
                key: 'resetButton',
                type: 'button',
                buttonLabel: 'Restart to apply changes',
                help: 'This button sends on a custom ipc channel',
                hideLabel: false
              }
            ]
          }
        ]
      }
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: 'folder-15',
      form: {
        groups: [
          {
            label: 'Stuff',
            fields: [
              {
                label: 'Read notes from folder',
                key: 'folder',
                type: 'directory',
                help: 'The location where your notes will be stored.',
                multiSelections: false,
                noResolveAliases: false,
                treatPackageAsDirectory: false,
                dontAddToRecent: true
              },
              {
                label: 'Select some images',
                buttonLabel: 'Choose Files',
                key: 'images',
                type: 'file',
                help: 'List of selected images',
                filters: [
                  {
                    name: 'Joint Photographic Experts Group (JPG)',
                    extensions: ['jpg', 'jpeg', 'jpe', 'jfif', 'jfi', 'jif']
                  },
                  {
                    name: 'Portable Network Graphics (PNG)',
                    extensions: ['png']
                  },
                  {
                    name: 'Graphics Interchange Format (GIF)',
                    extensions: ['gif']
                  },
                  {
                    name: 'All Images',
                    extensions: [
                      'jpg',
                      'jpeg',
                      'jpe',
                      'jfif',
                      'jfi',
                      'jif',
                      'png',
                      'gif'
                    ]
                  }
                  // { name: 'All Files', extensions: ['*'] }
                ],
                multiSelections: true, // Allow multiple paths to be selected
                showHiddenFiles: true, // Show hidden files in dialog
                noResolveAliases: false, // (macos) Disable the automatic alias (symlink) path resolution. Selected aliases will now return the alias path instead of their target path.
                treatPackageAsDirectory: false, // (macos) Treat packages, such as .app folders, as a directory instead of a file.
                dontAddToRecent: true // (windows) Do not add the item being opened to the recent documents list.
              },
              {
                label: 'Other Settings',
                fields: [
                  {
                    label: 'Foo or Bar?',
                    key: 'foobar',
                    type: 'radio',
                    options: [
                      { label: 'Foo', value: 'foo' },
                      { label: 'Bar', value: 'bar' },
                      { label: 'FooBar', value: 'foobar' }
                    ],
                    help: 'Foo? Bar?'
                  }
                ]
              },
              {
                heading: 'Important Message',
                content:
                                    '<p>The quick brown fox jumps over the long white fence. The quick brown fox jumps over the long white fence. The quick brown fox jumps over the long white fence. The quick brown fox jumps over the long white fence.</p>',
                type: 'message'
              }
            ]
          }
        ]
      }
    },
    {
      id: 'lists',
      label: 'Lists',
      icon: 'notes',
      form: {
        groups: [
          {
            label: 'Lists',
            fields: [
              {
                label: 'Favorite foods',
                key: 'foods',
                type: 'list',
                size: 15,
                help: 'A list of your favorite foods',
                addItemValidator: /^[A-Za-z ]+$/.toString(),
                addItemLabel: 'Add favorite food'
              },
              {
                label: 'Best places to visit',
                key: 'places',
                type: 'list',
                size: 10,
                style: {
                  width: '75%'
                },
                help: 'An ordered list of nice places to visit',
                orderable: true
              }
            ]
          }
        ]
      }
    },
    {
      id: 'space',
      label: 'Other Settings',
      icon: 'spaceship',
      form: {
        groups: [
          {
            label: 'Other Settings',
            fields: [
              {
                label: 'Foo or Bar?',
                key: 'foobar',
                type: 'radio',
                options: [
                  { label: 'Foo', value: 'foo' },
                  { label: 'Bar', value: 'bar' },
                  { label: 'FooBar', value: 'foobar' }
                ],
                help: 'Foo? Bar?'
              }
            ]
          }
        ]
      }
    }
  ],
  /**
     * These parameters on the preference window settings can be overwritten
     */
  browserWindowOpts: {
    title: 'Twitch Downloader Preferences',
    width: 900,
    maxWidth: 1000,
    height: 700,
    maxHeight: 1000,
    resizable: true,
    maximizable: false
    // ...
  },
  /**
     * These parameters create an optional menu bar
     */
  menu: Menu.buildFromTemplate([
    {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        }
      ]
    }
  ]),
  /**
     * If you want to apply your own CSS. The path should be relative to your appPath.
     */
  css: 'custom-style.css'
})

export default preferences
