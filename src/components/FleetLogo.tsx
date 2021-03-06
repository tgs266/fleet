import React from 'react';

export default function FleetLogo(props: { size?: number; style?: React.CSSProperties }) {
    const { size } = props;
    let useSize = size;
    if (!size) {
        useSize = 20;
    }
    return (
        <div
            className="bp4-icon"
            style={{ height: `${useSize}px`, width: `${useSize}px`, ...props.style }}
        >
            <svg
                id="Layer_1"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 380.05 397.2"
            >
                <defs>
                    <style>
                        {
                            '.cls-1{fill:url(#linear-gradient);}.cls-2{fill-rule:evenodd;fill:url(#linear-gradient-2);}'
                        }
                    </style>
                    <linearGradient
                        id="linear-gradient"
                        y1="41.25"
                        x2="380.05"
                        y2="41.25"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#e0321e" />
                        <stop offset="1" stopColor="#ff8619" />
                    </linearGradient>
                    <linearGradient
                        id="linear-gradient-2"
                        x1="159.97"
                        y1="417.46"
                        x2="422.26"
                        y2="417.46"
                        xlinkHref="#linear-gradient"
                    />
                </defs>
                <path
                    className="cls-1"
                    d="M82.5,0H380.05a0,0,0,0,1,0,0V0a82.5,82.5,0,0,1-82.5,82.5H0a0,0,0,0,1,0,0v0A82.5,82.5,0,0,1,82.5,0Z"
                />
                <path
                    className="cls-2"
                    d="M242.48,286.32h0A82.5,82.5,0,0,0,160,368.82h0V548.6h0a82.51,82.51,0,0,0,82.51-82.5V368.82h97.28a82.5,82.5,0,0,0,82.5-82.5H242.48Z"
                    transform="translate(-159.97 -151.4)"
                />
            </svg>
        </div>
    );
}
