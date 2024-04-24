import ThemeProvider from './components/ThemeProvider'
import Form from './components/Form.tsx'

function App() {
  return (
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
  )
}

export default App
