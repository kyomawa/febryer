"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { FormControl } from "./form";
import { ControllerRenderProps, FieldValues, Path, UseFormReturn } from "react-hook-form";

type FormMultiComboboxProps<TFieldValues extends FieldValues> = {
  title: string;
  placeholder: string;
  field: Omit<ControllerRenderProps<TFieldValues, Path<TFieldValues>>, "value"> & { value: string[] };
  fieldName: Path<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  emptyMessage: string;
  datas: { label: string; value: string }[];
};

export function FormMultiCombobox<TFieldValues extends FieldValues>({
  datas,
  title,
  emptyMessage,
  placeholder,
  field,
  fieldName,
  form,
}: FormMultiComboboxProps<TFieldValues>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [width, setWidth] = React.useState(0);
  const containerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }
  }, [containerRef, containerRef.current?.offsetWidth]);

  const selectedValues = field.value;

  const toggleValue = (value: string) => {
    const newValue = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    form.setValue(fieldName, newValue as unknown as TFieldValues[Path<TFieldValues>]);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            ref={containerRef}
            variant="inputLike"
            size="inputLike"
            role="combobox"
            className={cn(
              "justify-start relative overflow-hidden font-normal",
              selectedValues.length === 0 && "text-muted-foreground"
            )}
          >
            <span className="">
              {selectedValues.length > 0
                ? selectedValues
                    .map((value) => datas.find((data) => data.value === value)?.label)
                    .filter(Boolean)
                    .join(", ")
                : title}
            </span>
            <div className="right-0 pr-3 top-1/2 pl-1 -translate-y-1/2 absolute shrink-0 bg-white text-neutral-500 dark:text-white/50 z-[1] dark:bg-primary-1000">
              <ChevronsUpDown className="size-4" />
            </div>
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent style={{ width }} className="w-full p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {datas.map((data) => (
                <CommandItem value={data.label} key={data.value} onSelect={() => toggleValue(data.value)}>
                  {data.label}
                  <Check
                    className={cn("ml-auto h-4 w-4", selectedValues.includes(data.value) ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
