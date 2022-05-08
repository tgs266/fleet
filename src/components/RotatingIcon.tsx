import React from 'react';
import { Icon, IconName, IconProps } from '@blueprintjs/core';
import { useSpring, animated } from '@react-spring/web';

export default function RotatingIcon(props: {
    style: React.CSSProperties;
    isRotated: boolean;
    icon: IconName;
    initialDegrees: number;
    rotateDegrees: number;
    iconProps: Omit<IconProps, 'icon'>;
}) {
    const { rotate } = useSpring({
        rotate: props.isRotated ? props.rotateDegrees : props.initialDegrees,
    });

    return (
        <animated.div style={{ ...props.style, rotate }}>
            <Icon icon={props.icon} {...props.iconProps} />
        </animated.div>
    );
}
