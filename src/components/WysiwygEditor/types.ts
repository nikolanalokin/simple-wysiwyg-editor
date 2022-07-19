export interface TextPart {
    type: 'text' | 'mnemonic'
    value: string
}

export interface WysiwygEditorProps {
    defaultValue?: TextPart[]
    value?: TextPart[]
    onChange?: (textParts: TextPart[]) => void
}

export interface WysiwygInputProps {
    id?: string
    html: string
    onUpdate: (html: string) => void
}
