import './App.css';
import Canvas from './Canvas';
import Slider from './Slider';

import defaultImage from './set_proof.png';

import { useState } from 'react';

function App(props) {
  const [reduction, setReduction] = useState(30);
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);

  return (
    <div className="App">
      <header className="App-header">
        <h1>SVD Compression</h1>
        <p>Image is {width} by {height}</p>
        <Canvas
          original="false"
          reduction={reduction}
          image={defaultImage}
          width={width}
          height={height}
          setWidth={setWidth}
          setHeight={setHeight}
        />
        <h3>Reduction Value: {reduction}</h3>
        <Slider
          width={width}
          height={height}
          reduction={reduction}
          changeReduction={setReduction}
        />
      </header>
    </div>
  );
}

export default App;
