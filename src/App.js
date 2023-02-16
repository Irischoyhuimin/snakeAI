import React, { Component } from "react";
import SnakeGame from "./SnakeGame/SnakeGame";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import randomColor from "randomcolor";

import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameAreaSettings: {
        gridHeight: 30,
        gridWidth: 50,
        pixelSize: 20,
      },
      algorithm: "BFS",
      visualize: false,
      gameSettings: {
        snakeSpeed: 40,
        enlargeSnake: false,
      },
      score: 0,
      ready: false
    };
  }

  handleScorechange = (val) => {
    this.setState({ score: val });
  };

  handleWindowSize = () => {

    const gameHeight = this.divElement.clientHeight;
    const gameWidth = this.divElement.clientWidth;

    this.setState({ready: false}, () => {
      this.setState({
        gameAreaSettings: {
          gridHeight: Math.floor(gameHeight / 20),
          gridWidth: Math.floor(gameWidth / 20),
          pixelSize: 20
        }
      }, () => {
        this.setState({ready: true}, () => {
          this.refs.SnakeGame.refs.BFS.solve();
        });
        
      });
    })
    
  }

  componentDidMount () {
    this.handleWindowSize();
    window.addEventListener('resize', this.handleWindowSize);
  }
  
  render() {

    return (
      <div className="App">
        <div>
          <Jumbotron
            fluid
            style={{ marginBottom: "0px", backgroundColor: "#008b00" }}
          >
            <Container>
              <h1>🐍Snake AI</h1>
              <p>
                Welcome to my garden! I am Slytherin, I can find food myself but it would be great if you can help me with that.
                There are different ways I can go searching for my good you can take a look.
              </p>
            </Container>
          </Jumbotron>
        </div>
        <div>
          <Container fluid className="h-100">
            <Row className="h-100">
              <Col sm={4} align="center" style={{ margin: "auto" }}>
                <div className="d-flex flex-column h-100">
                  <Row className="justify-content-center">
                    <div id="score">Eaten: {this.state.score} Meals</div>
                  </Row>
                  <Row className="justify-content-center">
                    <Form className="form">
                      <Form.Group as={Row}>
                        <Form.Label column>Different Ways:</Form.Label>
                        <Col>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="success"
                              id="dropdown-basic"
                            >
                              {this.state.algorithm}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => {
                                  this.setState({ algorithm: "BFS" });
                                }}
                              >
                                BFS
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => {
                                  this.setState({ algorithm: "DFS" });
                                }}
                              >
                                DFS
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => {
                                  this.setState({ algorithm: "BestFS" });
                                }}
                              >
                                Greedy Best First Search
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => {
                                  this.setState({ algorithm: "Astar" });
                                }}
                              >
                                A star
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => {
                                  this.setState({ algorithm: "Human" });
                                }}
                              >
                                Human
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row}>
                        <Form.Label column>Algorithm Visualization</Form.Label>
                        <Col>
                          <BootstrapSwitchButton
                            checked={this.state.visualize}
                            onlabel="ON"
                            offlabel="OFF"
                            onChange={(checked: boolean) => {
                              this.setState({ visualize: checked });
                            }}
                          />
                        </Col>
                      </Form.Group>
        
                    </Form>
                  </Row>
                </div>
              </Col>
              <Col sm={8} className="area" id="123">
                <div ref={ divElement => this.divElement = divElement}>
                  {this.state.ready ? <SnakeGame
                    ref="SnakeGame"
                    areaSettings={this.state.gameAreaSettings}
                    algorithm={this.state.algorithm}
                    visualize={this.state.visualize}
                    gameSettings={this.state.gameSettings}
                    gameScore={this.state.score}
                    scoreChangehandler={this.handleScorechange}
                  /> : <h1 className="gameload">loading</h1>}
                  
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default App;