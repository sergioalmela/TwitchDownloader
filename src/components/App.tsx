import ThemeProvider from '../ThemeProvider.tsx'
import Form from './Form.tsx'

import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'

function App() {
  return (
    <I18nextProvider i18n={i18next}>
      <ThemeProvider>
        <div className="bg-white flex flex-col items-center justify-center h-full">
          <div>
            <img
              src="/logo.png"
              className="h-[10em] p-[1.5em] transition-[0.75s] will-change-filter"
              alt="Twitch Downloader Logo"
            />
          </div>

          <Form />
        </div>
      </ThemeProvider>
    </I18nextProvider>
  )
}

export default App
