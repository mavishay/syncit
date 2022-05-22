import { render } from '@testing-library/react'
// eslint-disable-next-line import/extensions
import { Toast } from './toast'

describe('Toast', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Toast />)
    expect(baseElement).toBeTruthy()
  })
})
