import React from 'react';

export default function NoMetrics(props: { height?: string | number }) {
    return (
        <div style={{ height: props.height, textAlign: 'center' }}>
            <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                Could not retrieve metrics
            </div>
        </div>
    );
}
