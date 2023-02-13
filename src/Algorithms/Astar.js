import React, { Component } from "react";
import {
  generateAdjacencyMatrix,
  coordinateTogridNum,
  gridNumToCoordinate,
} from "./matrixUtil";
import PriorityQueue from "./DataStructures/PriorityQueue";

class Astar extends Component {
  constructor(props) {
    super(props);
    this.adjacencyMatrix = generateAdjacencyMatrix(this.props.areaSize);
    this.state = {
      priorityQueue: [],
    };
  }

  // returns Manhattan distance where a, b are grid numbers
  heuristic = (a, b) => {
    let aCoordinate = gridNumToCoordinate(a, this.props.areaSize);
    let bCoordinate = gridNumToCoordinate(b, this.props.areaSize);

    return (
      Math.abs(aCoordinate[0] - bCoordinate[0]) +
      Math.abs(aCoordinate[1] - bCoordinate[1])
    );
  };

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

    console.log(snakeheaddgridnum);
    console.log(objective)

    const camefrom = [];
    const costsofar = [];
    camefrom[source] = -1;
    costsofar[source] = 0;

    const priorityQueue = new PriorityQueue();

    priorityQueue.push(source, 0);

    this.setState({
      priorityQueue: priorityQueue.elements(),
    });

    const aStarAlgo = async () => {
      while (!priorityQueue.isEmpty()) {
        let current = priorityQueue.pop();

        if (current === objective) {
          break;
        }

        for (let i = 0; i < neckAdjustedMatrix.length; i += 1) {
          if (neckAdjustedMatrix[current][i] === 1) {
              let newcost = costsofar[current] + 1; // all weights are equal so cost is 1
            if (!camefrom.includes(i) | newcost < costsofar[i]) {
                costsofar[i] = newcost;
              let priority = this.heuristic(objective, i) + newcost;
              priorityQueue.push(i, priority);
              camefrom[i] = current;

              this.setState({
                priorityQueue: priorityQueue.elements(),
              });

              if (this.props.options.visualize) {
                await timer(10);
              }
            }
          }
        }
      }
    };

    function timer(ms) {
      return new Promise((res) => setTimeout(res, ms));
    }

    await aStarAlgo();

    let reversePath = [];
    let crawl = objective;
    reversePath.push(crawl);
    while (camefrom[crawl] !== -1) {
      reversePath.push(camefrom[crawl]);
      crawl = camefrom[crawl];
    }

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
          {this.state.priorityQueue.map((node, index) => {
            let segment = gridNumToCoordinate(node, this.props.areaSize);

            const coordinates = {
              left: `${segment[0] * this.props.areaSize.pixelSize}px`,
              top: `${segment[1] * this.props.areaSize.pixelSize}px`,
              width: `${this.props.areaSize.pixelSize}px`,
              height: `${this.props.areaSize.pixelSize}px`,
            };

            return <div className="Queue" style={coordinates} />;
          })}
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Astar;