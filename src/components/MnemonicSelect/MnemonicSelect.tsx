import './MnemonicSelect.css'

import React, { memo, useState } from 'react'
import { classNames } from '../../utils/css'

export interface MnemonicSelectProps {
    options?: string[]
    onMnemomicClick?: (option: string) => void
}

export const MnemonicSelect: React.FC<React.HTMLAttributes<HTMLDivElement> & MnemonicSelectProps> = memo((props) => {
    const {
        options = [],
        onMnemomicClick,

        className,
        ...restProps
    } = props

    const handleClick = (evt: React.MouseEvent<HTMLDivElement>, option: string) => {
        evt.preventDefault()

        onMnemomicClick?.(option)
    }

    return (
        <div
            className={classNames(['mnemonic-select', className])}
            {...restProps}
        >
            { options.map((option, index) => (
                <div
                    key={index}
                    className="mnemonic-select-option"
                    onClick={(evt) => handleClick(evt, option)}
                >
                    { option }
                </div>
            )) }
        </div>
    )
})
