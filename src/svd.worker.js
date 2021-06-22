import { Matrix, SingularValueDecomposition } from 'ml-matrix';

self.addEventListener("message", e => { /* eslint-disable-line no-restricted-globals */
  let matrix = Matrix.from1DArray(e.data.rows, e.data.columns, e.data.array);
  let svd = new SingularValueDecomposition(matrix, {autoTranspose : true});

  postMessage({
    U: svd.leftSingularVectors.to2DArray(),
    sigma: svd.diagonal.map(Math.round),
    Vt: svd.rightSingularVectors.transpose().to2DArray()
  });
});