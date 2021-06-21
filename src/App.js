import './App.css';
import Canvas from './Canvas';
import Slider from './Slider';

import defaultImage from './tapir.png';

import { useEffect, useState } from 'react';

function App(props) {
  const [reduction, setReduction] = useState(300);
  const [width, setWidth] = useState(601);
  const [height, setHeight] = useState(451);
  let imageElement = undefined;

  useEffect(() => {
    imageElement = new Image();
    imageElement.src = defaultImage;
    imageElement.addEventListener('load', () => {
      console.log("w/h of imageelement in app " + imageElement.width + ", " + imageElement.height);
      //setWidth(imageElement.width);
      //setHeight(imageElement.height);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>SVD Compression</h1>
        <Canvas
          width={width}
          height={height}
          original="false"
          reduction={reduction}
          image={defaultImage}
        />
        <h3>Reduction Value: {reduction}</h3>
        <Slider
          width={height}
          height={width}
          reduction={reduction}
          changeReduction={setReduction}
        />
      </header>
    </div>
  );
}

export default App;
