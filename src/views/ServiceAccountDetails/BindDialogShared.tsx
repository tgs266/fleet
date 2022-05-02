/* eslint-disable no-useless-escape */
/* eslint-disable react/no-unstable-nested-components */
import { MenuItem, Position } from '@blueprintjs/core';
import { IItemRendererProps, Suggest } from '@blueprintjs/select';
import React, { Dispatch, SetStateAction } from 'react';
import TwoButtonDialog from '../../components/Dialogs/TwoButtonDialog';
import { ClusterRoleBinding } from '../../models/clusterrole.model';
import { RoleBinding } from '../../models/role.model';
import highlightText from '../../utils/select';

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
            <div id={props.title}>
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
                        const ns = item.namespace ? `/${item.namespace}` : '';
                        const text = `${item.name}${ns}`;
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
                        const ns = item.namespace ? `/${item.namespace}` : '';
                        const text = `${item.name}${ns}`;
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
