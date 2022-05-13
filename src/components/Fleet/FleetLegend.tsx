/* eslint-disable import/no-cycle */
/* eslint-disable react/no-unused-class-component-methods */
import { Button } from '@blueprintjs/core';
import React from 'react';
import Text from '../Text/Text';
import TitledCard from '../Cards/TitledCard';
import FleetManager from './FleetManager';

interface IFleetLegendProps {
    toggle: () => void;
}

interface IFleetStateProps {
    manager?: FleetManager;
}

// eslint-disable-next-line react/prefer-stateless-function
export default class FleetLegend extends React.Component<IFleetLegendProps, IFleetStateProps> {
    constructor(props: IFleetLegendProps) {
        super(props);
        this.state = {};
    }

    setManager = (manager: FleetManager) => {
        this.setState({ manager });
    };

    render() {
        return (
            <TitledCard
                style={{ width: '300px' }}
                title="Legend"
                rightElement={<Button minimal icon="cross" onClick={this.props.toggle} />}
            >
                {this.state.manager &&
                    Object.values(this.state.manager.groups).map((k) => (
                        <Text small key={k.uid} style={{ marginBottom: '0.25em' }}>
                            {k.name}
                        </Text>
                    ))}
            </TitledCard>
        );
    }
}
