import React, {useState} from 'react'

function Slider(props) {
  const [value, setValue] = useState(props.reduction);

  function handleMouseUp(e) { // TODO : fix delayed mousup value reading
      setValue(e.target.value);
      props.changeReduction(value)
      console.log(value);
  }
  function handleChange(e) {
    setValue(e.target.value);
  }
  return (
    <
      input
      type="range"
      min="0"
      max={Math.min(props.width, props.height)-1} // TODO : Dynamic slider adjustment based on width and height
      value={value}
      className="slider"
      onMouseUp={handleMouseUp}
      onChange={handleChange}
    />
  )
}

export default Slider;