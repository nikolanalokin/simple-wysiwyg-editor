import { useRef } from 'react'

export function usePrevious<T extends any>(next: T, shouldSkipUndefined?: boolean) {
    const ref = useRef<T>()
    const { current } = ref
    if (!shouldSkipUndefined || next !== undefined) {
        ref.current = next
    }
    return current
}
