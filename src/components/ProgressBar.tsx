const ProgressBar = ({ progress }: { progress: number }) => {
  const roundedProgress = Math.round(progress)

  const textColorClass =
    roundedProgress > 50 ? 'text-gray-100' : 'text-gray-800'

  return (
    <div className="relative w-full bg-gray-300 rounded h-6 my-4 overflow-hidden">
      <div
        className={`absolute top-0 h-full bg-indigo-600 rounded transition-all duration-500 ease-in-out`}
        style={{ width: `${roundedProgress}%` }}
      />
      <div className="flex items-center justify-center h-full w-full absolute">
        <span
          className={`font-bold ${textColorClass}`}
        >{`${roundedProgress}%`}</span>
      </div>
    </div>
  )
}

export default ProgressBar
