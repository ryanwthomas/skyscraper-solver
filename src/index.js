import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import winnowSlice from './sliceSolver';

// TODO: make personal icon
// TODO: update the README

class App extends React.Component {
  constructor(props) {
    super(props);

    this.range = [1, 9];
    const dim = 4;

    this.state = {
      dim: dim,
      inputs: this.resetInputs(dim),
      grid: this.resetGrid(dim)
    };

    this.solveGrid = this.solveGrid.bind(this)
  }

  setNewDim(newDim) {
    this.setState({
      dim: newDim,
      inputs: this.resetInputs(newDim),
      grid: this.resetGrid(newDim),
    })

    console.log(this.state);
  }

  resetInputs(dim) {
    const sides = ["left", "right", "top", "bottom"];
    let map = new Map();

    sides.forEach(x => map.set(x, Array(dim)));
    // console.log("input map follows");
    // console.log(map);
    return map;
  }

  // TODO write this method
  resetGrid(dim) {
    // reset values in middle of grid
    let newGrid = [...Array(dim).keys()].map(x => x + 1);
    newGrid = Array(dim).fill(newGrid);
    newGrid = Array(dim).fill(newGrid);

    return newGrid;
  }

  getCell(x, y) {
    // console.log(`${x},${y} => ${this.state.grid[x][y]}`)
    // return this.state.grid[y][x];
    // TODO: insert line breaks to make the string more square?
    return this.state.grid[y][x].toString();
  }

  // TODO write this method
  solveGrid() {
    const inputs = this.state.inputs;
    // create shallow copy of grid
    // TODO: is this wasteful?
    const grid = this.state.grid.map(x => x.slice());

    function getSlice(side, index) {
      switch (side) {
        case "left":
          return grid[index];
        case "right":
          return grid[index].reverse();
        case "top":
          return grid.map(x => x[index]);
        case "bottom":
          return grid.map(x => x[index]).reverse();
        default:
          return null;
      }
    }

    function setSlice(side, index, newSlice) {
      switch (side) {
        case "left":
          grid[index] = newSlice;
          break;
        case "right":
          grid[index] = newSlice.reverse();
          break;
        case "top":
          [...grid.keys()].forEach(row => grid[row][index] = newSlice[row]);
          break;
        case "bottom":
          newSlice = newSlice.reverse();
          [...grid.keys()].forEach(row => grid[row][index] = newSlice[row]);
          break;
        default:
      }
    }

    // for each side
    (inputs).forEach((array, side) => {

      // for each index on each side
      for (let i = 0; i < this.state.dim; i++) {
        // if input is undefined, skip input
        // TODO: if input is undefined, run simple winnow (e.g. [1],[1,2],[2,3] => [1][2][3])
        if (!array[i]) { continue; }
        const slice = getSlice(side, i);
        const newSlice = winnowSlice(slice, array[i]);
        setSlice(side, i, newSlice);

        console.log(slice);
        console.log(`${side} ${i} => ${array[i]}`);
      }
    });

    this.setState({ grid: grid });

    // alert("Write this method!");
  }


  // TODO write this method
  updateInput(side, index, value) {
    // alert("updateValues called " + side + " " + index + " " + value);
    const inputs = this.state.inputs;
    let arr = inputs.get(side);

    // if (arr === null) { arr = (new Array(this.state.dim)).fill(null); }

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
        <Grid dim={this.state.dim} min={min} max={max}
          updateInput={(x, y, z) => this.updateInput(x, y, z)}
          getInput={(side, index) => {
            return (this.state.inputs.get(side))[index];
            // return "placeholder";
          }}
          getCell={(x, y) => this.getCell(x, y)}
        />
        <button onClick={this.solveGrid}>
          Perform Pass
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

      // don't change grid if the new value is the same as the old value
      if (this.state.dim !== parsed) {
        this.props.onEnter(parsed);
      }
    }

    this.setState({ value: parsed });
  }

  render() {
    return (
      <div>
        <label>
          Enter dimensions (between {this.props.min} and {this.props.max}):
        </label>
        <input type="number" value={this.state.value}
          min={this.props.min} max={this.props.max}
          onChange={this.handleChange} />
      </div>
    );
  }
}

class Grid extends React.Component {
  getIndicesArray() {
    return ([...Array(this.props.dim).keys()]);
  }

  // TODO: set input's value to what the user inputs
  getSideInput(side, index) {
    return (<SideInput max={this.props.dim} key={side + "-" + index}
      // value = {this.props.getInputs()}
      value={this.props.getInput(side, index)}
      updateInput={(x) => this.props.updateInput(side, index, x)} />);
  }

  inputRow(side, key) {
    const inputObjects = this.getIndicesArray().map(c => this.getSideInput(side, c));
    return (<tr key={key}><th></th>{inputObjects}<th></th></tr>);
  };

  render() {
    const dim = this.props.dim;

    const indices = this.getIndicesArray();

    const table = indices.map(r => {
      let row = indices.map(c => <td key={c + "/" + r}>[{this.props.getCell(c, r)}] </td>);

      return (<tr key={r}>
        {this.getSideInput("left", r)}{row}{this.getSideInput("right", r)}
      </tr>)
    }
    );

    return (
      <div>
        <h1> Grid {dim} </h1>
        <table>
          <tbody>
            {this.inputRow("top", -1)}
            {table}
            {this.inputRow("bottom", dim)}
          </tbody>
        </table>
      </div>);
  }
}

class SideInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = { value: this.props.value }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    let parsed = parseInt(event.target.value);

    console.log("Input entered:\t" + parsed)

    // ignore non-numerical values
    if (!isNaN(parsed)) {
      // TODO: should alerts tell the user when the values exceed boundaries?
      // ensure any numerical values are betwee min and max
      parsed = Math.min(parsed, this.props.max);
      parsed = Math.max(parsed, 1)


      // TODO: don't change grid if the new value is the same as the old value
      if (this.state.value !== parsed) {
        this.props.updateInput(parsed);
      }
    } else {
      this.props.updateInput(null);
    }

    this.setState({ value: parsed });
  }

  render() {
    return (
      <th>
        <input type="number"
          // <input type="number" key={this.props.key}
          // TODO: should value be passed down from App?
          value={this.props.value} min={1} max={this.props.max}
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
