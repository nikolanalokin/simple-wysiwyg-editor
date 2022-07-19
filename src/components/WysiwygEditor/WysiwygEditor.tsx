import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MnemonicSelect } from '../MnemonicSelect/MnemonicSelect'
import { WysiwygInput } from './WysiwygInput'
import { focusEditableElement, htmlToTextParts, insertHtmlInSelection, isSelectionInsideInput, textPartsToHtml } from './utils'

import './WysiwygEditor.css'
import { renderText } from './renderNodes'
import { useClipboardPaste } from './useClipboardPaste'

import type { WysiwygEditorProps } from './types'
import useControlled from '../../hooks/useControlled'

const mnemonics = [
    'Подстановка 1',
    'Подстановка 2',
    'Подстановка 3',
    'Подстановка 4'
]

export const WysiwygEditor: React.FC<WysiwygEditorProps> = (props) => {
    const {
        defaultValue = [],
        value,
        onChange
    } = props

    const inputId = 'wysiwyg-editor-test'

    const [html, setHtml] = useControlled({
        controlled: value !== undefined ? textPartsToHtml(value) : undefined,
        default: textPartsToHtml(defaultValue)
    })

    useEffect(() => {
        if (value !== undefined) setHtml(textPartsToHtml(value))
    }, [value])

    useEffect(() => {
        if (onChange) {
            onChange(htmlToTextParts(html))
        }
    }, [html])

    const insertTextAndUpdateCursor = (
        text: string,
        inputId: string,
        filters: string[] = ['escape', 'br']
    ) => {
        const selection = window.getSelection()!

        const messageInput = document.getElementById(inputId)!

        const newHtml = renderText(text, filters)
            .join('')
            .replace(/\u200b+/g, '\u200b')

        if (selection.rangeCount) {
            const selectionRange = selection.getRangeAt(0)
            if (isSelectionInsideInput(selectionRange, inputId)) {
                insertHtmlInSelection(newHtml)
                messageInput.dispatchEvent(new Event('input', { bubbles: true }))
                return
            }
        }

        setHtml(`${html}${newHtml}`)

        requestAnimationFrame(() => {
            focusEditableElement(messageInput)
        })
    }

    useClipboardPaste(inputId, insertTextAndUpdateCursor)

    const handleMnemonicSelect = (value: string) => {
        insertTextAndUpdateCursor(`%${value}%`, inputId, ['mnemonic'])
        // const selection = window.getSelection()
        // const selectionRange = selection.getRangeAt(0)

        // if (!isSelectionInsideInput(selectionRange, inputId)) {
        //     return
        // }

        // document.execCommand(
        //     'insertHTML',
        //     false,
        //     `<span><span class="wysiwyg-node--mnemonic" data-entity-type="mnemonic" contenteditable="false">%${value}%</span></span>`
        // )
    }

    return (
        <div className='wysiwyg-container' dir="rlt">
            <WysiwygInput
                id={inputId}
                html={html}
                onUpdate={setHtml}
            />

            <MnemonicSelect
                className='wysiwyg__mnemonic-select'
                options={mnemonics}
                onMnemomicClick={handleMnemonicSelect}
            />
        </div>
    )
}
