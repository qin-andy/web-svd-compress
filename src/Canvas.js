import React, { useRef, useEffect } from 'react'
import { Matrix, SingularValueDecomposition } from 'ml-matrix';

function Canvas(props) {
  const SVDs = useRef([0, 0, 0]); // Stores the computed SVDs of an image
  const wh = useRef([props.width, props.height]);
  const ready = useRef(false);

  const canvasRef = useRef(null)

  useEffect(() => {
    props.setUiDisabled(true);
    SVDs.current = [0, 0, 0];

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
      // Updating height and width values according to the loaded img
      // Uses setWidth/setHeight callbacks to update the slider as well
      console.log("Image loaded, beginning initial compress");
      props.setWidth(img.width);
      props.setHeight(img.height);
      wh.current = [img.width, img.height];
      context.canvas.width = img.width;
      context.canvas.height = img.height;
      let canvasWidth = img.width;
      let canvasHeight = img.height;
      context.drawImage(img, 0, 0);

      // Extracting RGB values from canvas into arrays
      console.log("Canvas width and height are " + canvasWidth + " " + canvasHeight);
      let imgData = context.getImageData(0, 0, canvasWidth, canvasHeight);
      let rgb = [[], [], []];

      console.log("Pushing RGB into array");
      for (let i = 0; i < imgData.data.length; i += 4) {
        rgb[0].push(imgData.data[i]);
        rgb[1].push(imgData.data[i + 1]);
        rgb[2].push(imgData.data[i + 2]);
      }

      // Construct RGB matricies from arrays
      console.log("Creating matricies");
      for (let i = 0; i < 3; i++) {
        let rows = canvasHeight;
        let columns = canvasWidth;
        let array = rgb[i];
        let matrix = Matrix.from1DArray(rows, columns, array);
        let svd = new SingularValueDecomposition(matrix, { autoTranspose: true });
        SVDs.current[i] = {
          U: svd.leftSingularVectors,
          sigma: svd.diagonal.map(Math.round),
          Vt: svd.rightSingularVectors.transpose()
        }
      }
      renderCompression();
      props.setUiDisabled(false);
      ready.current = true;

    }, false);
  }, [props.image]);

  // Render new low rank approximation when the reduction changes
  useEffect(() => {
    if (ready.current) {
      console.log("Use effect triggered for reduction: " + props.reduction);
      renderCompression();
    }
  }, [props.reduction]);

  // Rebuilds the image on the given imgData given image SVDs
  async function renderCompression() {
    let width = wh.current[0];
    let height = wh.current[1];
    let rank = props.reduction;
    // Get low rank approximation matricies
    let redSVD = reduceRank(SVDs.current[0], rank);
    let greenSVD = reduceRank(SVDs.current[1], rank);
    let blueSVD = reduceRank(SVDs.current[2], rank);

    // Convert matricies to arrays
    let r2 = redSVD.to1DArray();
    let g2 = greenSVD.to1DArray();
    let b2 = blueSVD.to1DArray();

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

  // Reduces the SVD by the given rank
  function reduceRank(SVD, rank) {
    rank = parseInt(rank);
    let U = SVD.U.subMatrix(0, SVD.U.rows - 1, 0, rank);
    let Vt = SVD.Vt.subMatrix(0, rank, 0, SVD.Vt.columns - 1);
    let newSigma = Matrix.diag(SVD.sigma).subMatrix(0, rank, 0, rank).round();
    let result = U.mmul(newSigma).mmul(Vt).round();
    return result;
  }

  return (
    <div>
      <canvas width={props.width} height={props.height} ref={canvasRef} />
    </div>
  );
}

export default Canvas;
