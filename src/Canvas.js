
import React, { useRef, useEffect } from 'react'
import tapir from './tapir.png';

function Canvas(props) {

  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.fillStyle = '#000000'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)

    var img = new Image();
    img.src = tapir;
    console.log("loaded");
    img.addEventListener('load', function() {
      context.drawImage(img, 0, 0);
    }, false);


  }, [])

  return (
    <div>
      <canvas ref={canvasRef} {...props} />
    </div>

  );
}

export default Canvas;
