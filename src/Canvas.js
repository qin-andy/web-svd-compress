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

  // This effect runs ONCE
  // This effect runs AFTER the component is mounted, so we know we can interact with the canvas
  // This effect renders the initial image onto the canvas, creates SVD matricies, renders
  // an initial compression, and then sets the ready flag to allow for further renderings
  useEffect(() => {
    // Initialize a canvas of initial props width and height, painting the inside black
    console.log("Initial useEffect triggered, initializing canvas ref");
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = '#000000';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    // Begin loading image
    console.log("Begin loading image");
    var img = new Image();
    img.src = props.image;

    // Start manipulating image only after image has loaded
    img.addEventListener('load', function () {
      // TODO : Remove this event listener ^^^

      // Updating height and width values according to the loaded img
      // Uses setWidth/setHeight callbacks to update the slider as well
      console.log("Image loaded, beginning initial compress");
      props.setWidth(img.width);
      props.setHeight(img.height);
      context.canvas.width = img.width;
      context.canvas.height = img.height;
      let canvasWidth = img.width;
      let canvasHeight = img.height;
      context.drawImage(img, 0, 0);

      // Extracting RGB values from canvas into arrays
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

      // Construct RGB matricies from arrays
      console.log("Creating matricies");
      // MATRIX ENTRIES ARE (ROW, COLUMN), i.e. (Y, X)
      // WRONG: (WIDTH, HEIGHT)
      // CORRECT: >>>> (HEIGHT, WIDTH) <<<<
      let redMatrix = Matrix.from1DArray(canvasHeight, canvasWidth, r);
      let greenMatrix = Matrix.from1DArray(canvasHeight, canvasWidth, g);
      let blueMatrix = Matrix.from1DArray(canvasHeight, canvasWidth, b);

      // Compute SVDs for each matrix
      // TODO : would it be better to just handle hte matricies directly? would save memory
      console.log("Computing SVDs");
      let redSVD = new SingularValueDecomposition(redMatrix, { autoTranspose: true });
      let greenSVD = new SingularValueDecomposition(greenMatrix, { autoTranspose: true });
      let blueSVD = new SingularValueDecomposition(blueMatrix, { autoTranspose: true });
      let decomps = [redSVD, greenSVD, blueSVD];

      // Construct proprietary SVD objects
      console.log("Mapping svds to SVD obj");
      decomps = decomps.map(svd => { // TODO : mapping vs iteration?
        return {
          U: svd.leftSingularVectors, // TODO : round or not round? performance?
          sigma: svd.diagonal,
          Vt: svd.rightSingularVectors.transpose()
        }
      });
      SVDs.current = decomps; // Store them as refs

      // Initial render the SVDs by the reduction
      console.log("Set the red, green, and blue svds in loading use effect");
      renderCompression(
        canvasWidth,
        canvasHeight,
        SVDs.current[0],
        SVDs.current[1],
        SVDs.current[2],
        props.reduction
      );
      ready.current = true;
    }, false);
  }, []);

  // Render new low rank approximation when the reduction changes
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
    let result = U.mmul(newSigma).mmul(Vt).round();
    return result;
  }

  // Rebuilds the image on the given imgData given image SVDs
  function renderCompression(width, height, redSVD, greenSVD, blueSVD, rank) {
    // Get low rank approximation matricies
    let redReduced = reduceRank(redSVD, rank);
    let greenReduced = reduceRank(greenSVD, rank);
    let blueReduced = reduceRank(blueSVD, rank);

    // Convert matricies to arrays
    let r2 = redReduced.to1DArray();
    let g2 = greenReduced.to1DArray();
    let b2 = blueReduced.to1DArray();

    // Create new image data of the appropriate size
    let imgData = new ImageData(width, height);
    let data = imgData.data;

    // Writing image data using the low rank arrays
    console.log("Writing to image data");
    for (let i = 0; i < data.length; i += 4) {
      data[i] = r2[i / 4];
      data[i + 1] = g2[i / 4];
      data[i + 2] = b2[i / 4];
      data[i + 3] = 255;
    }

    //Render image data to canvas
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
