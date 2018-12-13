import React, { Component } from 'react'
import './App.css'
import { DragNDrop } from './lib'

class App extends Component {
  render() {
    return (
      <div className="App">
        <DragNDrop>
          <div className="test-block"></div>
          <div className="test-block2"></div>
        </DragNDrop>
      </div>
    );
  }
}

export default App;
