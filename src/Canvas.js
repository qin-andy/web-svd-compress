
import React, { useRef, useEffect } from 'react'

function Canvas(props) {

  var img = new Image(); 
  img.addEventListener('load', function () {
  }, false);
  img.src = '../public/cat.png';

  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.fillStyle = '#000000'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
  }, [])

  return (
    <canvas ref={canvasRef} {...props} />
  );
}

export default Canvas;
