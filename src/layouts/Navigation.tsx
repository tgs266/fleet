/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import { Button, ButtonGroup, Card, Menu, Position } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { Link, useNavigate } from 'react-router-dom';

export interface IBreadcrumb {
    text: string;
    link?: string;
}

export interface INavContext {
    breadcrumbs?: IBreadcrumb[];
    buttons?: React.ReactNode[];
    menu?: React.ReactNode[];
}

export const NavContext = React.createContext(null);

export function NavContextProvider(props: { children: React.ReactNode }) {
    const [state, setState] = React.useState({} as INavContext);
    const value = React.useMemo(() => [state, setState], [state]);
    return <NavContext.Provider value={value}>{props.children}</NavContext.Provider>;
}

export function useNavContext(): [INavContext, React.Dispatch<React.SetStateAction<INavContext>>] {
    const context = React.useContext(NavContext);
    if (context === undefined) {
        throw new Error('useNavContext must be used within a NavContextProvider');
    }
    return context;
}

export default function Navigation() {
    const nav = useNavigate();
    const createBreadcrumb = (breadcrumb: IBreadcrumb, key: number, count: number) => (
        <h3 className={key !== count - 1 ? 'hover-link' : null} key={key} style={{ margin: 0 }}>
            <Link
                to={breadcrumb.link ? breadcrumb.link : ''}
                style={{
                    textDecoration: 'none',
                    color: 'black',
                    pointerEvents: breadcrumb.link ? null : 'none',
                }}
            >
                {breadcrumb.text}
            </Link>
            {key !== count - 1 ? '/' : ''}
        </h3>
    );

    const [state] = useNavContext();

    const { breadcrumbs } = state;

    return (
        <Card
            style={{
                width: '100%',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                padding: '6px 15px',
                position: 'sticky',
                top: 0,
                zIndex: 100000,
            }}
        >
            <Button
                minimal
                icon="arrow-left"
                style={{ marginRight: '15px' }}
                onClick={() => nav(-1)}
            />
            {breadcrumbs &&
                state.breadcrumbs.map((r, idx) =>
                    createBreadcrumb(r, idx, state.breadcrumbs.length)
                )}
            <div style={{ flexGrow: 1 }} />
            <ButtonGroup>
                {state.buttons}
                {state.menu && state.menu.length !== 0 && (
                    <Popover2
                        content={
                            <Menu id="top-menu">
                                {state.menu.map((item, idx) => (
                                    <div key={idx}>{item}</div>
                                ))}
                            </Menu>
                        }
                        position={Position.BOTTOM_LEFT}
                    >
                        <Button id="top-menu-more" icon="more" />
                    </Popover2>
                )}
            </ButtonGroup>
        </Card>
    );
}
