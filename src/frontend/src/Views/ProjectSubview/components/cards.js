import React from 'react';
import { Input, Button, Divider, Card, Dropdown, Form, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Helper } from '../../../Components/Helper'

import ConfirmationModal from './confirmation';
import { verifyTitle } from '../../../modules/ClientInput';

import { canvasTypes } from '../api';
// eslint-disable-next-line
import { FeatureSetting, getConfig, getConfigString } from './FeatureSetting';

const canvasColors = {
    [canvasTypes[0].view]: "violet",
    [canvasTypes[1].view]: "yellow",
    [canvasTypes[2].view]: "red",
    [canvasTypes[3].view]: "green",
    [canvasTypes[4].view]: "blue",
}

export const CanvasCard = (props) => (
    <Card fluid style={{minHeight: "200px"}} color={canvasColors[props.canvas.type]}>
        <Card.Content>
            <Card.Header>
                <Link to={{
                    pathname: "/projects/" + props.project.id + "/editor/"
                        + props.canvas.type.split(" ").join("").toLowerCase(),
                    search: "?id=" + props.canvas.id.toString()
                        + (props.project.tag ? "&tag=" + props.project.tag : ""),
                }}>
                    {props.canvas.title}
                </Link>
                <Card.Description>
                    <h5><p></p><p>{props.canvas.description} </p></h5>
                </Card.Description>
            </Card.Header>
        </Card.Content>
        <Card.Content>
            <Card.Description>
                <p><strong>Canvas Type:</strong> {props.canvas.type} <Helper topic={`canvastype/${props.canvas.type}`}/></p>
                <p><strong>Last edited:</strong> {new Date(props.canvas.timestamp).toLocaleString()}</p>
            </Card.Description>
        </Card.Content>
        <Card.Content extra>
            { (props.project.tag || !props.canEdit) ? undefined :
                <ConfirmationModal trigger={
                    <Button basic floated="right" negative as="a">Delete</Button>
                } icon="remove circle" header="Delete Canvas" content="Do you really want to delete this canvas?"
                onConfirm={props.delete}/>
            }
            {/* <a target="_blank" href={window.location.hostname+":3001/api/v1/projects/"+props.project.id+ "/canvas/"+ props.canvas.id.toString()+"/pdf"}>
                View PDF
            </a> */}
            {/* <Button basic icon="write" floated="left" compact as="a"/> */}
        </Card.Content>
    </Card>
);

export class NewCanvasCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            titleError: false,
        }
        this.configXml = "";
    }


    onCreateCanvas() {
        let title = verifyTitle(this.canvastitle.inputRef.value);
        let description = this.description.inputRef.value;
        let configuration = getConfigString();
        if (!title) {
            return this.setState({titleError: true});
        }
        this.props.actions.createCanvas(
            title,
            this.canvastype.state.value.split(' ').join('').toLowerCase(),
            description,
            configuration
        );
        // console.log("CONFIGURATION HERE: "+configuration);
    }

    render() {
        let canvastypes = this.props.canvastypes;
        return (
            <Card>
                <Card.Content>
                    <Card.Header>
                        <Icon name="plus"/>
                        New Canvas
                    </Card.Header>
                    <Card.Description>
                        <Divider/>
                        <Form>
                            <Form.Field>
                                <Dropdown
                                    ref={(x) => this.canvastype = x}
                                    selection
                                    options={canvastypes}
                                    fluid
                                    scrolling
                                    defaultValue={canvastypes[0].value}
                                />
                            </Form.Field>
                            <Form.Field error={this.state.titleError}>
                                <Input
                                    label={{content: "Title", color: this.state.titleError ? 'red' : undefined}}
                                    fluid
                                    ref={(x) => this.canvastitle = x}
                                    onChange={() => this.setState({titleError: false})}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    label={{content: "Description", color: undefined}}
                                    ref={(x) => this.description = x}
                                    fluid
                                />
                            </Form.Field>
                            <Form.Field>
                                <Button
                                    floated="right"
                                    primary
                                    onClick={() => this.onCreateCanvas()}
                                >
                                    Add
                                </Button>
                                <FeatureSetting parentObj={this} access="pre"/>
                            </Form.Field>
                        </Form>
                    </Card.Description>
                </Card.Content>
            </Card>
        );
    }
}
