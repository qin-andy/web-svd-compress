import './App.css';
import Canvas from './Canvas';
import Slider from './Slider';

import horizon from './images/horizon.png';
import { useState, useRef } from 'react';

function App(props) {
  const [reduction, setReduction] = useState(19); // Initial reduction compression
  const [width, setWidth] = useState(400); // Initial canvas element height and width
  const [height, setHeight] = useState(300);
  const [currentImage, setCurrentImage] = useState(0);
  const images = useRef([horizon]);
  const [uiDisabled, setUiDisabled] = useState(true);
  let status = uiDisabled ? "Calculating SVDs..." : "Image is " + width + " by " + height;
  return (
    <div className="App">
      <header className="App-header">
        <h1>SVD Compression</h1>
      </header>
      <p>{status}</p>
      <Canvas
        original="false"
        reduction={reduction}
        image={images.current[currentImage]}
        width={width}
        height={height}
        setWidth={setWidth}
        setHeight={setHeight}
        setUiDisabled={setUiDisabled}
      />
      <Slider
        width={width}
        height={height}
        reduction={reduction}
        changeReduction={setReduction}
        disabled={uiDisabled}
      />
      <div className="info-container">
        <h3>Singular Values: {parseInt(reduction) + 1}</h3>
        <p>Approximate Original Pixels: {
          width * height
        }
        </p>
        <p>Approximate Compressed Pixels: {
          (parseInt(reduction) + 1) * width + (parseInt(reduction) + 1) * height + (parseInt(reduction) + 1) ^ 2
        }
        </p>
      </div>
    </div>
  );
}

export default App;
