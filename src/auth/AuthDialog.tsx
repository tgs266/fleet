import { InputGroup, Dialog, Button, Intent, Callout } from '@blueprintjs/core';
import React, { useEffect, useState } from 'react';
import Auth from '../services/auth.service';

export default function AuthDialog(props: { onClose: () => void; mode: string }) {
    const [isOpen, setIsOpen] = useState(true);
    const [token, setToken] = useState('');
    const [canUseOIDC, setCanUseOIDC] = useState(false);

    useEffect(() => {
        Auth.canUseOIDC().then((r) => {
            if (r.data.available) {
                setCanUseOIDC(true);
            }
        });
    }, []);

    return (
        <Dialog
            isOpen={isOpen}
            onClose={() => {
                props.onClose();
                setIsOpen(false);
            }}
            canEscapeKeyClose={false}
            canOutsideClickClose={false}
        >
            <div id="auth-dialog" style={{ padding: '1em', paddingBottom: 0 }}>
                {props.mode === 'UNAUTHORIZED_EXPIRED' && (
                    <Callout style={{ marginBottom: '0.5em' }} intent={Intent.DANGER}>
                        Session Expired. Please sign in to continue.
                    </Callout>
                )}
                <h3 style={{ margin: 0, marginBottom: '0.25em' }}>Fleet</h3>
                <div style={{ marginBottom: '0.25em' }}>
                    Please enter your service account token
                </div>
                <InputGroup
                    data-testid="token-input"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    type="password"
                    fill
                />
                <Button
                    id="token-signin"
                    style={{ marginTop: '1.1em' }}
                    fill
                    disabled={token === ''}
                    intent={Intent.PRIMARY}
                    onClick={() => {
                        Auth.login(token).then((r) => {
                            localStorage.setItem('jwe', r.data.token);
                            setIsOpen(false);
                            props.onClose();
                        });
                    }}
                >
                    Sign In
                </Button>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '1em',
                        marginBottom: '1em',
                    }}
                >
                    <hr style={{ flexGrow: 1 }} />
                    <div style={{ marginLeft: '0.5em', marginRight: '0.5em' }}>Or</div>
                    <hr style={{ flexGrow: 1 }} />
                </div>
                <Button
                    fill
                    disabled={!canUseOIDC}
                    onClick={() => {
                        Auth.getOIDCUrl().then((r) => {
                            window.open(r.data.url, '_self');
                        });
                    }}
                >
                    Use OpenID Connect
                </Button>
                {!canUseOIDC && (
                    <Callout style={{ marginTop: '1em' }} intent={Intent.PRIMARY}>
                        View the documentation{' '}
                        <a href="https://github.com/tgs266/fleet" target="_blank" rel="noreferrer">
                            here
                        </a>{' '}
                        to learn how to setup OpenID Connect with Fleet
                    </Callout>
                )}
            </div>
        </Dialog>
    );
}
