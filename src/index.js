import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dim: 6, grid: null };
  }

  setNewDim(newDim) {
    this.setState({ dim: newDim })
  }

  // TODO write this method
  resetGrid() {
    alert("Write this method!");
  }

  render() {
    const range = [1, 9];

    return (
      <div>
        <h1>Skyscraper Solver</h1>
        <Input startDim={this.state.dim} min={range[0]} max={range[1]} onSubmit={(x) => this.setNewDim(x)} />
        <Grid dim={this.state.dim} />
        <button onClick={this.resetGrid}>
          Reset Grid
        </button>
      </div>
    );
  }
}

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.startDim };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const parsed = parseInt(this.state.value);
    if (isNaN(parsed)) {
      alert("Enter valid number.")
    } else {
      this.props.onSubmit(parsed);
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Enter dimensions (between {this.props.min} and {this.props.max}):
        </label>
        <input type="number" value={this.state.value} min={this.props.min} max={this.props.max} onChange={this.handleChange} />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

class Grid extends React.Component {
  render() {
    const dim = this.props.dim;

    if (dim > 0) {
      // alert("New dim is " + dim + ". Type is " + typeof (dim));
      const indices = [...Array(dim).keys()];

      const table = indices.map(c => {
        let row = indices.map(r => <th>[{c + 1}, {r + 1}] </th>);
        return <tr>{row}</tr>;
      }

      );

      return (
        <div>
          <h1> Grid {dim} </h1>
          <table>
            {table}
          </table>
        </div>);
    } else {
      return (<h1> Grid Goes Here </h1>)
    }
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
