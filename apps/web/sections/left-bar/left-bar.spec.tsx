import { render } from '@testing-library/react'

import LeftBar from './left-bar'

describe('LeftBar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LeftBar />)
    expect(baseElement).toBeTruthy()
  })
})
