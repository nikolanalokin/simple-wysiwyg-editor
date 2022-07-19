import './App.css'

import { WysiwygEditor } from './components/WysiwygEditor/WysiwygEditor'

function App () {

    return (
        <div className="App">
            <h1>Simple Wysiwyg Demo</h1>
            <WysiwygEditor onChange={console.log} />
        </div>
    )
}

export default App
