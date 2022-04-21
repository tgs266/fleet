import React from 'react';
import { Button, ButtonProps, IconName, MaybeElement } from '@blueprintjs/core';

export default function IconSwapButton(props: {
    btnProps: ButtonProps;
    otherIcon: IconName | MaybeElement;
}) {
    const [icon, setIcon] = React.useState<IconName | MaybeElement>(props.btnProps.icon);
    const [isOther, setIsOther] = React.useState(false);

    return (
        <Button
            data-testid="btn-swap-icon"
            {...props.btnProps}
            icon={icon}
            onClick={(e) => {
                if (props.btnProps.onClick) {
                    props.btnProps.onClick(e);
                }
                setIcon(!isOther ? props.otherIcon : props.btnProps.icon);
                setIsOther(!isOther);
            }}
        />
    );
}
