import React from 'react'
import { HashRouter as Router } from 'react-router-dom'
import * as ReactDOM from 'react-dom'
import App from './App'
import './App.css'

ReactDOM.render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root')
)
