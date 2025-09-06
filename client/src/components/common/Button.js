import React from 'react';

const Button = ({ children, variant='primary', outline=false, className='', ...rest }) => {
  const classes = ['button'];
  if (outline) classes.push('outline');
  if (variant && !outline) classes.push(variant);
  return (
    <button className={classes.join(' ') + (className ? ' '+className : '')} {...rest}>
      {children}
    </button>
  );
};

export default Button;
