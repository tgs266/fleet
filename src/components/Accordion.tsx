import { Button, Card, Collapse } from '@blueprintjs/core';
import * as React from 'react';
import PropTypes from 'prop-types'; // ES6

interface IAccordionState {
    isControlled: boolean;
    isOpen: boolean;
}
interface IAccordionProps {
    isOpen?: boolean;
    onChange?: () => void;
    style?: React.CSSProperties;
    title: PropTypes.ReactNodeLike;
    children: PropTypes.ReactNodeLike;
    rightElement?: PropTypes.ReactNodeLike;
    className?: string;
}

class Accordion extends React.Component<IAccordionProps, IAccordionState> {
    constructor(props: IAccordionProps) {
        super(props);
        this.state = {
            isControlled: props.isOpen === null || props.isOpen === undefined,
            isOpen: false,
        };
    }

    isOpen = () => {
        if (this.state.isControlled) {
            return this.state.isOpen;
        }
        return this.props.isOpen;
    };

    toggle = () => {
        if (this.state.isControlled) {
            this.setState({ isOpen: !this.state.isOpen });
        } else {
            this.props.onChange();
        }
    };

    render() {
        return (
            <Card
                className={this.props.className}
                style={{ paddingTop: '10px', paddingBottom: '10px', ...this.props.style }}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flexGrow: 1 }}>{this.props.title}</div>
                    <Button
                        style={{ margin: 'auto 0' }}
                        icon={this.isOpen() ? 'arrow-up' : 'arrow-down'}
                        onClick={this.toggle}
                        minimal
                    />
                    {this.props.rightElement}
                </div>
                <Collapse isOpen={this.isOpen()}>{this.isOpen() && this.props.children}</Collapse>
            </Card>
        );
    }
}

export default Accordion;
