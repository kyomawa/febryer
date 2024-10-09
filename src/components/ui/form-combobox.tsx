"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { FormControl } from "./form";
import { ControllerRenderProps, FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

type FormComboboxProps<TFieldValues extends FieldValues> = {
  title: string;
  placeholder: string;
  field: ControllerRenderProps<TFieldValues>;
  fieldName: Path<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  disabled?: boolean;
  emptyMessage: string;
  datas: { label: string; value: PathValue<TFieldValues, Path<TFieldValues>> }[];
};

export function FormCombobox<TFieldValues extends FieldValues>({
  datas,
  title,
  emptyMessage,
  placeholder,
  disabled,
  field,
  fieldName,
  form,
}: FormComboboxProps<TFieldValues>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [width, setWidth] = React.useState(0);
  const containerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }
  }, [containerRef, containerRef.current?.offsetWidth]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            ref={containerRef}
            variant="inputLike"
            disabled={disabled}
            size="inputLike"
            role="combobox"
            className={cn(
              "justify-start overflow-hidden relative font-normal",
              !field.value && "text-muted-foreground"
            )}
          >
            <span>{field.value ? datas.find((data) => data.value === field.value)?.label : title}</span>
            <div className="right-0 pr-3 pl-1 top-1/2 -translate-y-1/2 absolute shrink-0 bg-white text-neutral-500 dark:text-white/50 z-[1] dark:bg-primary-1000">
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
                <CommandItem
                  value={data.label}
                  key={data.value}
                  onSelect={() => {
                    form.setValue(fieldName, data.value);
                    setIsOpen(false);
                  }}
                >
                  {data.label}
                  <Check className={cn("ml-auto h-4 w-4", data.value === field.value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
