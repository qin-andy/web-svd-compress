import React, { useState } from 'react'

function GalleryButton(props) {
  const [value, setValue] = useState(props.reduction);

  function handleChange(e) {
    setValue(e.target.value);
  }
  return (
    <button className="button">
      Next
    </button>
  )
}

export default GalleryButton;