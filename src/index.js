import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Matrix, SingularValueDecomposition } from 'ml-matrix';

const A = new Matrix([[3, 2, 2], [2, 3, -2]])
console.log(A)
const A_SVD = new SingularValueDecomposition(A);
console.log(A_SVD.leftSingularVectors.toString());
console.log(A_SVD.diagonalMatrix.toString());
console.log(A_SVD.rightSingularVectors.to2DArray());

console.log(Matrix.diag(A_SVD.diagonal.slice(0, -1)).to2DArray());

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
