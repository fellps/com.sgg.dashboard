import { useEffect } from 'react'

/*eslint-disable */
export default function useUnmount (unmount) {
  useEffect(() => {
    return unmount
  }, [])
}
/*eslint-enable */
