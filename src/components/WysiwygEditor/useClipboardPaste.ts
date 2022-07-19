import { useEffect } from 'react'

export const useClipboardPaste = (
    inputId: string,
    insertTextAndUpdateCursor: (text: string, inputId?: string) => void,
) => {
    useEffect(() => {
        function handlePaste (evt: ClipboardEvent) {
            if (!evt.clipboardData) {
                return
            }

            const input = document.activeElement

            if (input && input.id !== inputId) {
                return
            }

            const pastedText = evt.clipboardData.getData('text')

            evt.preventDefault()

            if (!pastedText) {
                return
            }

            insertTextAndUpdateCursor(pastedText, input?.id)
        }

        document.addEventListener('paste', handlePaste, false)

        return () => {
            document.removeEventListener('paste', handlePaste, false)
        }
    }, [inputId, insertTextAndUpdateCursor])
}
