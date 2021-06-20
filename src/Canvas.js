
import React, { useRef, useEffect } from 'react'
import tapir from './tapir.png';
import { Matrix, SingularValueDecomposition } from 'ml-matrix';

function Canvas(props) {

  function reduceRank(A, rank) {
    let SVD = new SingularValueDecomposition(A);

    let singularVals = SVD.diagonal;
    let reducedSingularVals = [...singularVals.slice(0, -rank), ...Array(rank).fill(0)];
    console.log(reducedSingularVals);
    let newSigma = Matrix.diag(reducedSingularVals);
    let U = SVD.leftSingularVectors;
    let Vt = SVD.rightSingularVectors.transpose();
    return U.mmul(newSigma).mmul(Vt);
  }

  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.fillStyle = '#000000'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)

    var img = new Image();
    img.src = tapir;
    console.log("loaded");
    img.addEventListener('load', function () {
      context.drawImage(img, 0, 0);
      if (props.original === "true") {
        let imgData = context.getImageData(0, 0, 500, 500);
        let r = [];
        let g = [];
        let b = [];
        for (let i = 0; i < imgData.data.length; i += 4) {
          r.push(imgData.data[i]);
          g.push(imgData.data[i + 1]);
          b.push(imgData.data[i + 2]);
        }
        console.log(r);
        console.log(g);
        console.log(b);

        let redMatrix = Matrix.from1DArray(500, 500, r);
        let greenMatrix = Matrix.from1DArray(500, 500, g);
        let blueMatrix = Matrix.from1DArray(500, 500, b)

        let redReduced = reduceRank(redMatrix, 485);
        let greenReduced = reduceRank(greenMatrix, 485);
        let blueReduced = reduceRank(blueMatrix, 485);

        let r2 = redReduced.to1DArray();
        let g2 = greenReduced.to1DArray();
        let b2 = blueReduced.to1DArray();

        for (let i = 0; i < imgData.data.length; i += 4) {
          imgData.data[i] = r2[i / 4];
          imgData.data[i + 1] = g2[i / 4];
          imgData.data[i + 2] = b2[i / 4];
        }

        context.putImageData(imgData, 0, 0);
      }

    }, false);
  }, [])

  return (
    <div>
      <canvas ref={canvasRef} {...props} />
    </div>

  );
}

export default Canvas;
