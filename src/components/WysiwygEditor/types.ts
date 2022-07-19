export interface TextPart {
    type: 'text' | 'mnemonic'
    value: string
}

export interface WysiwygEditorProps {
    onChange?: (textParts: TextPart[]) => void
}

export interface WysiwygInputProps {
    id?: string
    html: string
    onUpdate: (html: string) => void
}
