import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';

import AddIntent from './AddIntent';
import TextForm from './TextForm';
import ShuffleData from './ShuffleData';
import NewId from './NewId';
import '../css/App.css';

injectTapEventPlugin();

class App extends Component {

  constructor() {
    super();
    this.state = {
      data: [],
      shuffleJson: [],
      fileJson: [],
      inputText: '',
      editIntentText: '',
      rowNum: 0,
    };
  }

  componentWillMount() {
    this.uuid = NewId();
  }

  componentDidMount() {
    let rowNum = this.state.rowNum;
    fetch('/api')
      .then(res => res.json())
      .then((d) => {
        rowNum = d.length;
        const apiData = d;
        apiData.map((d, id) => {
          const newIntent = d;
          newIntent.id = id;
          newIntent.isEdit = false;
          return newIntent;
        })
        return this.setState({ data: apiData, rowNum: rowNum });
      })
      .catch(err => console.error(err));
  }

  handleInputText(input) {
    this.setState({ inputText: input });
  }

  handleAddIntent() {
    const inputText = this.state.inputText;
    const id = this.state.rowNum;
    fetch('/api/intent', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputText,
      }),
    })
    .then(res => res.json())
    .then((d) => {
      const data = this.state.data;
      const newIntent = d;
      newIntent.id = id;
      newIntent.isEdit = false;
      data.push(newIntent);
      this.setState({ data })
    })
    .catch(err => console.log(err));
    this.setState({ inputText: '' });
    this.setState({ rowNum: id + 1 });
  }

  toggleEditingIntent(id) {
    let data = this.state.data;
    let text = this.state.editIntentText;

    if(text) {
      data[id].intent = text;
      fetch(`/api/intent/${id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
        }),
      })
      .then(res => res.json())
      .then((d) => {
        const post = d;
        console.log(post)
      })
      .catch(err => console.log(err));
      this.setState({ editIntentText: '' });
    } else {
      this.setState({ editIntentText: data[id].intent });
    }
    data[id].isEdit = !data[id].isEdit;
    this.setState({ data: data });
  }

  handleEditIntent(input) {
    this.setState({ editIntentText: input });
  }

  handleAddCol(id, text) {
    let data = this.state.data;
    if(!text) {
      return (alert("utterance can't be empty!!!"));
    } else {
      console.log(text);
      fetch(`/api/utterance/${id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
        }),
      })
      .then(res => res.json())
      .then((d) => {
        const utt = d;
        data[id].text = d.text;
        console.log(data[id].text);
        this.setState({ data: data });
      })
      .catch(err => console.log(err));
    }
  }

  getShuffleData() {
    fetch('/api/shuffle')
      .then(res => res.json())
      .then((d) => this.setState({ shuffleJson: d }))
      .catch(err => console.log(err));
    // console.log(this.state.shuffleJson);
  }

  downloadJSON() {
    fetch('/api/download')
      .then(res => res.json())
      .then((d) => {
        console.log(d);
        const link = document.createElement("a");
        link.textContent = 'download';
        link.download = 'my_data.json';
        link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(JSON.stringify(d))}`;
        link.click();
      })
      .catch(err => console.log(err));
 

  }

  restart() {
    let data = []
    fetch('/api/restart', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
        })
      })
      .then(res => res.json())
      .catch(err => console.log(err));
      this.setState({ data: [] });
      this.setState({ shuffleJson: [] }); 
  }

  render() {
    return (
      <MuiThemeProvider>
      <div className="App">
        <div className="App-header">
          <h2>Test and Train Generator</h2>
          <AddIntent 
            input={this.state.inputText}
            handleInputText={input => this.handleInputText(input)}
            handleSend={() => this.handleAddIntent()}
            uuid={this.state.rowNum}
          />
        </div>
        <div>
          {this.state.data.map((d, id) =>
            <TextForm 
              key={id}
              row={d}
              uuid={this.uuid}
              isEditIntent={d.isEdit}
              toggleEditingIntent={() => this.toggleEditingIntent(id)}
              handleEditIntent={input => this.handleEditIntent(input)}
              editingText={this.state.editIntentText}
              addCol={(id, text) => this.handleAddCol(id, text)}
            />
          )}
        </div>
        <div className="App-footer">
          <FlatButton label="Shuffle!" onTouchTap={() => this.getShuffleData()}/>
          <FlatButton label="Export" onTouchTap={() => this.downloadJSON()}/>
          <FlatButton label="Restart" primary={true} onTouchTap={() => this.restart()}/>
          {this.state.shuffleJson ? <ShuffleData data={this.state.shuffleJson}/>: null}
        </div>
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
