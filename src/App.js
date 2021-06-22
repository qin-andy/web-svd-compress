import './App.css';
import Canvas from './Canvas';
import Slider from './Slider';

// TODO : why don't JPGs work?
import defaultImage from './tapir.png';

import { useState } from 'react';

function App(props) {
  const [reduction, setReduction] = useState(30); // Initial reduction compression
  const [width, setWidth] = useState(400); // Initial canvas element height and width
  const [height, setHeight] = useState(300);
  const [sliderEnabled, setSliderEnabled] = useState(false);
  let status = sliderEnabled ? "Image is " + width + " by " + height : "Calculating SVDs...";
  return (
    <div className="App">
      <header className="App-header">
        <h1>SVD Compression</h1>
      </header>
      <p>{status}</p>
      <Canvas
        original="false"
        reduction={reduction}
        image={defaultImage}
        width={width}
        height={height}
        setWidth={setWidth}
        setHeight={setHeight}
        setSliderEnabled={setSliderEnabled}
      />
      <h3>Singular Values: {reduction}</h3>
      <Slider
        width={width}
        height={height}
        reduction={reduction}
        changeReduction={setReduction}
        disabled={!sliderEnabled}
      />
      <h2>
        INFO
      </h2>
      <p>
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      </p>

    </div>
  );
}

export default App;
