'use client';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import * as RPNInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import 'react-phone-number-input/style.css';

import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '../ui/command';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';

export type PhoneInputProps = Omit<React.ComponentProps<'input'>, 'onChange' | 'value' | 'ref'> &
    Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
        onChange?: (value: RPNInput.Value) => void;
    };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> = React.forwardRef<
    React.ElementRef<typeof RPNInput.default>,
    PhoneInputProps
>(({ className, onChange, ...props }, ref) => {
    return (
        <RPNInput.default
            ref={ref}
            className={cn('bg-gray-958 flex h-10 rounded-lg', className)}
            flagComponent={FlagComponent}
            countrySelectComponent={CountrySelect}
            inputComponent={InputComponent}
            smartCaret={false}
            /**
             * Handles the onChange event.
             *
             * react-phone-number-input might trigger the onChange event as undefined
             * when a valid phone number is not entered. To prevent this,
             * the value is coerced to an empty string.
             *
             * @param {E164Number | undefined} value - The entered value
             */
            onChange={(value) => onChange?.(value || ('' as RPNInput.Value))}
            {...props}
        />
    );
});
PhoneInput.displayName = 'PhoneInput';

const InputComponent = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
    ({ className, ...props }, ref) => (
        <Input
            className={cn(
                'rounded-s-none rounded-e-lg',
                'text-xs text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none',
                '!text-xs placeholder:text-xs placeholder:text-gray-700',
                className,
            )}
            {...props}
            ref={ref}
        />
    ),
);
InputComponent.displayName = 'InputComponent';

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
    disabled?: boolean;
    value: RPNInput.Country;
    options: CountryEntry[];
    onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
    disabled,
    value: selectedCountry,
    options: countryList,
    onChange,
}: CountrySelectProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type='button'
                    variant='ghost'
                    className='flex gap-1 rounded-s-lg rounded-e-none border-r-0 px-3 focus:z-10'
                    disabled={disabled}
                >
                    <FlagComponent country={selectedCountry} countryName={selectedCountry} />
                    <ChevronsUpDown
                        className={cn('-mr-2 size-4', disabled ? 'hidden' : 'opacity-100')}
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[300px] p-0'>
                <Command>
                    <CommandInput placeholder='Search country...' />
                    <CommandList>
                        <ScrollArea className='h-72'>
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                                {countryList.map(({ value, label }) =>
                                    value ? (
                                        <CountrySelectOption
                                            key={value}
                                            country={value}
                                            countryName={label}
                                            selectedCountry={selectedCountry}
                                            onChange={onChange}
                                        />
                                    ) : null,
                                )}
                            </CommandGroup>
                        </ScrollArea>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

interface CountrySelectOptionProps extends RPNInput.FlagProps {
    selectedCountry: RPNInput.Country;
    onChange: (country: RPNInput.Country) => void;
}

const CountrySelectOption = ({
    country,
    countryName,
    selectedCountry,
    onChange,
}: CountrySelectOptionProps) => {
    return (
        <CommandItem className='gap-2' onSelect={() => onChange(country)}>
            <FlagComponent country={country} countryName={countryName} />
            <span className='flex-1 text-sm'>{countryName}</span>
            <span className='text-foreground/50 text-sm'>{`+${RPNInput.getCountryCallingCode(country)}`}</span>
            <CheckIcon
                className={`ml-auto size-4 ${country === selectedCountry ? 'opacity-100' : 'opacity-0'}`}
            />
        </CommandItem>
    );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
    const Flag = flags[country];

    return (
        <span className='bg-foreground/20 flex h-4 w-6 overflow-hidden rounded-sm [&_svg]:size-full'>
            {Flag && <Flag title={countryName} />}
        </span>
    );
};

export { PhoneInput };
