import { useState } from 'preact/hooks'
import { open } from '@tauri-apps/api/dialog'

const Preferences = () => {
  const [activeTab, setActiveTab] = useState('General')

  const [selectedFolder, setSelectedFolder] = useState('')

  const selectFolder = async () => {
    try {
      // Open the folder selection dialog
      const path = await open({
        directory: true,
        multiple: false
      })

      if (path) {
        // If a folder is selected, update the state
        setSelectedFolder(Array.isArray(path) ? path[0] : path)
      }
    } catch (error) {
      console.error('Error selecting folder:', error)
    }
  }

  const tabClass = (tabName: string) =>
    `flex-1 cursor-pointer text-center p-4 ${
      activeTab === tabName
        ? 'bg-blue-500 text-white'
        : 'bg-gray-200 hover:bg-gray-300'
    }`

  return (
    <div className="App bg-gray-100 min-h-screen p-4 flex justify-center items-center">
      <div className="bg-white shadow rounded-lg w-full max-w-4xl h-full md:h-auto">
        <div className="flex h-full">
          <div className="w-1/4 flex flex-col">
            <div
              className={tabClass('General')}
              onClick={() => setActiveTab('General')}
            >
              General
            </div>
            <div
              className={tabClass('Downloads')}
              onClick={() => setActiveTab('Downloads')}
            >
              Downloads
            </div>
            <div
              className={tabClass('Appearance')}
              onClick={() => setActiveTab('Appearance')}
            >
              Appearance
            </div>
          </div>
          <div className="w-3/4 p-4 overflow-auto">
            {activeTab === 'General' && (
              <div>
                <label htmlFor="language" className="block mb-2">
                  Language
                </label>
                <select id="language" className="border p-2 rounded w-full">
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="italian">Italian</option>
                  <option value="german">German</option>
                </select>
              </div>
            )}
            {activeTab === 'Downloads' && (
              <div>
                <div className="mb-4">
                  <label htmlFor="download-folder" className="block mb-2">
                    Default Download Folder
                  </label>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={selectFolder}
                  >
                    Select Folder
                  </button>

                  {selectedFolder && (
                    <div className="mt-4">
                      Selected Folder:{' '}
                      <span className="font-semibold">{selectedFolder}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="open-folder" className="block mb-2">
                    Open Folder on Download?
                  </label>
                  <select
                    id="open-folder"
                    className="border p-2 rounded w-full"
                  >
                    <option value="dont-open">Don't Open</option>
                    <option value="open">Open</option>
                  </select>
                </div>
              </div>
            )}
            {activeTab === 'Appearance' && (
              <div>
                <label htmlFor="theme" className="block mb-2">
                  Theme
                </label>
                <select id="theme" className="border p-2 rounded w-full">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Preferences
