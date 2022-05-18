/* eslint-disable react/require-default-props */
import { ReactNode } from 'react';
import classnames from 'classnames';
import { objectsToString } from '@syncit/core/utils';
import { Colors } from '../generic.types';
import { buttonClass } from './button.class';

export interface ButtonProps {
  children: ReactNode;
  variant?: 'filled' | 'outlined' | 'gradient' | 'text';
  size?: 'sm' | 'md' | 'lg';
  color?: Colors;
  fullWidth?: boolean;
  className?: string;
}

export function Button({
  variant = 'filled',
  size = 'md',
  color = 'secondary',
  fullWidth = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const buttonBase = objectsToString(buttonClass.base.initial);
  const buttonSize = objectsToString(buttonClass.sizes[size]);
  const buttonVariant = objectsToString(buttonClass.variants[variant][color]);
  const buttonFullWidth = objectsToString(buttonClass.base.fullWidth);
  const classes = classnames(
    buttonBase,
    buttonSize,
    buttonVariant,
    { [buttonFullWidth]: fullWidth },

    className,
  );
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <button className={classes} type="button" {...rest}>{children}</button>;
}
Button.displayName = 'Button';
export default Button;
