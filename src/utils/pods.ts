/* eslint-disable import/prefer-default-export */
import { Colors } from '@blueprintjs/core';
import { PodMeta } from '../models/pod.model';
import CONSTANTS from './constants';

export const getStatusColor = (pod: PodMeta) => {
    let color;
    switch (pod.status.genericStatus) {
        case CONSTANTS.status.PENDING_STATUS:
            color = Colors.GOLD5;
            break;
        case CONSTANTS.status.RUNNING_STATUS:
            color = Colors.GREEN4;
            break;
        case CONSTANTS.status.UNKNOWN_STATUS:
            color = Colors.GRAY4;
            break;
        case '':
            color = Colors.GRAY4;
            break;
        case CONSTANTS.status.TERMINATED_STATUS:
            color = Colors.RED4;
            break;
        default:
            color = Colors.RED4;
            break;
    }
    return color;
};
