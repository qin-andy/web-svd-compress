import './App.css';
import Canvas from './Canvas';
import Slider from './Slider';

import { useState } from 'react';

function App(props) {
  const [reduction, setReduction] = useState(490);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello There!</h1>
        <h2>Current Reduction is {reduction}</h2>
        <Canvas width="500" height="500" original="true" />
        <Canvas width="500" height="500" original="false" reduction={reduction} />
        <Slider reduction={reduction} changeReduction={setReduction} />
      </header>
    </div>
  );
}

export default App;
