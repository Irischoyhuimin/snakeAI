import React, { Component } from "react";
import {
  generateAdjacencyMatrix,
  coordinateTogridNum,
  gridNumToCoordinate,
} from "./matrixUtil";

class Hamiltonian extends Component {
  constructor(props) {
    super(props);
    this.adjacencyMatrix = generateAdjacencyMatrix(this.props.areaSize);
    this.state = {
      path: [],
    };
  }

  findPath = () => {
    // snake cant go backwards
    let snakeneckgridnum =
      this.props.gameState.snake[this.props.gameState.snake.length - 2][1] *
        this.props.areaSize.gridWidth +
      this.props.gameState.snake[this.props.gameState.snake.length - 2][0];
    let snakeheaddgridnum = coordinateTogridNum(
      this.props.gameState.snake[this.props.gameState.snake.length - 1],
      this.props.areaSize
    );

    console.log(snakeneckgridnum);
    console.log(snakeheaddgridnum);

    // Clone 2D array
    let neckAdjustedMatrix = this.adjacencyMatrix.map(function (arr) {
      return arr.slice();
    });

    neckAdjustedMatrix[snakeheaddgridnum][snakeneckgridnum] = 0;
    neckAdjustedMatrix[snakeneckgridnum][snakeheaddgridnum] = 0;

    let path = new Array(neckAdjustedMatrix.length).fill(-1);

    this.setState({
      path: [],
    });

    let source = coordinateTogridNum(
      this.props.gameState.snake[this.props.gameState.snake.length - 1],
      this.props.areaSize
    );

    const objective = coordinateTogridNum(
      this.props.gameState.food,
      this.props.areaSize
    );

    const isSafe = (node, pos) => {
      if (neckAdjustedMatrix[path[pos - 1]][node] === 0) {
        return false;
      }

      for (let i = 0; i < pos; i += 1) {
        if (path[i] === node) {
          return false;
        }
      }

      return true;
    };

    const hamCycleUtil = (pos) => {
      // Base case: all vertices are included in Hamiltonian cycle
      if (pos === neckAdjustedMatrix.length) {
        // If there is an edge from last vertice to first vertice
        if (neckAdjustedMatrix[path[pos - 1]][path[0]] === 1) {
          return true;
        } else {
          return false;
        }
      }

      // Trying to find next vertice that can be added to the hamiltonian path
      for (let v = 1; v < neckAdjustedMatrix.length; v += 1) {
        if (isSafe(v, pos)) {
          path[pos] = v;
          // Recurse to finish the path
          if (hamCycleUtil(pos + 1) === true) {
            return true;
          }

          // If added vertex doesnt meet requirements, remove it
          path[pos] = -1;
        }
      }

      // If no vertices can be added to hamiltonian path, return false
      return false;
    };

    path[0] = 0;

    if (hamCycleUtil(1) === false) {
      console.log("No path");
    }
    return path;
  };

  componentDidMount() {
    this.solve();
  }

  solve = () => {
    let reversepath = this.findPath();

    console.log(reversepath);

    let i = reversepath.length - 1;

    let snakeHead = this.props.gameState.snake[
      this.props.gameState.snake.length - 1
    ];

    let moveSnake = () => {
      setTimeout(() => {
        if (
          reversepath[i] ===
          coordinateTogridNum(snakeHead, this.props.areaSize) + 1
        ) {
          console.log("Moving snake right");
          this.props.moveSnakeRight();
          snakeHead = [snakeHead[0] + 1, snakeHead[1]];
        } else if (
          reversepath[i] ===
          coordinateTogridNum(
            this.props.gameState.snake[this.props.gameState.snake.length - 1],
            this.props.areaSize
          ) -
            1
        ) {
          console.log("Moving snake left");
          this.props.moveSnakeLeft();
          snakeHead = [snakeHead[0] - 1, snakeHead[1]];
        } else if (
          reversepath[i] ===
          coordinateTogridNum(
            this.props.gameState.snake[this.props.gameState.snake.length - 1],
            this.props.areaSize
          ) +
            this.props.areaSize.gridWidth
        ) {
          console.log("Moving snake down");
          this.props.moveSnakeDown();
          snakeHead = [snakeHead[0], snakeHead[1] + 1];
        } else if (
          reversepath[i] ===
          coordinateTogridNum(
            this.props.gameState.snake[this.props.gameState.snake.length - 1],
            this.props.areaSize
          ) -
            this.props.areaSize.gridWidth
        ) {
          console.log("Moving snake up");
          this.props.moveSnakeUp();
          snakeHead = [snakeHead[0], snakeHead[1] - 1];
        }

        i--;
        if (i >= 0) {
          moveSnake();
        }
      }, 10);
    };

    // moveSnake();
  };

  render() {
    if (this.props.options.visualize) {
      return (
        <div>
          {this.state.path.map((node, index) => {
            let segment = gridNumToCoordinate(node, this.props.areaSize);

            const coordinates = {
              left: `${segment[0] * this.props.areaSize.pixelSize}px`,
              top: `${segment[1] * this.props.areaSize.pixelSize}px`,
              width: `${this.props.areaSize.pixelSize}px`,
              height: `${this.props.areaSize.pixelSize}px`,
            };

            return <div className="Path" style={coordinates} />;
          })}
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Hamiltonian;