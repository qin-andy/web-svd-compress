import './App.css';
import Canvas from './Canvas';
import Slider from './Slider';
import GalleryButton from './GalleryButton';

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
  const [currentImage, setCurrentImage] = useState(0);
  const images = useRef([horizon, bridge, city, origami, shore, squid, pole, tapir]);
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
      <div>
        <button
          onClick={() => {
            setCurrentImage(currentImage - 1);
            setUiDisabled(true)
          }}
          disabled={currentImage <= 0 ? true : uiDisabled}
          className="button"
        >
          Previous
        </button>
        <button
          onClick={() => {
            setCurrentImage(currentImage + 1);
            setUiDisabled(true)
          }}
          disabled={currentImage >= 7 ? true : uiDisabled}
          className="button"
        >
          Next
        </button>
      </div>
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
