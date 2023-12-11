import FormComponent from './FormComponent'

function App() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <img
          src="/logo.png"
          className="h-[10em] p-[1.5em] transition-[0.75s] will-change-filter"
          alt="Twitch Downloader Logo"
        />
      </div>

      <FormComponent />
    </div>
  )
}

export default App
