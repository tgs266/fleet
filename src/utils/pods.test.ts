import { Colors } from '@blueprintjs/core';
import { getStatusColor } from './pods';
import { generatePod } from '../testing/type_mocks';
import { PodMeta } from '../models/pod.model';

test('getStatusColor Pending', () => {
    const meta = generatePod('asdf') as PodMeta;
    meta.status.genericStatus = 'Pending';
    expect(getStatusColor(meta)).toBe(Colors.GOLD5);
});

test('getStatusColor Running', () => {
    const meta = generatePod('asdf') as PodMeta;
    meta.status.genericStatus = 'Running';
    expect(getStatusColor(meta)).toBe(Colors.GREEN4);
});

test('getStatusColor Unknown', () => {
    const meta = generatePod('asdf') as PodMeta;
    meta.status.genericStatus = 'Unknown';
    expect(getStatusColor(meta)).toBe(Colors.GRAY4);
});

test("getStatusColor ''", () => {
    const meta = generatePod('asdf') as PodMeta;
    meta.status.genericStatus = '';
    expect(getStatusColor(meta)).toBe(Colors.GRAY4);
});

test('getStatusColor Terminated', () => {
    const meta = generatePod('asdf') as PodMeta;
    meta.status.genericStatus = 'Terminated';
    expect(getStatusColor(meta)).toBe(Colors.RED4);
});

test('getStatusColor any', () => {
    const meta = generatePod('asdf') as PodMeta;
    meta.status.genericStatus = 'asdf';
    expect(getStatusColor(meta)).toBe(Colors.RED4);
});
