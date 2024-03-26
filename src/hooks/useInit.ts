import { useRef, useEffect } from 'preact/hooks'

export default function useInit(callback: () => void) {
  const isInit = useRef(true)
  useEffect(() => {
    if (isInit.current) {
      callback()
      isInit.current = false
    }
  })
}
