import React, { useRef, useEffect } from 'react'
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
  const ready = useRef(false);

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
    img.addEventListener('load', function () { // WATCH THIS,,, remove this event listener if canvas is ever removed/
      console.log("Image loaded, beginning initial compress");
      props.setWidth(img.width);
      props.setHeight(img.height);
      let canvasWidth = img.width;
      let canvasHeight = img.height;
      context.canvas.width = canvasWidth;
      context.canvas.height = canvasHeight;
      context.drawImage(img, 0, 0);

      console.log("Canvas width and height are " + canvasWidth + " " + canvasHeight);
      let imgData = context.getImageData(0, 0, canvasWidth, canvasHeight);
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
      // MATRIX ENTRIES ARE (ROW, COLUMN), i.e. (Y, X)
      // WRONG: (WIDTH, HEIGHT)
      // CORRECT: >>>> (HEIGHT, WIDTH) <<<<
      let redMatrix = Matrix.from1DArray(canvasHeight, canvasWidth, r);
      let greenMatrix = Matrix.from1DArray(canvasHeight, canvasWidth, g);
      let blueMatrix = Matrix.from1DArray(canvasHeight, canvasWidth, b);

      console.log("Computing SVDs");
      let redSVD = new SingularValueDecomposition(redMatrix, { autoTranspose: true });
      let greenSVD = new SingularValueDecomposition(greenMatrix, { autoTranspose: true });
      let blueSVD = new SingularValueDecomposition(blueMatrix, { autoTranspose: true });
      let decomps = [redSVD, greenSVD, blueSVD];

      console.log("Mapping svds to SVD obj");
      decomps = decomps.map(svd => { // TODO : mapping vs iteration?
        return {
          U: svd.leftSingularVectors, // TODO : round or not round? performance?
          sigma: svd.diagonal,
          Vt: svd.rightSingularVectors.transpose()
        }
      });

      SVDs.current = decomps;
      console.log("Set the red, green, and blue svds in loading use effect");
      renderCompression(canvasWidth, canvasHeight, SVDs.current[0], SVDs.current[1], SVDs.current[2], props.reduction);
      // TODO : ^ should i pass props.reduction here? where does it make sense to store this initial value?
      ready.current = true;
    }, false);
  }, []);


  useEffect(() => {
    if (ready.current) {
      console.log("Use effect triggered for reduction: " + props.reduction);
      renderCompression(
        props.width,
        props.height,
        SVDs.current[0],
        SVDs.current[1],
        SVDs.current[2],
        props.reduction);
    }
  }, [props.reduction]);

  // Reduces the SVD by the given rank
  function reduceRank(SVD, rank) {
    rank = parseInt(rank);
    let U = SVD.U.subMatrix(0, SVD.U.rows - 1, 0, rank);
    let Vt = SVD.Vt.subMatrix(0, rank, 0, SVD.Vt.columns - 1);
    let newSigma = Matrix.diag(SVD.sigma).subMatrix(0, rank, 0, rank);
    // console.log("U, Sigma, and Vt are: ");
    // console.log(U);
    // console.log(newSigma);
    // console.log(Vt);
    // console.log("The resulting product is: ");
    let result = U.mmul(newSigma).mmul(Vt).round();
    return result;
    // return SVD.U.mmul(Matrix.diag(SVD.sigma)).mmul(SVD.Vt);
  }

  // Rebuilds the image on the given imgData given image SVDs
  function renderCompression(width, height, redSVD, greenSVD, blueSVD, rank) {
    let redReduced = reduceRank(redSVD, rank);
    let greenReduced = reduceRank(greenSVD, rank);
    let blueReduced = reduceRank(blueSVD, rank);

    let r2 = redReduced.to1DArray();
    let g2 = greenReduced.to1DArray();
    let b2 = blueReduced.to1DArray();

    let imgData = new ImageData(width, height);
    let data = imgData.data;

    console.log("Writing to image data");

    for (let i = 0; i < data.length; i += 4) {
      data[i] = r2[i / 4];
      data[i + 1] = g2[i / 4];
      data[i + 2] = b2[i / 4];
      data[i + 3] = 255;
    }
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
