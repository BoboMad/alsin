import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';


interface ComboboxProps {
  options: {
    value: any;
    label: string;
    extra?: React.ReactNode | string;
    group?: string;
  }[];
  value: string | any;
  onChange: (value: any) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  classes?: {
    content?: string;
    button?: string;
  };
}

export function Combobox({
  options,
  value,
  onChange,
  disabled,
  placeholder,
  classes = {
    content: 'md:w-full w-[calc(100vw_-_15px)] p-0',
    button: 'w-full justify-between',
  },
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="w-fit">
        <Button disabled={disabled} variant="outline" role="combobox" aria-expanded={open} className={cn('w-fit justify-between', classes.button)}>
          <span className="truncate">{value ? options.find(option => option.value.toString() === value.toString())?.label : (placeholder ?? 'Select option...')}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('md:w-full w-[calc(100vw_-_15px)] p-0', classes.content)} align="end">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No option found.</CommandEmpty>
          {options.length > 0 && (
            <CommandGroup className="max-h-64 overflow-y-auto">
              {options.map(option => (
                <React.Fragment key={option.value.toString()}>
                  <CommandItem
                    value={option.value}
                    onSelect={_ => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    {option.label?.replaceAll('&nbsp;', '')?.replaceAll('"', '')?.replaceAll('\n', '')?.replaceAll('\r', '').trim()}
                    {/* {option.label?.replaceAll('/', '-')?.replaceAll(',', ' ')?.replaceAll('-', ' ')?.substring(0, 25)} */}
                    {option.extra}
                  </CommandItem>
                </React.Fragment>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
