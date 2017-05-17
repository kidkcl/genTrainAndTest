import React from 'react';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import '../css/AddIntent.css';

const actionbtnStyle = {
    marginRight: 20,
};

function AddIntent(props) {
    return (
        <div className="addintent">
            <TextField  hintText="Add a new intent"
                        value={props.input}
                        onChange={e => props.handleInputText(e.target.value)}
                        className="addintent-text"
                        key={props.uuid}
            />
            <FloatingActionButton mini={true} style={actionbtnStyle} onTouchTap={() => props.handleSend()} >
                <ContentAdd />
            </FloatingActionButton>
        </div>
    );
}

export default AddIntent;