import * as React from 'react';

export function useCombobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>('');

  return {
    open,
    setOpen,
    value,
    setValue,
  };
}
