import { useEffect } from 'react'

/*eslint-disable */
export default function useMount (func) {
  useEffect(func, [])
}
/*eslint-enable */
