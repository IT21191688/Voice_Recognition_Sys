import logo from './logo.svg';
import './App.css';
import Editor from './components/Editor';
import GlobalContextProvider from './services/GlobleContext';

function App() {
  return (
    <div className="App">



      <GlobalContextProvider>
        <Editor />
      </GlobalContextProvider>

    </div>
  );
}

export default App;
