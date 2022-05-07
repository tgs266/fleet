/* eslint-disable import/no-cycle */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/no-unstable-nested-components */
import { Alignment, Button, MenuItem } from '@blueprintjs/core';
import { IItemRendererProps, Select } from '@blueprintjs/select';
import React from 'react';
import Text from '../Text/Text';
import TitledCard from '../Cards/TitledCard';
import FleetManager from './FleetManager';

interface IFleetControlsProps {
    toggle: (arg0: boolean) => void;
    isOpen: boolean;
    hovering: string;
    manager?: FleetManager;
}

interface IFleetControlsState {
    manager?: FleetManager;
    dim0?: string;
    dim1?: string;
}

const StringSelect = Select.ofType<string>();

// eslint-disable-next-line react/prefer-stateless-function
export default class FleetControls extends React.Component<
    IFleetControlsProps,
    IFleetControlsState
> {
    constructor(props: IFleetControlsProps) {
        super(props);
        if (this.props.manager) {
            this.state = {
                manager: this.props.manager,
                dim1: this.props.manager.dim1,
                dim0: this.props.manager.dim0,
            };
        } else {
            this.state = {};
        }
    }

    setManager = (manager: FleetManager) => {
        this.setState({ manager, dim1: manager.dim1, dim0: manager.dim0 });
    };

    render() {
        if (!this.state.manager) {
            return null;
        }

        const innerItemRenderer = (item: string, itemProps: IItemRendererProps) => {
            if (!itemProps.modifiers.matchesPredicate) {
                return null;
            }
            return (
                <MenuItem
                    active={itemProps.modifiers.active}
                    disabled={itemProps.modifiers.disabled}
                    key={item}
                    onClick={itemProps.handleClick}
                    text={item}
                />
            );
        };

        return (
            <div style={{ position: 'relative' }}>
                <TitledCard
                    title={`Fleet Controls | Showing ${this.state.dim1} by ${this.state.dim0}`}
                    titleMarginBottom="20px"
                    style={{ width: '100%', height: '400px' }}
                    rightElement={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Text large style={{ marginRight: '0.5em' }}>
                                {this.props.hovering}
                            </Text>
                            <Button
                                minimal
                                data-testid="controls-open"
                                icon={this.props.isOpen ? 'caret-down' : 'caret-up'}
                                onClick={() => {
                                    this.props.toggle(!this.props.isOpen);
                                }}
                            />
                        </div>
                    }
                >
                    <Button
                        data-testid="save-btn"
                        onClick={() => {
                            this.state.manager.setDim0(this.state.dim0);
                            this.state.manager.setDim1(this.state.dim1);
                            this.state.manager.connect();
                        }}
                    >
                        Save
                    </Button>
                    <div style={{ display: 'flex' }}>
                        <div style={{ flexGrow: 1, flexBasis: '50%', marginRight: '10px' }}>
                            <h3>DIMENSION 0</h3>
                            {this.state.manager && (
                                <StringSelect
                                    fill
                                    items={['deployment', 'pod', 'container']}
                                    filterable={false}
                                    itemRenderer={innerItemRenderer}
                                    onItemSelect={(item) => {
                                        this.setState({ dim0: item });
                                    }}
                                    activeItem={this.state.dim0}
                                >
                                    <Button
                                        fill
                                        alignText={Alignment.LEFT}
                                        text={this.state.dim0}
                                        rightIcon="double-caret-vertical"
                                    />
                                </StringSelect>
                            )}
                        </div>
                        <div style={{ flexGrow: 1, flexBasis: '50%', marginLeft: '10px' }}>
                            <h3>DIMENSION 1</h3>
                            {this.state.manager && (
                                <StringSelect
                                    items={['pod', 'container']}
                                    fill
                                    filterable={false}
                                    itemRenderer={innerItemRenderer}
                                    onItemSelect={(item) => {
                                        this.setState({ dim1: item });
                                    }}
                                    activeItem={this.state.dim1}
                                >
                                    <Button
                                        fill
                                        alignText={Alignment.LEFT}
                                        text={this.state.dim1}
                                        rightIcon="double-caret-vertical"
                                    />
                                </StringSelect>
                            )}
                        </div>
                    </div>
                </TitledCard>
            </div>
        );
    }
}
