import * as React from 'react';
import {render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import ContainerSpecEnvVarEdit from './ContainerSpecEnvVarEdit';
import { generateContainer } from '../../testing/type_mocks';
import { ContainerSpec } from '../../models/container.model';

test('renders without crashing', async () => {
    const changefn = jest.fn()
    render(<ContainerSpecEnvVarEdit 
        containerSpec={generateContainer("asdf") as ContainerSpec}      
        onChange={changefn} 
    />)
});

test("can add row", () => {
    const changefn = jest.fn()
    const wrapper = render(<ContainerSpecEnvVarEdit 
        containerSpec={generateContainer("asdf") as ContainerSpec}      
        onChange={changefn} 
    />)
    fireEvent.click(wrapper.getByTestId("env-add-btn"))
    expect(changefn).toHaveBeenCalled()
})

test("can delete row", () => {
    const changefn = jest.fn()
    const wrapper = render(<ContainerSpecEnvVarEdit 
        containerSpec={generateContainer("asdf") as ContainerSpec}      
        onChange={changefn} 
    />)
    fireEvent.click(wrapper.getAllByTestId("env-delete-btn")[0])
    expect(changefn).toHaveBeenCalled()
})

test("can change hostIp", () => {
    const changefn = jest.fn()
    const wrapper = render(<ContainerSpecEnvVarEdit 
        containerSpec={generateContainer("asdf") as ContainerSpec}      
        onChange={changefn} 
    />)
    fireEvent.change(wrapper.getByTestId("0-env-value"), {target: {value: "1"}})
    expect(changefn).toHaveBeenCalled()
})

test("can change hostPort", () => {
    const changefn = jest.fn()
    const wrapper = render(<ContainerSpecEnvVarEdit 
        containerSpec={generateContainer("asdf") as ContainerSpec}      
        onChange={changefn} 
    />)
    fireEvent.change(wrapper.getByTestId("0-env-name"), {target: {value: "3"}})
    expect(changefn).toHaveBeenCalled()
})