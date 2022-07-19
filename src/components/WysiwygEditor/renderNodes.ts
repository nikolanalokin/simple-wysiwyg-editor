export const MNEMONIC_REGEX = /%([a-zA-Zа-яА-ЯёЁ\s\d]+)%/gm

export function renderText (textPart: string, filters: string[]): string[] {
    return filters.reduce((text, filter) => {
        switch (filter) {
            case 'escape':
                return escapeHtml(text)

            case 'br':
                return addLineBreaks(text)

            case 'mnemonic':
                return renderMnemonicHTML(text)

            default:
                return text
        }
    }, [textPart])
}

export function renderMnemonicHTML (textParts: string[]): string[] {
    return textParts.reduce<string[]>((result, part) => {
        if (part.search(MNEMONIC_REGEX) > -1) {
            result.push(part.replace(MNEMONIC_REGEX, (substring, p) => {
                return `<span><span class="wysiwyg-node--mnemonic" data-entity-type="mnemonic" contenteditable="false">%${p}%</span></span>`
                // return `<input readonly disabled class="wysiwyg-node--mnemonic" data-entity-type="mnemonic" contenteditable="false" value="${p}" style="width: ${p.length}ch;" />`
            }))
        } else {
            result.push(part)
        }

        return result
    }, [])
}

export function escapeHtml (textParts: string[]): string[] {
    const divEl = document.createElement('div')

    return textParts.reduce<string[]>((result, part) => {
        divEl.innerText = part
        result.push(divEl.innerHTML)

        return result
    }, [])
}

export function addLineBreaks (textParts: string[]): string[] {
    return textParts.reduce<string[]>((result, part) => {
        const splittenParts = part
            .split(/\r\n|\r|\n/g)
            .reduce((parts: string[], line: string, i, source) => {
                // This adds non-breaking space if line was indented with spaces, to preserve the indentation
                const trimmedLine = line.trimLeft()
                const indentLength = line.length - trimmedLine.length

                parts.push(String.fromCharCode(160).repeat(indentLength) + trimmedLine)

                if (i !== source.length - 1) {
                    parts.push('<br />')
                }

                return parts
            }, [])

        return [...result, ...splittenParts]
    }, [])
}
