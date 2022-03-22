import * as React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { MemoryRouter, Route, Routes } from 'react-router';
import SideNavigation from './SideNavigation';

configure({ adapter: new Adapter() });

it('renders without crashing', async () => {
    mount(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="*" element={<SideNavigation />} />
            </Routes>
        </MemoryRouter>
    );
});

it('can navigate to home', async () => {
    const wrapper = mount(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="*" element={<SideNavigation />} />
            </Routes>
        </MemoryRouter>
    );

    const element = wrapper.find(SideNavigation).childAt(0);
    const btn = element.find('.sidebar-icon').first();
    btn.simulate('click');
});
