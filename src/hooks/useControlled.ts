import React from 'react'

export default function useControlled<T = unknown> ({
    controlled,
    default: defaultProp,
}: {
    /**
   * Holds the component value when it's controlled.
   */
    controlled: T | undefined
    /**
     * The default value when uncontrolled.
     */
    default: T | undefined
}): [T, (newValue: T | ((prevValue: T) => T)) => void] {
    // isControlled is ignored in the hook dependency lists as it should never change.
    const { current: isControlled } = React.useRef(controlled !== undefined)

    const [valueState, setValue] = React.useState(defaultProp)

    const value = isControlled ? controlled : valueState

    const setValueIfUncontrolled = React.useCallback((newValue) => {
        if (!isControlled) {
            setValue(newValue)
        }
    }, [])

    return [value!, setValueIfUncontrolled]
}
