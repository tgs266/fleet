/* eslint-disable react/no-unstable-nested-components */
import { Alignment, Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import React, { useEffect, useState } from 'react';
import K8 from '../services/k8.service';

export default function NamespaceSelect(props: {
    style?: React.CSSProperties;
    fill?: boolean;
    lockedNamespace?: string;
    allowAll?: boolean;
    selected: string;
    setSelected: (ns: string) => void;
}) {
    const [namespaces, setNamespaces] = useState([]);

    useEffect(() => {
        K8.namespaces.getNamespaces().then((r) => {
            const ns = r.data.items.map((i) => i.name);
            if (props.allowAll) {
                ns.unshift('_all_');
            }
            setNamespaces(ns);
        });
    }, []);

    const getText = () => {
        if (props.lockedNamespace) {
            return props.lockedNamespace;
        }
        return props.selected === '_all_' ? 'All Namespaces' : props.selected;
    };

    return (
        <Select
            items={namespaces}
            itemRenderer={(item: string, itemProps: any) => {
                const txt = item === '_all_' ? 'All Namespaces' : item;
                return (
                    <MenuItem
                        active={itemProps.modifiers.active}
                        disabled={itemProps.modifiers.disabled}
                        key={item}
                        onClick={itemProps.handleClick}
                        text={txt}
                    />
                );
            }}
            filterable={false}
            onItemSelect={(item: string) => {
                const trueItem = item === 'All Namespaces' ? '_all_' : item;
                props.setSelected(trueItem);
            }}
            activeItem={props.selected}
        >
            <Button
                disabled={!!props.lockedNamespace}
                alignText={Alignment.LEFT}
                fill={props.fill}
                style={props.style}
                rightIcon="double-caret-vertical"
            >
                {getText()}
            </Button>
        </Select>
    );
}
