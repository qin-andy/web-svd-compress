import './App.css';
import Canvas from './Canvas';
import Slider from './Slider';

// TODO : why don't JPGs work?
import horizon from './images/horizon.png';
import bridge from './images/bridge.png';
import city from './images/city.png';
import origami from './images/origami.png';
import shore from './images/shore.png';
import squid from './images/squid.png';
import pole from './images/pole.png';
import tapir from './images/tapir.png';
import { useState, useRef } from 'react';

function App(props) {
  const [reduction, setReduction] = useState(19); // Initial reduction compression
  const [width, setWidth] = useState(400); // Initial canvas element height and width
  const [height, setHeight] = useState(300);
  const [image, setImage] = useState(horizon);
  const images = useRef([horizon, bridge, city, origami, shore, squid, pole, tapir]);
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
        image={image}
        width={width}
        height={height}
        setWidth={setWidth}
        setHeight={setHeight}
        setSliderEnabled={setSliderEnabled}
      />
      <Slider
        width={width}
        height={height}
        reduction={reduction}
        changeReduction={setReduction}
        disabled={!sliderEnabled}
      />
      <div className="info-container">
        <h3>Singular Values: {parseInt(reduction) + 1}</h3>
        <p>
          An interactive demo of Singular Value Decomposition (SVD) compression applied to various images.
        </p>
      </div>
    </div>
  );
}

export default App;
