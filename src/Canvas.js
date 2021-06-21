import React, { useRef, useEffect } from 'react'
import tapir from './tapir.png';
import { Matrix, SingularValueDecomposition } from 'ml-matrix';

/**
 * Process goes like this:
 * 1. Canvas component is mounted onto page
 * 2. Sets references to canvas HTMLElement
 * 3. Loads image from file
 * 4. After image is loaded, render it onto canvas
 * 5. Extract RGB from canvas image
 * 6. Store RGB in matrix
 * 7. Apply SVD to RGB matricies and store their values
 * 8. Using SVDs, reduce rank, construct a low rank approximation
 * 9. Rebuild image RGB values using low rnak approximation
 * 10. Rerender image onto canvas
 */

function Canvas(props) {
  const SVDs = useRef([]); // Stores the computed SVDs of an image
  const imageData = useRef({}); // Stores the imageData for canvas context
  const ready = useRef(false);

  // Reduces the SVD by the given rank
  function reduceRank(SVD, rank) {
    rank = parseInt(rank);
    let reducedSingularVals = SVD.sigma;//.slice(0, -rank);
    let Vt = SVD.Vt.subMatrix(0, rank, 0, SVD.Vt.columns-1);
    let U = SVD.U.subMatrix(0, SVD.U.rows-1, 0, rank);
    let newSigma = Matrix.diag(reducedSingularVals).subMatrix(0, rank, 0, rank);
    return U.mmul(newSigma).mmul(Vt);
  }

  // After the component is mounted, need to get the reference to the canvas context
  const canvasRef = useRef(null)
  useEffect(() => {
    console.log("Initial useEffect triggered, initializing canvas ref");
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = '#000000';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    var img = new Image();
    img.src = props.image;

    // Start manipulating image only after image has loaded
    img.addEventListener('load', function () {
      context.canvas.width = props.width;//img.width;
      context.canvas.height = props.height;//img.height;

      console.log("Image loaded, beginning initial compress");
      context.drawImage(img, 0, 0);

      console.log("Canvas width and height are " + context.canvas.width + " " + context.canvas.height);
      let imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
      let r = []; // TODO : could restructure rgb to be a single object and map?
      let g = [];
      let b = [];
      console.log("Pushing RGB into array");
      for (let i = 0; i < imgData.data.length; i += 4) {
        r.push(imgData.data[i]);
        g.push(imgData.data[i + 1]);
        b.push(imgData.data[i + 2]);
      }
      console.log("Creating matricies");
      console.log("context canvas w/h: " + context.canvas.width + "," + context.canvas.height);
      console.log(r);
      let redMatrix = Matrix.from1DArray(context.canvas.width, context.canvas.height, r); // TODO : context.canvas.height
      let greenMatrix = Matrix.from1DArray(context.canvas.width, context.canvas.height, g); // VS img.height??
      let blueMatrix = Matrix.from1DArray(context.canvas.width, context.canvas.height, b);

      console.log("Computing SVDs");
      let redSVD = new SingularValueDecomposition(redMatrix, {autoTranspose: true});
      let greenSVD = new SingularValueDecomposition(greenMatrix, {autoTranspose: true});
      let blueSVD = new SingularValueDecomposition(blueMatrix, {autoTranspose: true});
      let decomps = [redSVD, greenSVD, blueSVD];

      decomps = decomps.map(svd => { // TODO : mapping vs iteration?
        return {
          U: svd.leftSingularVectors.apply(Math.round), // TODO : round or not round? performance?
          sigma: svd.diagonal.map(Math.round),
          Vt: svd.rightSingularVectors.apply(Math.round).transpose()
        }
      });

      SVDs.current = decomps;
      imageData.current = imgData // TODO: make this state a deep copy
      console.log("Set the red, green, and blue svds in loading use effect");
      renderCompression(SVDs.current[0], SVDs.current[1], SVDs.current[2], props.reduction);
      // TODO : ^ should i pass props.reduction here? where does it make sense to store this initial value?
      ready.current = true;
    }, false);
  }, []);

  useEffect(() => {
    if (ready.current) {
      console.log("Use effect triggered for reduction: " + props.reduction);
      renderCompression(
        SVDs.current[0],
        SVDs.current[1],
        SVDs.current[2],
        props.reduction);
    }
  }, [props.reduction]);

  // Rebuilds the image on the given imgData given image SVDs
  function renderCompression(redSVD, greenSVD, blueSVD, rank) {
    let redReduced = reduceRank(redSVD, rank);
    let greenReduced = reduceRank(greenSVD, rank);
    let blueReduced = reduceRank(blueSVD, rank);

    let r2 = redReduced.to1DArray().map(Math.round);
    let g2 = greenReduced.to1DArray().map(Math.round);
    let b2 = blueReduced.to1DArray().map(Math.round);
    let imgData = new ImageData(props.width, props.height)
    console.log(imgData.data);
    console.log(r2);

    for (let i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i] = r2[i / 4];
      imgData.data[i + 1] = g2[i / 4];
      imgData.data[i + 2] = b2[i / 4];
      imgData.data[i + 3] = 255;
    }
    console.log(imgData.data);
    canvasRef.current.getContext('2d').putImageData(imgData, 0, 0);
    console.log("Reduced image rendered to canvas");
  }

  return (
    <div>
      <canvas width={props.width} height={props.height} ref={canvasRef} />
    </div>
  );
}

export default Canvas;
