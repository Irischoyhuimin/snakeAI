import React from "react";

function SnakeFood(props) {
  const coordinates = {
    left: `${props.coordinates[0] * props.pixelSize}px`,
    top: `${props.coordinates[1] * props.pixelSize}px`,
    width: `${props.pixelSize}px`,
    height:`${props.pixelSize}px`
  };

  return <div className="SnakeFood" style={coordinates} />;
}

export default SnakeFood;