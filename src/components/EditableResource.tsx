import { Button, Intent } from '@blueprintjs/core';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavContext } from '../layouts/Navigation';
import { appendToButtons } from '../utils/breadcrumbs';
import api from '../services/axios.service';
import TextEditDialog from './Dialogs/TextEditDialog';
import Toaster from '../services/toast.service';
import { JSONObject } from '../models/json.model';

export default function EditableResource(props: {
    type: string;
    namespace?: string;
    name: string;
    refresh?: () => void;
}) {
    const [state, setState] = useNavContext();
    const [value, setValue] = useState({});
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    const get = () => {
        if (props.namespace) {
            api.get(`/api/v1/raw/${props.type}/${props.namespace}/${props.name}`).then((r) => {
                setValue(r.data);
                toggle();
            });
        } else {
            api.get(`/api/v1/raw/${props.type}/${props.name}`).then((r) => {
                setValue(r.data);
                toggle();
            });
        }
    };

    const save = (newValue: JSONObject) => {
        if (props.namespace) {
            api.put(`/api/v1/raw/${props.type}/${props.namespace}/${props.name}`, newValue)
                .then(() => {
                    toggle();
                })
                .catch((err: Error | AxiosError) => {
                    Toaster.show({ message: err.message, intent: Intent.DANGER });
                });
        } else {
            api.put(`/api/v1/raw/${props.type}/${props.name}`, newValue)
                .then(() => {
                    toggle();
                })
                .catch((err: Error | AxiosError) => {
                    Toaster.show({ message: err.message, intent: Intent.DANGER });
                });
        }
        if (props.refresh) {
            props.refresh();
        }
    };

    useEffect(() => {
        appendToButtons(
            state,
            setState,
            <Button
                key="resource-edit"
                data-testid="resource-edit"
                icon="edit"
                onClick={() => get()}
            />
        );
    }, []);

    return (
        <TextEditDialog
            equiv="kubectl apply -f {changes}"
            initialValue={value}
            onSave={save}
            onClose={toggle}
            isOpen={isOpen}
        />
    );
}
