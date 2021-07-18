import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

// TODO: make personal icon

class App extends React.Component {
  constructor(props) {
    super(props);

    this.range = [1, 9];
    // TODO: pass grid in a valid way?
    this.state = { dim: 6, inputs: this.resetInputs(), grid: null };
  }

  setNewDim(newDim) {
    this.setState({ dim: newDim })
  }

  resetInputs() {
    const sides = ["left", "right", "top", "bottom"];
    let map = new Map();

    sides.forEach(x => map.set(x, null));
    return map;
  }

  // TODO write this method
  resetGrid() {
    // reset values in middle of grid
    // reset values in input numbers
    // should call resetInputs
    alert("Write this method!");
  }

  // TODO write this method
  solveGrid() {
    alert("Write this method!");
  }

  // TODO write this method
  updateInput(side, index, value) {
    alert("updateValues called " + side + " " + index + " " + value);
    const inputs = this.state.inputs;
    let arr = inputs.get(side);

    if (arr === null) { arr = (new Array(this.state.dim)).fill(null); }

    arr[index] = value;
    inputs.set(side, arr);

    this.setState({
      inputs: inputs
    })
  }

  render() {
    const min = this.range[0];
    const max = this.range[1];

    return (
      <div>
        <h1>Skyscraper Solver</h1>
        <DimInput startDim={this.state.dim} min={min} max={max} onEnter={(x) => this.setNewDim(x)} />
        <Grid dim={this.state.dim} min={min} max={max} updateInput={(x, y, z) => this.updateInput(x, y, z)} />
        <button onClick={this.solveGrid}>
          Solve
        </button>
        <button onClick={this.resetGrid}>
          Reset Grid
        </button>

      </div>
    );
  }
}

class DimInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.startDim };

    this.handleChange = this.handleChange.bind(this);
    // this.handleEnter = this.handleEnter.bind(this);
  }

  handleChange(event) {
    // this.setState({ value: event.target.value });

    let parsed = parseInt(event.target.value);

    console.log("Entered value:\t" + parsed)

    // ignore non-numerical values
    if (!isNaN(parsed)) {
      // TODO: should alerts tell the user when the values exceed boundaries?
      // ensure any numerical values are betwee min and max
      parsed = Math.min(parsed, this.props.max);
      parsed = Math.max(parsed, this.props.min)

      this.props.onEnter(parsed);
    }

    this.setState({ value: parsed });
  }

  render() {
    return (
      <div>
        <label>
          Enter dimensions (between {this.props.min} and {this.props.max}):
        </label>
        <input type="number" value={this.state.value} min={this.props.min} max={this.props.max} onChange={this.handleChange} />
      </div>
    );
  }
}

class Grid extends React.Component {
  // TODO: set input's value to what the user inputs
  getSideInput(side, index) {
    return (<SideInput max={this.props.dim}
      // value = {this.props.getInputs()}
      updateInput={(x) => this.props.updateInput(side, index, x)} />);
  }

  inputRow(side) {
    const temp = this.getIndicesArray().map(c => this.getSideInput(side, c));
    return (<tr><th></th>{temp}<th></th></tr>);
  };

  getIndicesArray() {
    return ([...Array(this.props.dim).keys()]);
  }

  render() {
    const dim = this.props.dim;

    const indices = this.getIndicesArray();

    const table = indices.map(r => {
      let row = indices.map(c => <th>[{c + 1}, {r + 1}] </th>);

      return (<tr>
        {this.getSideInput("left", r)} {row} {this.getSideInput("right", r)}
      </tr>)
    }
    );

    return (
      <div>
        <h1> Grid {dim} </h1>
        <table>
          {this.inputRow("top")}
          {table}
          {this.inputRow("bottom")}
        </table>
      </div>);

  }
}

class SideInput extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.updateInput(event.target.value);
  }

  render() {
    return (
      <th>
        <input type="number"
          // TODO: should value be passed down from App?
          value={null} min={1} max={this.props.max}
          // onChange={() => this.props.updateValues(side, index, this.value)}
          onChange={this.handleChange}
        />
      </th>);
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
