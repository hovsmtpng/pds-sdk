import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronsUpDown, X, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Option = { label: string; value: string; disabled?: boolean };

type MultiSelectProps = {
    options: Option[];
    value: string[];
    onChange: (next: string[]) => void;
    onSubmit?: () => void;
    placeholder?: string;
    emptyText?: string | React.ReactNode;
    maxHeight?: number;
    maxSelected?: number;
    creatable?: boolean;
    showSelectAll?: boolean;
    disabled?: boolean;
    className?: string;
    maxTagCount?: number;
};

export function MultiSelect({
    options,
    value,
    onChange,
    onSubmit,
    placeholder = "Select...",
    emptyText = "No results found.",
    maxHeight = 260,
    maxSelected,
    creatable = false,
    showSelectAll = false,
    disabled,
    className,
    maxTagCount = 3,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const selectedOptions = options.filter((opt) => value.includes(opt.value));
    const allSelected = selectedOptions.length === options.length;

    const toggleValue = (val: string) => {
        if (value.includes(val)) {
            onChange(value.filter((v) => v !== val));
        } else {
            if (maxSelected && value.length >= maxSelected) return;
            onChange([...value, val]);
        }
    };

    const clearAll = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        onChange([]);
    };

    const handleOnSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        setOpen(false);
        onSubmit?.();
    };

    const handleSelectAll = () => {
        if (allSelected) onChange([]);
        else onChange(options.map((o) => o.value));
    };

    const handleCreateOption = () => {
        if (!search.trim()) return;
        const newOption = { label: search, value: search.toLowerCase().replace(/\s+/g, "-") };
        onChange([...value, newOption.value]);
        options.push(newOption);
        setSearch("");
    };

    const filteredOptions = options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        "justify-between transition-all duration-200",
                        open && "shadow-sm",
                        className
                    )}
                >
                    {/* Badge container */}
                    <div className="flex flex-wrap gap-1 items-center truncate max-w-[85%]">
                        {selectedOptions.length === 0 ? (
                            <span className="text-muted-foreground">{placeholder}</span>
                        ) : (
                            selectedOptions.slice(0, maxTagCount).map((opt) => (
                                <Badge variant="secondary" className="rounded-md">
                                    {opt.label}
                                </Badge>
                            ))
                        )}
                        {selectedOptions.length > maxTagCount && (
                            <Badge variant="outline" className="rounded-md">
                                +{selectedOptions.length - maxTagCount}
                            </Badge>
                        )}
                    </div>

                    <div className="ml-1 flex items-center gap-1">
                        {selectedOptions.length > 0 && (
                            <X
                                className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer"
                                onClick={clearAll}
                            />
                        )}
                        <ChevronsUpDown className="ml-1 h-4 w-4 opacity-50" />
                    </div>
                </Button>
            </PopoverTrigger>

            <AnimatePresence>
                {open && (
                    <PopoverContent
                        asChild
                        className={`${search !== "" ? "pb-0" : "pb-3"} px-0 pt-0 w-[--radix-popover-trigger-width] min-w-[260px] border border-border shadow-lg rounded-lg`}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.97 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                        >
                            <Command shouldFilter={false}>
                                <CommandInput
                                    placeholder="Search..."
                                    value={search}
                                    onValueChange={setSearch}
                                />

                                {showSelectAll && (
                                    <div className="flex items-center justify-between px-2 py-2">
                                        <Button variant="outline" size="sm" onClick={handleSelectAll}>
                                            {allSelected ? "Unselect All" : "Select All"}
                                        </Button>
                                        <div className="text-xs text-muted-foreground">
                                            {selectedOptions.length}/{options.length}
                                        </div>
                                    </div>
                                )}

                                <CommandGroup className="max-h-48 overflow-auto hide-scroll">
                                    {filteredOptions.length === 0 && !creatable && (
                                        <CommandEmpty>{emptyText}</CommandEmpty>
                                    )}

                                    <AnimatePresence>
                                        <div>
                                            {filteredOptions.map((opt) => {
                                                const checked = value.includes(opt.value);
                                                return (
                                                    <motion.div
                                                        key={opt.value}
                                                        layout
                                                        initial={{ opacity: 0, y: -4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -4 }}
                                                        transition={{ duration: 0.12 }}
                                                    >
                                                        <CommandItem
                                                            value={opt.label}
                                                            onSelect={() =>
                                                                !opt.disabled && toggleValue(opt.value)
                                                            }
                                                            className={
                                                                opt.disabled
                                                                    ? "opacity-50 pointer-events-none"
                                                                    : ""
                                                            }
                                                        >
                                                            <Checkbox
                                                                checked={checked}
                                                                onCheckedChange={() =>
                                                                    toggleValue(opt.value)
                                                                }
                                                                className="mr-2"
                                                            />
                                                            <span className="flex-1">
                                                                {opt.label}
                                                            </span>
                                                            {checked && <Check className="h-4 w-4" />}
                                                        </CommandItem>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </AnimatePresence>

                                    {filteredOptions.length === 0 && creatable && (
                                        <CommandItem onSelect={handleCreateOption}>
                                            <PlusCircle className="mr-2 h-4 w-4 text-indigo-500" />
                                            Buat “{search}”
                                        </CommandItem>
                                    )}
                                </CommandGroup>

                                {selectedOptions.length > 0 && (
                                    <>
                                        <Separator />
                                        <motion.div
                                            className="flex items-center justify-between px-2 py-2"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <div className="text-xs text-muted-foreground">
                                                {selectedOptions.length} selected
                                            </div>
                                            <div>
                                                <Button variant="ghost" size="sm" onClick={clearAll}>
                                                    Clear
                                                </Button>
                                                {onSubmit && (
                                                    <Button variant="primary" size="sm" onClick={handleOnSubmit}>
                                                        Submit
                                                    </Button>
                                                )}
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </Command>
                        </motion.div>
                    </PopoverContent>
                )}
            </AnimatePresence>
        </Popover>
    );
}
