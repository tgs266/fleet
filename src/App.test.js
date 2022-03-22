import * as React from 'react'
import App from './App'
import { configure, shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

configure({ adapter: new Adapter() })

it('renders without crashing', async () => {
    shallow(<App />)
})

// it('should setup JSON parser', async () => {
//     window.JSON = {
//         parse: JSON.parse,
//         stringify: JSON.stringify,
//         dateParser: null,
//     }
//     const mockGetData = jest
//         .spyOn(DB, 'LoadDatabase')
//         .mockReturnValue(new Promise((resolve) => resolve()))
//     await act(async () => {
//         mount(
//             <MemoryRouter initialEntries={['/']}>
//                 <Routes>
//                     <Route path="*" element={<App />} />
//                 </Routes>
//             </MemoryRouter>
//         )
//         await new Promise((resolve) => setTimeout(resolve, 1000))
//     })
//     expect(window.JSON.dateParser).not.toBe(null)
//     expect(mockGetData).toHaveBeenCalled()
//     expect(window.JSON.dateParser('', '2022-03-08T00:56:54.640Z').getTime()).toBe(
//         new Date('2022-03-08T00:56:54.640Z').getTime()
//     )
// })
