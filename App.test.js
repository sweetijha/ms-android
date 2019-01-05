import React from 'react';
import App from './App';

import renderer from 'react-test-renderer';
import {AsyncStorage} from "react-native";

it('renders without crashing', () => {
  const rendered = renderer.create(<App />).toJSON();
  expect(rendered).toBeTruthy();
});

const resetTimeout = (id, newID) => {

    clearTimeout(id)
    return newID

}

const SaveMessage = ({visible}) => <div className={'saved' + (visible ? ' saved-visible' : '')}><p>Saved Successfully</p></div>

class App extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            timeout: null,
            value: '',
            saved: false,
        }

    }

    editValue = value => {
        this.setState({timeout: resetTimeout(this.state.timeout, setTimeout(this.saveValue, 400)), value: value})
    };

    saveValue = () => {
        this.setState({...this.state, saved: true})
        setTimeout(() => this.setState({...this.state, saved: false}), 1000)
    };

    render() {
        return (
            <div className="editor">
                <h1>Editor</h1>
                <textarea onChange={ e => this.editValue(e.currentTarget.value)} placeholder="Start typing...">{this.state.value}</textarea>
                <SaveMessage visible={this.state.saved} />
            </div>
        )
    }

}

ReactDOM.render(<App />, document.getElementById('mount'))

