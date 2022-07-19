import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usePrevious } from '../../hooks/usePrevious'
import { focusEditableElement, isSelectionInsideInput } from './utils'
import type { WysiwygInputProps } from './types'

import './WysiwygEditor.css'

export const WysiwygInput: React.FC<WysiwygInputProps> = (props) => {
    const {
        id,
        html,
        onUpdate
    } = props

    const inputRef = useRef<HTMLDivElement>(null)
    const isContextMenuOpenRef = useRef<boolean>(false)

    const [selectedRange, setSelectedRange] = useState<Range>()

    const prevHtml = usePrevious(html)

    useLayoutEffect(() => {
        if (html !== inputRef.current.innerHTML) {
            inputRef.current.innerHTML = html
        }
    }, [html])

    const focusInput = useCallback(() => {
        if (!inputRef.current) {
            return
        }

        focusEditableElement(inputRef.current)
    }, [])

    const checkSelection = () => {
        const selection = window.getSelection()
        if (!selection || !selection.rangeCount || isContextMenuOpenRef.current) {
            return false
        }

        const selectionRange = selection.getRangeAt(0)
        const selectedText = selectionRange.toString().trim()

        if (
            !selectedText ||
            !isSelectionInsideInput(selectionRange, id) ||
            !selectionRange.START_TO_END
        ) {
            return false
        }

        return true
    }

    const processSelection = () => {
        if (!checkSelection()) {
            return
        }

        const selectionRange = window.getSelection().getRangeAt(0)
        setSelectedRange(selectionRange)
    }

    const processSelectionWithTimeout = () => {
        // Small delay to allow browser properly recalculate selection
        setTimeout(processSelection, 1)
    }

    const handleInput = (evt: React.FormEvent<HTMLDivElement>) => {
        const { innerHTML, textContent } = evt.currentTarget

        onUpdate(innerHTML === '<br>' ? '' : innerHTML)

        if (!textContent || !textContent.length) {
            focusEditableElement(inputRef.current, true)
        }
    }

    const handleClick = (evt: React.MouseEvent<HTMLDivElement>) => {
        focusInput()
    }

    const handleKeyDown = (evt: React.KeyboardEvent<HTMLDivElement>) => {
        if (evt.key === 'Enter' && !evt.shiftKey) {
            evt.preventDefault()
        } else {
            evt.target.addEventListener('keyup', processSelectionWithTimeout, { once: true })
        }
    }

    const handleMouseDown = (evt: React.MouseEvent<HTMLDivElement>) => {
        if (evt.button !== 2) {
            evt.target.addEventListener('mouseup', processSelectionWithTimeout, { once: true })
            return
        }

        if (isContextMenuOpenRef.current) {
            return
        }

        isContextMenuOpenRef.current = true

        const handleCloseContextMenu = (evt2) => {
            if (evt2 instanceof KeyboardEvent && evt2.key !== 'Esc' && evt2.key !== 'Escape') {
                return
            }

            setTimeout(() => {
                isContextMenuOpenRef.current = false
            }, 100)

            document.removeEventListener('mousedown', handleCloseContextMenu)
            document.removeEventListener('keydown', handleCloseContextMenu)
        }

        document.addEventListener('mousedown', handleCloseContextMenu)
        document.addEventListener('keydown', handleCloseContextMenu)
    }

    return (
        <div
            id={id}
            ref={inputRef}
            contentEditable
            className='wysiwyg-input'
            dir="auto"
            onClick={handleClick}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onMouseDown={handleMouseDown}
        />
    )
}
