import './App.css';
import Canvas from './Canvas';
import Slider from './Slider';

import { useState } from 'react';

function App(props) {
  const [reduction, setReduction] = useState(390);
  const [width, setWidth] = useState(250);
  const [height, setHeight] = useState(500);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello There!</h1>
        <h2>Current Reduction is {reduction}</h2>
        <Canvas width={width} height={height} original="false" reduction={reduction} />
        <Slider width={width} height={height} reduction={reduction} changeReduction={setReduction} />
      </header>
    </div>
  );
}

export default App;
