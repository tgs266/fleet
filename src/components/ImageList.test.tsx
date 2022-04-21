import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageList from './ImageList';
import { generateContainer } from '../testing/type_mocks';
import { ContainerSpec } from '../models/container.model';

test('renders without crashing', async () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route
                    path="*"
                    element={
                        <ImageList
                            containerSpec={generateContainer('asdf') as ContainerSpec}
                            imageList={[{ name: 'asdf', tag: 'asdf' }]}
                            onChange={() => {}}
                        />
                    }
                />
            </Routes>
        </MemoryRouter>
    );
});
