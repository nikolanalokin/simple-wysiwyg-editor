import { useState } from 'react'
import './App.css'
import { TextPart } from './components/WysiwygEditor/types'

import { WysiwygEditor } from './components/WysiwygEditor/WysiwygEditor'

function App () {
    const [parts, setParts] = useState<TextPart[]>([
        {
            type: 'text',
            value: 'Дефолтный текст'
        }
    ])

    return (
        <div className="App">
            <h1 className="app-title">Simple Wysiwyg Editor Demo</h1>
            <div className="container">
                <div className="editor-value">
                    { JSON.stringify(parts, null, '  ') }
                </div>

                <WysiwygEditor defaultValue={parts} onChange={setParts} />
            </div>
        </div>
    )
}

export default App
