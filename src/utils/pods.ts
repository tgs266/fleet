/* eslint-disable import/prefer-default-export */
import { Colors } from '@blueprintjs/core';
import { PodMeta } from '../models/pod.model';

export const getStatusColor = (pod: PodMeta) => {
    let color = Colors.GREEN4;
    switch (pod.status.genericStatus) {
        case 'Pending':
            color = Colors.GOLD5;
            break;
        case 'Running':
            color = Colors.GREEN4;
            break;
        case 'Unknown':
            color = Colors.GRAY4;
            break;
        case '':
            color = Colors.GRAY4;
            break;
        case 'Terminated':
            color = Colors.RED4;
            break;
        default:
            color = Colors.RED4;
            break;
    }
    return color;
};
