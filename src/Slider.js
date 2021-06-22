import React, {useState} from 'react'

function Slider(props) {
  const [value, setValue] = useState(props.reduction);

  // Updates the reduction in App.js once curose is released
  function handleMouseUp(e) {
      setValue(e.target.value);
      props.changeReduction(value) // callback
      console.log(value);
  }

  // Changes the value of the cursor as the use adjusts it
  function handleChange(e) {
    setValue(e.target.value);
  }
  return (
    <
      input
      type="range"
      min="0"
      max={Math.min(props.width, props.height)-1}
      value={value}
      className="slider"
      onMouseUp={handleMouseUp}
      onChange={handleChange}
      disabled={props.disabled}
    />
  )
}

export default Slider;