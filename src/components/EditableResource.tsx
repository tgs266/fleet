import { Button, Intent, MenuItem } from '@blueprintjs/core';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useNavContext } from '../layouts/Navigation';
import { appendToButtons } from '../utils/breadcrumbs';
import api, { getBackendApiUrl } from '../services/axios.service';
import TextEditDialog from './Dialogs/TextEditDialog';
import Toaster, { showToastWithActionInterval } from '../services/toast.service';
import { JSONObject } from '../models/json.model';
import TwoButtonDialog from './Dialogs/TwoButtonDialog';
import Text from './Text/Text';

export default function EditableResource(props: {
    type: string;
    namespace?: string;
    delete?: boolean;
    name: string;
    refresh?: () => void;
}) {
    const [state, setState] = useNavContext();
    const [value, setValue] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    };
    const navigate = useNavigate();

    const handleSuccessNavToast = () => {
        showToastWithActionInterval(
            {
                message: 'Resource Deleted. Redirecting in 5s',
                intent: Intent.SUCCESS,
                action: {
                    onClick: () => navigate(`/${props.type}`),
                    text: 'Go Now',
                },
            },
            5000,
            () => navigate(`/${props.type}`)
        );
    };

    const get = () => {
        if (props.namespace) {
            api.get(
                getBackendApiUrl(`/api/v1/raw/${props.type}/${props.namespace}/${props.name}`)
            ).then((r) => {
                setValue(r.data);
                toggle();
            });
        } else {
            api.get(getBackendApiUrl(`/api/v1/raw/${props.type}/${props.name}`)).then((r) => {
                setValue(r.data);
                toggle();
            });
        }
    };

    const save = (newValue: JSONObject) => {
        if (props.namespace) {
            api.put(
                getBackendApiUrl(`/api/v1/raw/${props.type}/${props.namespace}/${props.name}`),
                newValue
            )
                .then(() => {
                    toggle();
                })
                .catch((err: Error | AxiosError) => {
                    Toaster.show({ message: err.message, intent: Intent.DANGER });
                });
        } else {
            api.put(getBackendApiUrl(`/api/v1/raw/${props.type}/${props.name}`), newValue)
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

    const remove = () => {
        if (props.namespace) {
            api.delete(
                getBackendApiUrl(`/api/v1/raw/${props.type}/${props.namespace}/${props.name}`)
            )
                .then(() => {
                    setIsDeleteOpen(false);
                    handleSuccessNavToast();
                })
                .catch((err: Error | AxiosError) => {
                    setIsDeleteOpen(false);
                    Toaster.show({ message: err.message, intent: Intent.DANGER });
                });
        } else {
            api.delete(getBackendApiUrl(`/api/v1/raw/${props.type}/${props.name}`))
                .then(() => {
                    setIsDeleteOpen(false);
                    handleSuccessNavToast();
                })
                .catch((err: Error | AxiosError) => {
                    setIsDeleteOpen(false);
                    Toaster.show({ message: err.message, intent: Intent.DANGER });
                });
        }
        if (props.refresh) {
            props.refresh();
        }
    };

    useEffect(() => {
        if (props.delete) {
            if (state.menu) {
                state.menu.push(
                    <MenuItem
                        key="resource-delete"
                        id="resource-delete"
                        data-testid="resource-delete"
                        icon="trash"
                        text="Delete"
                        onClick={() => setIsDeleteOpen(true)}
                    />
                );
            } else {
                state.menu = [
                    <MenuItem
                        key="resource-delete"
                        id="resource-delete"
                        data-testid="resource-delete"
                        icon="trash"
                        text="Delete"
                        onClick={() => setIsDeleteOpen(true)}
                    />,
                ];
            }
        }
        appendToButtons(
            state,
            setState,
            <Button
                key="resource-edit"
                id="resource-edit"
                data-testid="resource-edit"
                icon="edit"
                onClick={() => get()}
            />
        );
    }, []);

    return (
        <>
            <TwoButtonDialog
                id="delete-resource-dialog"
                isOpen={isDeleteOpen}
                onFailure={() => {
                    setIsDeleteOpen(false);
                }}
                onSuccess={remove}
                title="Are You Sure?"
                successText="Yes"
                failureText="No"
            >
                <Text large>Are you sure you want to delete this resource?</Text>
                <Text large code codePrefix="This action is identical to: ">
                    kubectl delete {props.type} {props.name}{' '}
                    {props.namespace && `-n ${props.namespace}`}
                </Text>
            </TwoButtonDialog>
            <TextEditDialog
                equiv="kubectl apply -f {changes}"
                initialValue={value}
                onSave={save}
                onClose={toggle}
                isOpen={isOpen}
            />
        </>
    );
}
