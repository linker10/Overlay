"use client";

import React, { useMemo } from "react";
import { useState } from "react";
import useFontsStore from "@/stores/fontStore";
import { FontUtility } from "@/utils/fontUtility";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check } from "lucide-react";
import { FontOption } from "@/types/index.type";

interface FontSelectProps {
  value: string | null;
  onValueChange?: (fontFamily: string) => void;
  placeholder?: string;
  maxHeight?: string | number;
}

/**
 * Font selection popover with searchable list. Loads the Google font for
 * client-side preview when selected.
 */
export const FontSelect: React.FC<FontSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Select font...",
}) => {
  const fontsState = useFontsStore((s) => s.fonts);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const items: FontOption[] = useMemo(() => {
    if (!fontsState) return [];
    return FontUtility.searchFonts(fontsState, query);
  }, [fontsState, query]);

  const currentLabel = value ?? "Select font";

  function handleSelect(family: string) {
    // load font for preview (client-side)
    FontUtility.loadFont(family);

    // inform parent/editor
    onValueChange?.(family);

    // close popover
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-between w-full max-w-md">
          <span className="truncate">{currentLabel}</span>
          <span className="text-xs text-muted-foreground ml-2">▼</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] p-0" align="start">
        <Command>
          <div className="p-2">
            <CommandInput
              placeholder={placeholder}
              value={query}
              onValueChange={(v) => setQuery(v)}
              className="w-full"
            />
          </div>

          <CommandList className="max-h-[300px] overflow-auto">
            <CommandEmpty>No fonts found.</CommandEmpty>

            {/* Optional grouping: Popular vs All (example) */}
            <CommandGroup heading="Fonts">
              {items.map((f) => {
                const isSelected = value === f.family;
                return (
                  <CommandItem
                    key={f.family}
                    onSelect={() => handleSelect(f.family)}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{f.family}</div>
                      <div className="text-xs text-muted-foreground">{f.category}</div>
                    </div>
                    {isSelected && <Check className="h-4 w-4" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FontSelect;
