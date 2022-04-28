/* eslint-disable no-useless-escape */
/* eslint-disable react/no-unstable-nested-components */
import { MenuItem, Position } from '@blueprintjs/core';
import { IItemRendererProps, Suggest } from '@blueprintjs/select';
import React, { Dispatch, SetStateAction } from 'react';
import TwoButtonDialog from '../../components/Dialogs/TwoButtonDialog';
import { ClusterRoleBinding } from '../../models/clusterrole.model';
import { RoleBinding } from '../../models/role.model';

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

export default function BindDialogShared(props: {
    title: string;
    isOpen: boolean;
    onSuccess: () => void;
    onFailure: () => void;
    items: RoleBinding[] | ClusterRoleBinding[];
    selectedItem: RoleBinding | ClusterRoleBinding;
    setSelectedItem:
        | Dispatch<SetStateAction<RoleBinding>>
        | Dispatch<SetStateAction<ClusterRoleBinding>>;
}) {
    return (
        <TwoButtonDialog
            title={props.title}
            successText="Save"
            onFailure={props.onFailure}
            onSuccess={props.onSuccess}
            isOpen={props.isOpen}
            maxWidth="md"
        >
            <div>
                <Suggest
                    fill
                    popoverProps={{
                        usePortal: false,
                        popoverClassName: 'small-popover',
                        position: Position.BOTTOM,
                    }}
                    onItemSelect={props.setSelectedItem}
                    selectedItem={props.selectedItem}
                    items={props.items}
                    inputValueRenderer={(item: RoleBinding) => item.name}
                    itemRenderer={(item: RoleBinding, itemPrps: IItemRendererProps) => {
                        if (!itemPrps.modifiers.matchesPredicate) {
                            return null;
                        }
                        const text = `${item.name}${item.namespace ? `/${item.namespace}` : ''}`;
                        return (
                            <MenuItem
                                active={itemPrps.modifiers.active}
                                disabled={itemPrps.modifiers.disabled}
                                onClick={itemPrps.handleClick}
                                label={`Role: ${item.roleName}`}
                                key={item.uid}
                                text={highlightText(text, itemPrps.query)}
                            />
                        );
                    }}
                    itemPredicate={(query, item: RoleBinding, _index, exactMatch) => {
                        const text = `${item.name}${item.namespace ? `/${item.namespace}` : ''}`;
                        const normalizedTitle = text.toLowerCase();
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
