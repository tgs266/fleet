import { Button, Card, Collapse, MaybeElement, IconName } from '@blueprintjs/core';
import * as React from 'react';
import PropTypes from 'prop-types'; // ES6

interface IAccordionState {
    isControlled: boolean;
    isOpen: boolean;
}
interface IAccordionProps {
    isOpen?: boolean;
    onChange?: () => void;
    iconClosed?: IconName | MaybeElement;
    iconOpen?: IconName | MaybeElement;
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
        let icon = this.props.iconClosed;
        if (!icon) {
            icon = this.isOpen() ? 'arrow-up' : 'arrow-down';
        } else {
            icon = this.isOpen() ? this.props.iconOpen : this.props.iconClosed;
        }

        return (
            <Card
                className={this.props.className}
                style={{ paddingTop: '10px', paddingBottom: '10px', ...this.props.style }}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flexGrow: 1 }}>{this.props.title}</div>
                    <Button
                        style={{ margin: 'auto 0' }}
                        icon={icon}
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
