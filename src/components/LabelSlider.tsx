import * as React from 'react';
import { FormGroup, Slider, SliderProps } from '@blueprintjs/core';
import random from '../utils/random';

interface ILabelSliderProps extends SliderProps {
    label: React.ReactNode;
    labelInfo?: string;
}

class LabelSlider extends React.Component<ILabelSliderProps, unknown> {
    idString: string;

    constructor(props: ILabelSliderProps) {
        super(props);
        this.idString = Math.floor(random.randUniform() * 1000000000).toString();
    }

    render() {
        return (
            <FormGroup
                label={this.props.label}
                labelFor={this.idString}
                labelInfo={this.props.labelInfo ? this.props.labelInfo : ''}
            >
                <div id={this.idString}>
                    <Slider {...this.props} />
                </div>
            </FormGroup>
        );
    }
}

export default LabelSlider;
