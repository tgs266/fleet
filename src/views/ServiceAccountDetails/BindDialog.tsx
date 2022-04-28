/* eslint-disable no-useless-escape */
/* eslint-disable react/no-unstable-nested-components */
import { MenuItem } from '@blueprintjs/core';
import { IItemRendererProps, Suggest } from '@blueprintjs/select';
import React, { useEffect, useState } from 'react';
import TwoButtonDialog from '../../components/Dialogs/TwoButtonDialog';
import { RoleBinding } from '../../models/role.model';
import { BindRequest } from '../../models/serviceaccount.model';
import RoleBindings from '../../services/k8/rolebinding.service';

function escapeRegExpChars(text: string) {
    return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}

function highlightText(text: string, query: string) {
    let lastIndex = 0;
    const words = query
        .split(/\s+/)
        .filter((word) => word.length > 0)
        .map(escapeRegExpChars);
    if (words.length === 0) {
        return [text];
    }
    const regexp = new RegExp(words.join('|'), 'gi');
    const tokens: React.ReactNode[] = [];
    while (true) {
        const match = regexp.exec(text);
        if (!match) {
            break;
        }
        const { length } = match[0];
        const before = text.slice(lastIndex, regexp.lastIndex - length);
        if (before.length > 0) {
            tokens.push(before);
        }
        lastIndex = regexp.lastIndex;
        tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
    }
    const rest = text.slice(lastIndex);
    if (rest.length > 0) {
        tokens.push(rest);
    }
    return tokens;
}

export default function BindDialog(props: {
    isOpen: boolean;
    onSuccess: (br: BindRequest) => void;
    onFailure: () => void;
}) {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState<RoleBinding>(null);

    useEffect(() => {
        RoleBindings.getRoleBindings().then((r) => {
            setItems(r.data.items);
        });
    });

    const successWrapper = () => {
        props.onSuccess({
            targetRoleName: selectedItem.name,
            targetRoleNamespace: selectedItem.namespace,
        });
    };

    return (
        <TwoButtonDialog
            title="Bind to Role"
            successText="Save"
            onFailure={props.onFailure}
            onSuccess={successWrapper}
            isOpen={props.isOpen}
        >
            <div>
                <Suggest
                    fill
                    popoverProps={{ usePortal: false }}
                    onItemSelect={setSelectedItem}
                    selectedItem={selectedItem}
                    items={items}
                    inputValueRenderer={(item: RoleBinding) => item.name}
                    itemRenderer={(item: RoleBinding, itemPrps: IItemRendererProps) => {
                        if (!itemPrps.modifiers.matchesPredicate) {
                            return null;
                        }
                        const text = `${item.name}`;
                        return (
                            <MenuItem
                                active={itemPrps.modifiers.active}
                                disabled={itemPrps.modifiers.disabled}
                                onClick={itemPrps.handleClick}
                                label={item.namespace}
                                key={item.uid}
                                text={highlightText(text, itemPrps.query)}
                            />
                        );
                    }}
                    itemPredicate={(query, item: RoleBinding, _index, exactMatch) => {
                        const normalizedTitle = item.name.toLowerCase();
                        const normalizedQuery = query.toLowerCase();

                        if (exactMatch) {
                            return normalizedTitle === normalizedQuery;
                        }
                        return normalizedTitle.indexOf(normalizedQuery) >= 0;
                    }}
                />
            </div>
        </TwoButtonDialog>
    );
}
