/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable object-shorthand */
import React from 'react';
import ReactDOM from 'react-dom';
import AuthDialog from '../auth/AuthDialog';
import { FleetError } from '../models/base';

export function handleClose(
    e: CloseEvent,
    closeHandler?: (this: WebSocket, ev: CloseEvent) => any
) {
    if (e.reason !== '') {
        let data = e.reason;
        if (!data.startsWith('{"')) {
            data = `{"${data}`;
        }
        const errJson: FleetError = JSON.parse(data);
        if (errJson.status === 'UNAUTHORIZED' || errJson.status === 'UNAUTHORIZED_EXPIRED') {
            localStorage.removeItem('jwe');
            const dialog = document.createElement('div');
            document.body.appendChild(dialog);
            ReactDOM.render(
                React.createElement(AuthDialog, {
                    mode: errJson.status,
                    onClose: () => {
                        ReactDOM.unmountComponentAtNode(dialog);
                        window.location.reload();
                    },
                }),
                dialog
            );
        }
    } else if (closeHandler) {
        closeHandler.apply(this, e);
    }
}

export default function getWebsocket(
    url: string,
    closeHandler?: (this: WebSocket, ev: CloseEvent) => any
) {
    const ws = new WebSocket(url);
    ws.onclose = (e) => {
        handleClose(e, closeHandler);
    };
    return ws;
}
