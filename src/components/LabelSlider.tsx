import * as React from 'react';
import { FormGroup, Slider, SliderProps } from '@blueprintjs/core';

interface ILabelSliderProps extends SliderProps {
    label: React.ReactNode;
    labelInfo?: string;
    id?: string;
    testid?: string;
}

class LabelSlider extends React.Component<ILabelSliderProps, unknown> {
    idString: string;

    constructor(props: ILabelSliderProps) {
        super(props);
        this.idString = Math.floor(Math.random() * 1000000000).toString();
    }

    render() {
        return (
            <FormGroup
                label={this.props.label}
                labelFor={this.idString}
                labelInfo={this.props.labelInfo ? this.props.labelInfo : ''}
            >
                <div id={this.idString}>
                    <Slider data-testid={this.props.testid} id={this.props.id} {...this.props} />
                </div>
            </FormGroup>
        );
    }
}

export default LabelSlider;
