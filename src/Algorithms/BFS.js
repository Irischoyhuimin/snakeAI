import React, { Component } from "react";
import {
  generateAdjacencyMatrix,
  coordinateTogridNum,
  gridNumToCoordinate,
} from "./matrixUtil";

class BFS extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.areaSize)
    this.adjacencyMatrix = generateAdjacencyMatrix(this.props.areaSize);
    this.state = {
      queue: [],
      visited: [],
      path: [],
    };
  }

  findPath = async () => {
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

    let source = coordinateTogridNum(
      this.props.gameState.snake[this.props.gameState.snake.length - 1],
      this.props.areaSize
    );

    const objective = coordinateTogridNum(
      this.props.gameState.food,
      this.props.areaSize
    );

    let visited = new Array(neckAdjustedMatrix.length).fill(false);
    let queue = [];
    let distance = new Array(neckAdjustedMatrix.length).fill(
      Number.MAX_SAFE_INTEGER
    );
    let pred = new Array(neckAdjustedMatrix.length).fill(-1);

    this.setState({
      visited: visited,
      queue: queue,
      path: [],
    });

    

    visited[source] = true;
    queue.push(source);
    distance[source] = 0;

    const bfsAlgo = async () => {
      pathsearch: while (queue.length > 0) {
        let node = queue.shift();
        for (let i = 0; i < neckAdjustedMatrix.length; i++) {
          if (neckAdjustedMatrix[node][i] === 1) {
            if (visited[i] === false) {
              visited[i] = true;
              distance[i] = distance[node] + 1;
              pred[i] = node;
              queue.push(i);
              this.setState({
                visited: visited,
                queue: queue,
              });

              if (this.props.options.visualize) {
                await timer(10);
              }

              if (i === objective) {
                console.log("path found");
                break pathsearch;
              }
            }
          }
        }
      }
    };

    function timer(ms) {
      return new Promise((res) => setTimeout(res, ms));
    }

    await bfsAlgo();

    let reversePath = [];
    let crawl = objective;
    reversePath.push(crawl);
    while (pred[crawl] !== -1) {
      reversePath.push(pred[crawl]);
      crawl = pred[crawl];
    }
    this.setState({
      path: reversePath,
    });

    return reversePath;
  };


  solve = async () => {
    let reversepath = await this.findPath();
    this.props.moveSnake(reversepath);
  };

  render() {
    if (this.props.options.visualize) {
      return (
        <div>
          {this.state.queue.map((node, index) => {
            let segment = gridNumToCoordinate(node, this.props.areaSize);

            const coordinates = {
              left: `${segment[0] * this.props.areaSize.pixelSize}px`,
              top: `${segment[1] * this.props.areaSize.pixelSize}px`,
              width: `${this.props.areaSize.pixelSize}px`,
              height: `${this.props.areaSize.pixelSize}px`,
            };

            return <div className="Queue" style={coordinates} />;
          })}
          {this.state.visited.map((node, index) => {
            if (node === true) {
              let segment = gridNumToCoordinate(index, this.props.areaSize);

              const coordinates = {
                left: `${segment[0] * this.props.areaSize.pixelSize}px`,
                top: `${segment[1] * this.props.areaSize.pixelSize}px`,
                width: `${this.props.areaSize.pixelSize}px`,
                height: `${this.props.areaSize.pixelSize}px`,
              };

              return <div className="Visited" style={coordinates} />;
            }
          })}
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

export default BFS;