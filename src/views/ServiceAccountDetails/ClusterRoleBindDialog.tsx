/* eslint-disable no-useless-escape */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';
import { RoleBinding } from '../../models/role.model';
import { BindRequest } from '../../models/serviceaccount.model';
import K8 from '../../services/k8.service';
import BindDialogShared from './BindDialogShared';

export default function ClusterRoleBindDialog(props: {
    isOpen: boolean;
    onSuccess: (br: BindRequest) => void;
    onFailure: () => void;
}) {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState<RoleBinding>(null);

    useEffect(() => {
        K8.clusterRoleBindings.list().then((r2) => {
            setItems(r2.data.items);
        });
    }, []);

    const successWrapper = () => {
        props.onSuccess({
            targetRoleName: selectedItem.name,
            targetRoleNamespace: selectedItem.namespace,
        });
    };

    return (
        <BindDialogShared
            title="Bind To Cluster Role"
            isOpen={props.isOpen}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            onSuccess={successWrapper}
            onFailure={props.onFailure}
            items={items}
        />
    );
}
