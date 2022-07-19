import { MNEMONIC_REGEX, renderMnemonicHTML } from './renderNodes'
import type { TextPart } from './types'

export function insertHtmlInSelection (html) {
    const selection = window.getSelection()

    if (selection?.getRangeAt && selection.rangeCount) {
        const range = selection.getRangeAt(0)

        range.deleteContents()

        const fragment = range.createContextualFragment(html)
        const lastInsertedNode = fragment.lastChild

        range.insertNode(fragment)

        if (lastInsertedNode) {
            range.setStartAfter(lastInsertedNode)
            range.setEndAfter(lastInsertedNode)
        } else {
            range.collapse(false)
        }

        selection.removeAllRanges()
        selection.addRange(range)
    }
}

export function isSelectionInsideInput (selectionRange: Range, inputId: string) {
    const { commonAncestorContainer } = selectionRange

    let parentNode: HTMLElement | null = commonAncestorContainer as HTMLElement
    let iterations = 1

    while (parentNode && parentNode.id !== inputId && iterations < 5) {
        parentNode = parentNode.parentElement
        iterations++
    }

    return Boolean(parentNode && parentNode.id === inputId)
}

export function focusEditableElement (element: HTMLElement, force?: boolean, forcePlaceCaretAtEnd?: boolean) {
    if (!force && element === document.activeElement) {
        return
    }

    const selection = window.getSelection()
    const range = document.createRange()
    const lastChild = element.lastChild || element

    if (!forcePlaceCaretAtEnd && (!lastChild || !lastChild.nodeValue)) {
        element.focus()
        return
    }

    range.selectNodeContents(forcePlaceCaretAtEnd ? element : lastChild)
    // `false` means collapse to the end rather than the start
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
}

export function clearSelection () {
    const selection = window.getSelection()
    if (!selection) {
        return
    }

    if (selection.removeAllRanges) {
        selection.removeAllRanges()
    } else if (selection.empty) {
        selection.empty()
    }
}

export function textPartsToHtml (textParts: TextPart[]): string {
    if (!textParts) return ''

    return textParts.map(part => {
        if (part.type === 'mnemonic') return renderMnemonicHTML([part.value])
        return part.value
    }).join('')
}

export function htmlToTextParts (html: string): TextPart[] {
    if (!html) return []

    const divEl = document.createElement('div')
    divEl.innerHTML = html

    const regex = new RegExp(MNEMONIC_REGEX.source, 'm')

    let result: TextPart[] = []
    let text = divEl.innerText

    let match: RegExpMatchArray

    while (match = text.match(regex)) {
        if (match.index > 0) {
            result.push({
                type: 'text',
                value: text.slice(0, match.index)
            })
        }

        result.push({
            type: 'mnemonic',
            value: match[0]
        })

        text = text.slice(match.index + match[0].length)
    }

    if (text) {
        result.push({
            type: 'text',
            value: text
        })
    }

    return result
}
