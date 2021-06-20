import './App.css';
import Canvas from './Canvas';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello There!</h1>
        <Canvas width="500" height="500" original="true" />
        <Canvas width="500" height="500" original="false" />
      </header>
    </div>
  );
}

export default App;
