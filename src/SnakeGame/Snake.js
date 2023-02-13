import React from "react";

function Snake(props) {
  return (
    <div>
      {props.snake.map((segment, ind) => {
        const coordinates = {
          left: `${segment[0] * props.pixelSize}px`,
          top: `${segment[1] * props.pixelSize}px`,
          width: `${props.pixelSize}px`,
          height:`${props.pixelSize}px`
        };

        return <div className="SnakeSegment" key={ind} style={coordinates} />;
      })}
    </div>
  );
}

export default Snake;