import React, { Component } from "react";
import Snake from "./Snake.js";
import SnakeFood from "./SnakeFood.js";
import BFS from "../Algorithms/BFS";
import DFS from "../Algorithms/DFS";
import Hamiltonian from "../Algorithms/Hamiltonian";
import BestFirstSearch from "../Algorithms/BestFirstSearch";
import Astar from "../Algorithms/Astar";
import {
  generateAdjacencyMatrix,
  coordinateTogridNum,
  gridNumToCoordinate,
} from "../Algorithms/matrixUtil";

const initialState = {
  snake: [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  direction: "RIGHT"
};

class SnakeGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snake: [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      food: this.getRandomCoordinate(),
      direction: "RIGHT",
      eaten: false,
      currentAlgo: "BFS"
    };
    let manualsnake;
  }

  getRandomCoordinate = () => {
    const min = 0;
    const xmax = this.props.areaSettings.gridWidth;
    const ymax = this.props.areaSettings.gridHeight;
    let randcor = [
      Math.floor(Math.random() * xmax + min),
      Math.floor(Math.random() * ymax + min),
    ];

    return randcor;
  };

  componentDidUpdate() {
    this.isOutOfBounds();
    this.isSelfBite();
    this.isEat();
  }

  onKeyDown = (e) => {
    e = e || window.event;
    switch (e.keyCode) {
      case 38:
        if (this.state.direction !== "DOWN") {
          this.setState({ direction: "UP" });
        }
        break;
      case 40:
        if (this.state.direction !== "UP") {
          this.setState({ direction: "DOWN" });
        }
        break;
      case 37:
        if (this.state.direction !== "RIGHT") {
          this.setState({ direction: "LEFT" });
        }
        break;
      case 39:
        if (this.state.direction !== "LEFT") {
          this.setState({ direction: "RIGHT" });
        }
        break;
      default:
        break;
    }
  };

  moveSnake = () => {
    let segments = [...this.state.snake];
    let head = segments[segments.length - 1];

    switch (this.state.direction) {
      case "UP":
        head = [head[0], head[1] - 1];
        break;
      case "DOWN":
        head = [head[0], head[1] + 1];
        break;
      case "LEFT":
        head = [head[0] - 1, head[1]];
        break;
      case "RIGHT":
        head = [head[0] + 1, head[1]];
        break;
      default:
        break;
    }
    segments.push(head);
    segments.shift();
    this.setState({ snake: segments });
  };

  moveSnakeUp = () => {
    this.setState({ direction: "UP" });
    let segments = [...this.state.snake];
    let head = segments[segments.length - 1];
    head = [head[0], head[1] - 1];
    segments.push(head);
    segments.shift();
    this.setState({ snake: segments });
  };

  moveSnakeDown = () => {
    this.setState({ direction: "DOWN" });
    let segments = [...this.state.snake];
    let head = segments[segments.length - 1];
    head = [head[0], head[1] + 1];
    segments.push(head);
    segments.shift();
    this.setState({ snake: segments });
  };

  moveSnakeLeft = () => {
    this.setState({ direction: "LEFT" });
    let segments = [...this.state.snake];
    let head = segments[segments.length - 1];
    head = [head[0] - 1, head[1]];
    segments.push(head);
    segments.shift();
    this.setState({ snake: segments });
  };

  moveSnakeRight = () => {
    this.setState({ direction: "RIGHT" });
    let segments = [...this.state.snake];
    let head = segments[segments.length - 1];
    head = [head[0] + 1, head[1]];
    segments.push(head);
    segments.shift();
    this.setState({ snake: segments });
  };

  isOutOfBounds = () => {
    let head = this.state.snake[this.state.snake.length - 1];
    if (
      head[0] >= this.props.areaSettings.gridWidth ||
      head[1] >= this.props.areaSettings.gridHeight ||
      head[0] < 0 ||
      head[1] < 0
    ) {
      this.gameOver();
    }
  };

  gameOver = () => {
    alert(`Game Over! Your score is ${this.props.gameScore}`);
    this.setState(initialState);
    this.setState({ food: this.getRandomCoordinate(), currentAlgo: this.props.algorithm }, () => {
      clearInterval(this.manualsnake);
      switch (this.state.currentAlgo) {
        case "BFS":
          this.refs.BFS.solve();
          break;
        case "DFS":
          this.refs.DFS.solve();
          break;
        case "BestFS":
          this.refs.BestFirstSearch.solve();
          break;
        case "Astar":
          this.refs.Astar.solve();
          break;
        case "Human":
          this.manualsnake = setInterval(this.moveSnake, this.props.gameSettings.snakeSpeed);
          break;
        default:
          break;
      }
    });
    
    this.props.scoreChangehandler(0);
  };

  isSelfBite = () => {
    let segments = [...this.state.snake];
    let head = segments[segments.length - 1];

    segments.pop();

    segments.forEach((segment) => {
      if (segment[0] === head[0] && segment[1] === head[1]) {
        alert("BIT YOURSELF");
        this.gameOver();
      }
    });
  };

  isEat = () => {
    let head = this.state.snake[this.state.snake.length - 1];

    if (head[0] === this.state.food[0] && head[1] === this.state.food[1]) {

      if (this.props.gameSettings.enlargeSnake) {
        this.increaseLength();
      }

      this.props.scoreChangehandler(this.props.gameScore + 1);

      this.setState(
        { food: this.getRandomCoordinate(), currentAlgo: this.props.algorithm},
        () => {
          clearInterval(this.manualsnake);
          switch (this.state.currentAlgo) {
            case "BFS":
              this.refs.BFS.solve();
              break;
            case "DFS":
              this.refs.DFS.solve();
              break;
            case "BestFS":
              this.refs.BestFirstSearch.solve();
              break;
            case "Astar":
              this.refs.Astar.solve();
              break;
            case "Human":
              this.manualsnake = setInterval(this.moveSnake, this.props.gameSettings.snakeSpeed);
              document.onkeydown = this.onKeyDown;
            default:
              break;
          }
        }
      );
    }
  };

  increaseLength = () => {
    let segments = [...this.state.snake];
    segments.unshift([]);
    this.setState({ snake: segments });
  };

  algoMoveSnake = (reversepath) => {
    let i = reversepath.length - 1;
    
    const move = () => {

      let snakeHead = this.state.snake[
        this.state.snake.length - 1
      ];

      setTimeout(() => {
        if (
          reversepath[i] ===
          coordinateTogridNum(snakeHead, this.props.areaSettings) + 1
        ) {
          console.log("Moving snake right");
          this.moveSnakeRight();
        } else if (
          reversepath[i] ===
          coordinateTogridNum(
            snakeHead,
            this.props.areaSettings
          ) -
            1
        ) {
          console.log("Moving snake left");
          this.moveSnakeLeft();
        } else if (
          reversepath[i] ===
          coordinateTogridNum(
            snakeHead,
            this.props.areaSettings
          ) +
          this.props.areaSettings.gridWidth
        ) {
          console.log("Moving snake down");
          this.moveSnakeDown();
        } else if (
          reversepath[i] ===
          coordinateTogridNum(
            snakeHead,
            this.props.areaSettings
          ) -
          this.props.areaSettings.gridWidth
        ) {
          console.log("Moving snake up");
          this.moveSnakeUp();
        } else {
          console.log(reversepath[i])
          console.log(snakeHead)
          console.log("illegal move")
        }

        i--;
        if (i >= 0) {
          move();
        }
      }, this.props.gameSettings.snakeSpeed);
    };

    move();
  }

  render() {
    const gameArea = {
      width: `${
        this.props.areaSettings.gridWidth * this.props.areaSettings.pixelSize
      }px`,
      height: `${
        this.props.areaSettings.gridHeight * this.props.areaSettings.pixelSize
      }px`,
    };

    const bfs = (
      <BFS
        ref="BFS"
        gameState={this.state}
        areaSize={this.props.areaSettings}
        moveSnake={this.algoMoveSnake}
        options={{
          visualize: this.props.visualize,
          snakeSpeed: this.props.gameSettings.snakeSpeed,
        }}
      />
    );

    const dfs = (
      <DFS
        ref="DFS"
        gameState={this.state}
        areaSize={this.props.areaSettings}
        moveSnake={this.algoMoveSnake}
        options={{
          visualize: this.props.visualize,
          snakeSpeed: this.props.gameSettings.snakeSpeed,
        }}
      />
    );

    const hamil = (
      <Hamiltonian
        ref="HAMIL"
        gameState={this.state}
        areaSize={this.props.areaSettings}
        moveSnake={this.algoMoveSnake}
        options={{
          visualize: this.props.visualize,
          snakeSpeed: this.props.gameSettings.snakeSpeed,
        }}
      />
    );

    const bestFS = (
      <BestFirstSearch
        ref="BestFirstSearch"
        gameState={this.state}
        areaSize={this.props.areaSettings}
        moveSnake={this.algoMoveSnake}
        options={{
          visualize: this.props.visualize,
          snakeSpeed: this.props.gameSettings.snakeSpeed,
        }}
      />
    );

    const aStar = (
      <Astar
        ref="Astar"
        gameState={this.state}
        areaSize={this.props.areaSettings}
        moveSnake={this.algoMoveSnake}
        options={{
          visualize: this.props.visualize,
          snakeSpeed: this.props.gameSettings.snakeSpeed,
        }}
      />
    );

    let algorithm;

    switch (this.state.currentAlgo) {
      case "BFS":
        algorithm = bfs;
        break;
      case "DFS":
        algorithm = dfs;
        break;
      case "Hamil":
        algorithm = hamil;
        break;
      case "BestFS":
        algorithm = bestFS;
        break;
      case "Astar":
        algorithm = aStar;
        break;
      default:
        break;
    }

    return (
      <div className="GameArea">
        <Snake
          snake={this.state.snake}
          pixelSize={this.props.areaSettings.pixelSize}
        />
        <SnakeFood
          coordinates={this.state.food}
          pixelSize={this.props.areaSettings.pixelSize}
        />
        {algorithm}
      </div>
    );
  }
}

export default SnakeGame;