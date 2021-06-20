import React, { useRef, useEffect, useState } from 'react'
import tapir from './tapir.png';
import { Matrix, SingularValueDecomposition } from 'ml-matrix';

function Canvas(props) {
  const [rSVD, setRSVD] = useState(0);
  const [gSVD, setGSVD] = useState(0);
  const [bSVD, setBSVD] = useState(0);
  const [imageData, setImageData] = useState(0);
  const [ready, setReady] = useState(false);

  function reduceRank(SVD, rank) {
    console.log("reduceRank called for rank: " + rank);
    let singularVals = SVD.diagonal;
    let reducedSingularVals = singularVals.slice(0, -rank);
    for (let i = 0; i < rank; i++) { // TODO : why didnt the spread operator work?
      reducedSingularVals.push(0);
    }
    let newSigma = Matrix.diag(reducedSingularVals);
    let U = SVD.leftSingularVectors;
    let Vt = SVD.rightSingularVectors.transpose();
    // TODO : round when the SVD is stored as state?
    return U.apply(Math.round).mmul(newSigma.apply(Math.round)).mmul(Vt.apply(Math.round));
  }

  const canvasRef = useRef(null)
  useEffect(() => {
    console.log("Initial useEffect triggered, initializing canvas ref");
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.fillStyle = '#000000';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    var img = new Image();
    img.src = tapir;
    img.addEventListener('load', async function () {
      console.log("Image loaded, beginning initial compress");
      context.drawImage(img, 0, 0);
      if (props.original === "false") {
        let imgData = context.getImageData(0, 0, 500, 500);
        let r = [];
        let g = [];
        let b = [];
        for (let i = 0; i < imgData.data.length; i += 4) {
          r.push(imgData.data[i]);
          g.push(imgData.data[i + 1]);
          b.push(imgData.data[i + 2]);
        }
        let redMatrix = Matrix.from1DArray(500, 500, r);
        let greenMatrix = Matrix.from1DArray(500, 500, g);
        let blueMatrix = Matrix.from1DArray(500, 500, b);

        let redSVD = new SingularValueDecomposition(redMatrix);
        let greenSVD = new SingularValueDecomposition(greenMatrix);
        let blueSVD = new SingularValueDecomposition(blueMatrix);
        setRSVD(redSVD);
        setGSVD(greenSVD);
        setBSVD(blueSVD);
        setImageData(imgData); // TODO: make this state a deep copy
        console.log("Set the red, green, and blue svds in loading use effect");
        renderCompression(imgData, redSVD, greenSVD, blueSVD)
        setReady(true);
      }
    }, false);
  }, [props.original]);

  useEffect(() => {
    if (ready) {
      console.log("Use effect triggered for reduction: " + props.reduction);
      renderCompression(imageData, rSVD, gSVD, bSVD);
    }
  }, [props.reduction]);

  function renderCompression(imgData, redSVD, greenSVD, blueSVD) {
    console.log("Reducing red");
    let redReduced = reduceRank(redSVD, props.reduction);
    console.log("Reducing green");
    let greenReduced = reduceRank(greenSVD, props.reduction);
    console.log("Reducing blue");
    let blueReduced = reduceRank(blueSVD, props.reduction);

    let r2 = redReduced.to1DArray();
    let g2 = greenReduced.to1DArray();
    let b2 = blueReduced.to1DArray();

    for (let i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i] = r2[i / 4];
      imgData.data[i + 1] = g2[i / 4];
      imgData.data[i + 2] = b2[i / 4];
    }
    canvasRef.current.getContext('2d').putImageData(imgData, 0, 0);
    console.log("Reduced image rendered to canvas");
  }

  return (
    <div>
      <canvas ref={canvasRef} width={props.width} height={props.height} />
    </div>

  );
}

export default Canvas;
