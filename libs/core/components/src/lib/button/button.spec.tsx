import { render } from '@testing-library/react';

import Button from './button';

describe('Button', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Button>Text</Button>);
    expect(baseElement).toBeTruthy();
  });
  it('should render small primary button successfully', () => {
    const { baseElement } = render(<Button size="sm" color="primary">Text</Button>);
    expect(baseElement).toBeTruthy();
  });
});
