import React from 'react';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentCreate from 'material-ui/svg-icons/content/create';
import IconButton from 'material-ui/IconButton';

class TextForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputColText: '',
            utterance: props.row.text
        };
    }

    displayIntent() {
        if(this.props.isEditIntent) {
            return (
            <div>
                <TextField
                    key={this.props.row.id + 'isEdit'}
                    value={this.props.editingText}
                    onChange={e => this.props.handleEditIntent(e.target.value)}   
                />
                <IconButton onTouchTap={() => this.props.toggleEditingIntent()}>
                    <ContentCreate />
                </IconButton>
            </div>
            );
        } else {
            return (
                <div>
                    {this.props.row.intent}
                    <IconButton onTouchTap={() => this.props.toggleEditingIntent()}>
                        <ContentCreate />
                    </IconButton>
                </div>
            );
        }    
    }

    handleAddingCol(input) {
        this.setState({ inputColText: input });
    }

    handleAddCol() {
        let text = this.state.inputColText;
        this.props.addCol(this.props.row.id, text);
        this.setState({ inputColText: '' });
    }

    render() {
    return(
        <div className="intentrow">
            {this.displayIntent()}
            <TextField
                key={this.props.uuid+' '+this.props.row.id}
                hintText="Add a new utterance"
                value={this.state.inputColText}
                onChange={e => this.handleAddingCol(e.target.value)}
            />
            <IconButton key={this.props.uuid} onTouchTap={() => this.handleAddCol()}>
                <ContentAdd />
            </IconButton>
            {this.props.row.text.map((u, id) => <li key={id}>{u}</li>)}
        </div>
    )
    }
}

export default TextForm;