import * as React from 'react';
import { FormGroup, InputGroup, InputGroupProps2 } from '@blueprintjs/core';
import random from '../utils/random';

interface ILabelInputGroupProps extends InputGroupProps2 {
    label: string;
    labelInfo?: string;
}

class LabelInputGroup extends React.Component<ILabelInputGroupProps, unknown> {
    idString: string;

    constructor(props: ILabelInputGroupProps) {
        super(props);
        this.idString = Math.floor(random.randUniform() * 1000000000).toString();
    }

    render() {
        return (
            <FormGroup
                label={this.props.label}
                labelFor={this.idString}
                labelInfo={this.props.labelInfo ? this.props.labelInfo : ''}
                style={this.props.style}
            >
                <InputGroup {...this.props} id={this.idString} />
            </FormGroup>
        );
    }
}

export default LabelInputGroup;
