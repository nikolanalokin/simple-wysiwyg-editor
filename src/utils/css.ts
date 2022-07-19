export function classNames (parts: string[]): string {
    return parts.filter(Boolean).join(' ')
}
