// components/DynamicForm.jsx
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import dayjs from "dayjs";

import { Check, ChevronDownIcon, ChevronsUpDown, Plus, XCircleIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { MultiSelect } from "@/components/multi-select"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select"

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from "@/components/ui/input-otp"

import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

import { cn } from "@/lib/utils"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useEffect, useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";

// helper untuk kasih style error ring
export function errorRing(error, base = "") {
    return cn(
        "transition-shadow",
        base,
        error
            ? "border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-0"
            : "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-0"
    )
}

const renderOtpGroups = (length, groupSize) => {
    const groups = []
    let index = 0

    while (index < length) {
        const group = []
        for (let i = 0; i < groupSize && index < length; i++) {
            group.push(<InputOTPSlot key={`slot-${index}`} index={index} />)
            index++
        }
        groups.push(<InputOTPGroup key={`group-${groups.length}`}>{group}</InputOTPGroup>)
        if (index < length) {
            groups.push(<InputOTPSeparator key={`sep-${index}`} />)
        }
    }

    return groups
}

const renderOtpCustomGroups = (length, groups = []) => {
    const result = []
    let index = 0

    for (let g = 0; g < groups.length; g++) {
        const size = groups[g]
        const slots = []

        for (let i = 0; i < size && index < length; i++) {
            slots.push(<InputOTPSlot key={`slot-${index}`} index={index} />)
            index++
        }

        result.push(<InputOTPGroup key={`group-${g}`}>{slots}</InputOTPGroup>)

        if (g < groups.length - 1) {
            result.push(<InputOTPSeparator key={`sep-${g}`} />)
        }
    }

    return result
}

export function FormInput({ form, fields, onSubmit }) {

    return (
        <>
            {fields.map((field) => (
                <div key={field.name} className="pt-4">
                    <FormField

                        name={field.name}
                        control={form.control}
                        render={({ field: controllerField }) => {
                            // const error = errors[field.name]; // cek error untuk field ini
                            switch (field.type) {
                                case "text": {
                                    return (
                                        <FormItem>
                                            <FormLabel>{field.label}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    {...controllerField}
                                                    placeholder={field.placeholder}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }
                                case "email": {
                                    return (
                                        <FormItem>
                                            <FormLabel>{field.label}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    {...controllerField}
                                                    placeholder={field.placeholder}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }
                                case "textarea": {
                                    return (
                                        <FormItem>
                                            <FormLabel>{field.label}</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    {...controllerField}
                                                    placeholder={field.placeholder}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }
                                case "date": {
                                    const today = dayjs();

                                    // === Preset List ===
                                    const presets = [
                                        { label: "Today", date: today },
                                        { label: "Yesterday", date: dayjs().subtract(1, "day") },
                                        { label: "Last Week", date: dayjs().subtract(7, "day") },
                                        { label: "Last Month", date: dayjs().subtract(1, "month") },
                                        { label: "Start of Month", date: dayjs().startOf("month") },
                                        { label: "Start of Year", date: dayjs().startOf("year") },
                                    ];

                                    // === Configurability options ===
                                    const showPreset = field.preset?.showPreset ?? true;
                                    const defaultPresetIndex = field.preset?.defaultPreset ?? 0;
                                    const defaultPreset = presets[defaultPresetIndex] || presets[0];

                                    // === Initial Value Priority ===
                                    const currentValue = controllerField.value
                                        ? dayjs(controllerField.value, field.format, true)
                                        : field.defaultValue
                                            ? dayjs(field.defaultValue, field.format, true)
                                            : defaultPreset?.date || today;

                                    const [openDate, setOpenDate] = useState(false);
                                    const [month, setMonth] = useState(currentValue.toDate());
                                    const [selectedDate, setSelectedDate] = useState(currentValue);

                                    // === Preset State ===
                                    const [selectedPreset, setSelectedPreset] = useState(() => {
                                        if (field.defaultValue) return null;
                                        return defaultPreset?.label;
                                    });

                                    // === Sinkronisasi preset default ke controllerField ===
                                    useEffect(() => {
                                        if (!controllerField.value && !field.defaultValue && defaultPreset?.date) {
                                            const formatted = defaultPreset.date.format(field.format || "YYYY-MM-DD");
                                            controllerField.onChange(formatted);
                                            setSelectedDate(defaultPreset.date);
                                        }
                                        // eslint-disable-next-line react-hooks/exhaustive-deps
                                    }, []);

                                    // === Handle Date Select ===
                                    const handleSelect = (date) => {
                                        if (date) {
                                            const formatted = dayjs(date).format(field.format || "YYYY-MM-DD");
                                            setSelectedDate(dayjs(date));
                                            controllerField.onChange(formatted);
                                            setSelectedPreset(null);
                                            setOpenDate(false);
                                        }
                                    };

                                    // === Handle Reset (Today) ===
                                    const handleReset = () => {
                                        const formatted = today.format(field.format || "YYYY-MM-DD");
                                        setSelectedDate(today);
                                        controllerField.onChange(formatted);
                                        setSelectedPreset("Today");
                                        setOpenDate(false);
                                    };

                                    // === Handle Clear ===
                                    const handleClear = (e) => {
                                        e.stopPropagation();
                                        controllerField.onChange(null);
                                        setSelectedDate(null);
                                        setSelectedPreset(null);
                                        setOpenDate(false);
                                    };

                                    // === Sinkronisasi preset aktif berdasarkan selectedDate ===
                                    useEffect(() => {
                                        if (selectedDate) {
                                            const matched = presets.find((p) => p.date.isSame(selectedDate, "day"));
                                            setSelectedPreset(matched?.label || null);
                                        }
                                    }, [selectedDate]);

                                    return (
                                        <FormItem>
                                            <FormLabel>{field.label}</FormLabel>
                                            <FormControl>
                                                <Popover open={openDate} onOpenChange={setOpenDate}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            {...field}
                                                            type="button"
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal transition-shadow",
                                                                !selectedDate && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {selectedDate
                                                                ? dayjs(selectedDate, field.format, true).format(
                                                                    field.format || "DD-MM-YYYY"
                                                                )
                                                                : "Pick a date"}

                                                            {selectedDate && (
                                                                <button
                                                                    type="button"
                                                                    onClick={handleClear}
                                                                    className="ml-auto text-muted-foreground hover:text-primary opacity-70 hover:opacity-100"
                                                                >
                                                                    <XCircleIcon className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>

                                                    <PopoverContent className="w-auto p-0" align="center">
                                                        <div className="flex max-sm:flex-col">
                                                            {/* === Preset Section === */}
                                                            {showPreset && (
                                                                <div className="relative border-border max-sm:order-1 max-sm:border-t sm:w-32">
                                                                    <div className="h-full border-border sm:border-e py-2">
                                                                        <div className="flex flex-col px-2 gap-[2px]">
                                                                            {presets.map((preset, index) => (
                                                                                <Button
                                                                                    key={index}
                                                                                    type="button"
                                                                                    variant="ghost"
                                                                                    className={cn(
                                                                                        "h-8 w-full justify-start",
                                                                                        selectedPreset === preset.label && "bg-accent"
                                                                                    )}
                                                                                    onClick={() => {
                                                                                        const formatted = preset.date.format(
                                                                                            field.format || "YYYY-MM-DD"
                                                                                        );
                                                                                        setSelectedDate(preset.date);
                                                                                        controllerField.onChange(formatted);
                                                                                        setMonth(preset.date.toDate());
                                                                                        setSelectedPreset(preset.label);
                                                                                        setOpenDate(false);
                                                                                    }}
                                                                                >
                                                                                    {preset.label}
                                                                                </Button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* === Calendar Section === */}
                                                            <Calendar
                                                                autoFocus
                                                                mode="single"
                                                                month={month}
                                                                onMonthChange={(m) => setMonth(m)}
                                                                showOutsideDays={false}
                                                                selected={selectedDate ? selectedDate.toDate() : undefined}
                                                                onSelect={handleSelect}
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-end gap-1.5 border-t border-border p-3">
                                                            <Button variant="outline" type="button" onClick={handleReset}>
                                                                Reset
                                                            </Button>
                                                            <Button type="button" onClick={() => setOpenDate(false)}>
                                                                Apply
                                                            </Button>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }

                                case "daterange": {
                                    const today = dayjs();

                                    const presets = [
                                        { label: "Today", range: { from: today, to: today } },
                                        { label: "Yesterday", range: { from: dayjs().subtract(1, "day"), to: dayjs().subtract(1, "day") } },
                                        { label: "Last 7 days", range: { from: dayjs().subtract(6, "day"), to: today } },
                                        { label: "Last 30 days", range: { from: dayjs().subtract(29, "day"), to: today } },
                                        { label: "Month to date", range: { from: dayjs().startOf("month"), to: today } },
                                        {
                                            label: "Last month",
                                            range: {
                                                from: dayjs().subtract(1, "month").startOf("month"),
                                                to: dayjs().subtract(1, "month").endOf("month"),
                                            },
                                        },
                                        { label: "Year to date", range: { from: dayjs().startOf("year"), to: today } },
                                        {
                                            label: "Last year",
                                            range: {
                                                from: dayjs().subtract(1, "year").startOf("year"),
                                                to: dayjs().subtract(1, "year").endOf("year"),
                                            },
                                        },
                                    ];

                                    // Configurability options
                                    const showPreset = field.preset?.showPreset ?? true;

                                    // Tentukan nilai awal (prioritas: field.defaultValue -> field.preset.defaultPreset -> default index)
                                    const defaultPresetIndex = field.preset?.defaultPreset ?? 0;
                                    const defaultPreset = presets[defaultPresetIndex] || presets[0]; // fallback aman

                                    const initialFrom =
                                        controllerField.value?.from
                                            ? dayjs(controllerField.value.from)
                                            : field.defaultValue?.from
                                                ? dayjs(field.defaultValue.from)
                                                : field.preset?.range?.from
                                                    ? dayjs(field.preset.range.from)
                                                    : defaultPreset?.range?.from
                                                        ? dayjs(defaultPreset.range.from)
                                                        : null;

                                    const initialTo =
                                        controllerField.value?.to
                                            ? dayjs(controllerField.value.to)
                                            : field.defaultValue?.to
                                                ? dayjs(field.defaultValue.to)
                                                : field.preset?.range?.to
                                                    ? dayjs(field.preset.range.to)
                                                    : defaultPreset?.range?.to
                                                        ? dayjs(defaultPreset.range.to)
                                                        : null;

                                    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
                                    const [month, setMonth] = useState(initialFrom || today);

                                    // Nilai awal date dan preset label
                                    const [date, setDate] = useState({
                                        from: initialFrom || null,
                                        to: initialTo || null,
                                    });

                                    const [selectedPreset, setSelectedPreset] = useState(() => {
                                        // Kalau user pakai defaultValue manual, preset dianggap tidak aktif
                                        if (field.defaultValue?.from || field.defaultValue?.to) return null;
                                        return defaultPreset?.label;
                                    });


                                    const handleSelect = (selected) => {
                                        setDate({
                                            from: selected?.from ? dayjs(selected.from) : null,
                                            to: selected?.to ? dayjs(selected.to) : null,
                                        });
                                        setSelectedPreset(null);
                                    };

                                    const handleApply = () => {
                                        controllerField.onChange({
                                            from: date?.from ? dayjs(date.from).format(field.format) : null,
                                            to: date?.to ? dayjs(date.to).format(field.format) : null,
                                        });
                                        setIsPopoverOpen(false);
                                    };

                                    const handleReset = () => {
                                        setDate(defaultPreset.range);
                                        setSelectedPreset(defaultPreset.label);
                                        controllerField.onChange({
                                            from: defaultPreset.range.from.format("YYYY-MM-DD"),
                                            to: defaultPreset.range.to.format("YYYY-MM-DD"),
                                        });
                                        setIsPopoverOpen(false);
                                    };

                                    const handleClear = (e) => {
                                        e.stopPropagation();
                                        setDate({ from: null, to: null });
                                        controllerField.onChange({ from: null, to: null });
                                    };

                                    useEffect(() => {
                                        if (date?.from && date?.to) {
                                            const matchedPreset = presets.find(
                                                (preset) =>
                                                    preset.range.from.isSame(date.from, "day") &&
                                                    preset.range.to.isSame(date.to, "day")
                                            );
                                            setSelectedPreset(matchedPreset?.label || null);
                                        } else {
                                            setSelectedPreset(null);
                                        }
                                    }, [date]);

                                    return (
                                        <FormItem>
                                            <FormLabel>{field.label}</FormLabel>
                                            <FormControl>
                                                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            {...field}
                                                            type="button"
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal transition-shadow group",
                                                                !date?.from && !date?.to && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {date?.from ? (
                                                                date.to ? (
                                                                    <>
                                                                        {date.from.format(field.format || "DD MMM YYYY")} -{" "}
                                                                        {date.to.format(field.format || "DD MMM YYYY")}
                                                                    </>
                                                                ) : (
                                                                    date.from.format(field.format || "DD MMM YYYY")
                                                                )
                                                            ) : (
                                                                "Pick a date range"
                                                            )}

                                                            {/* === Clear Button on Right === */}
                                                            {(date?.from || date?.to) && (
                                                                <button
                                                                    type="button"
                                                                    onClick={handleClear}
                                                                    className="ml-auto text-muted-foreground hover:text-primary opacity-70 hover:opacity-100"
                                                                >
                                                                    <XCircleIcon
                                                                        className="ml-auto h-4 w-4 opacity-70 hover:text-primary"
                                                                    />
                                                                </button>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>

                                                    <PopoverContent className="w-auto p-0" align="center">
                                                        <div className="flex max-sm:flex-col">
                                                            {/* === Preset Section (configurable) === */}
                                                            {showPreset && (
                                                                <div className="relative border-border max-sm:order-1 max-sm:border-t sm:w-32">
                                                                    <div className="h-full border-border sm:border-e py-2">
                                                                        <div className="flex flex-col px-2 gap-[2px]">
                                                                            {presets.map((preset, index) => (
                                                                                <Button
                                                                                    key={index}
                                                                                    type="button"
                                                                                    variant="ghost"
                                                                                    className={cn(
                                                                                        "h-8 w-full justify-start",
                                                                                        selectedPreset === preset.label && "bg-accent"
                                                                                    )}
                                                                                    onClick={() => {
                                                                                        setDate(preset.range);
                                                                                        controllerField.onChange({
                                                                                            from: preset.range.from.format("YYYY-MM-DD"),
                                                                                            to: preset.range.to.format("YYYY-MM-DD"),
                                                                                        });
                                                                                        setMonth(preset.range.from || today);
                                                                                        setSelectedPreset(preset.label);
                                                                                    }}
                                                                                >
                                                                                    {preset.label}
                                                                                </Button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* === Calendar Section === */}
                                                            <Calendar
                                                                autoFocus
                                                                mode="range"
                                                                month={month.toDate()}
                                                                onMonthChange={(m) => setMonth(dayjs(m))}
                                                                showOutsideDays={false}
                                                                numberOfMonths={2}
                                                                selected={{
                                                                    from: date?.from ? date.from.toDate() : undefined,
                                                                    to: date?.to ? date.to.toDate() : undefined,
                                                                }}
                                                                onSelect={handleSelect}
                                                            />
                                                        </div>

                                                        {/* === Footer Buttons === */}
                                                        <div className="flex items-center justify-end gap-1.5 border-t border-border p-3">
                                                            <Button variant="outline" onClick={handleReset}>
                                                                Reset
                                                            </Button>
                                                            <Button onClick={handleApply}>Apply</Button>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }
                                case "switch": {
                                    return (
                                        <FormItem>
                                            <FormLabel>{field.label}</FormLabel>
                                            <FormControl>
                                                <Switch
                                                    {...field}
                                                    type="button"
                                                    checked={controllerField.value}
                                                    onCheckedChange={controllerField.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }
                                case "checkbox": {
                                    return (
                                        <FormItem>
                                            <FormLabel>{field.label}</FormLabel>
                                            <FormControl>
                                                <div className="flex gap-4 flex-wrap">
                                                    {field.options?.map((opt) => (
                                                        <label key={opt} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                {...field}
                                                                type="button"
                                                                checked={controllerField.value?.includes(opt)}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) {
                                                                        controllerField.onChange([
                                                                            ...(controllerField.value || []),
                                                                            opt,
                                                                        ])
                                                                    } else {
                                                                        controllerField.onChange(
                                                                            controllerField.value?.filter((v) => v !== opt)
                                                                        )
                                                                    }
                                                                }}
                                                            />
                                                            <span>{opt}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }
                                case "radio": {
                                    return (
                                        <FormItem>
                                            <FormLabel>{field.label}</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    {...field}
                                                    onValueChange={controllerField.onChange}
                                                    value={controllerField.value}
                                                >
                                                    {field.options?.map((opt) => (
                                                        <label key={opt}
                                                            className="flex items-center space-x-2">
                                                            <RadioGroupItem value={opt} />
                                                            <span>{opt}</span>
                                                        </label>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }
                                case "select": {
                                    const [open, setOpen] = useState(false)
                                    const [options, setOptions] = useState(field.options || [])
                                    const [inputValue, setInputValue] = useState("")

                                    const handleSelect = (val) => {
                                        controllerField.onChange(val)
                                        setOpen(false)
                                    }

                                    const handleCreate = () => {
                                        if (!inputValue) return
                                        const newOption = { label: inputValue.trim(), value: inputValue.trim().toLowerCase().replace(/\s+/g, "_") }
                                        setOptions((prev) => [...prev, newOption])
                                        controllerField.onChange(newOption.value)
                                        setInputValue("")
                                        setOpen(false)
                                    }

                                    const filteredOptions = options.filter((opt) =>
                                        opt.label.toLowerCase().includes(inputValue.toLowerCase())
                                    )

                                    const showCreateButton =
                                        field.creatable &&
                                        inputValue.trim() !== "" &&
                                        !options.some((opt) => opt.label.toLowerCase() === inputValue.toLowerCase())

                                    return (
                                        <FormItem>
                                            <FormLabel>{field.label}</FormLabel>
                                            <FormControl>
                                                <Popover open={open} onOpenChange={setOpen}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className="w-full justify-between"
                                                        >
                                                            {
                                                                options.find((o) => o.value === controllerField.value)?.label ||
                                                                "Select option"
                                                            }
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>

                                                    <PopoverContent className="w-full p-0">
                                                        <Command className={!field.searchable ? "w-67" : "w-76"}>
                                                            {field.searchable && (
                                                                <CommandInput
                                                                    placeholder={`Search ${field.label}...`}
                                                                    value={inputValue}
                                                                    onValueChange={setInputValue}
                                                                />
                                                            )}

                                                            {filteredOptions.length === 0 && !showCreateButton && (
                                                                <CommandEmpty>No results found.</CommandEmpty>
                                                            )}

                                                            <CommandGroup>
                                                                {filteredOptions.map((opt) => (
                                                                    <CommandItem
                                                                        key={opt.value}
                                                                        value={opt.value}
                                                                        onSelect={() => handleSelect(opt.value)}
                                                                    >
                                                                        <Check
                                                                            className={`mr-2 h-4 w-4 text-primary ${controllerField.value === opt.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                                }`}
                                                                        />
                                                                        {opt.label}
                                                                    </CommandItem>
                                                                ))}

                                                                {/* ✅ Creatable Section */}
                                                                {showCreateButton && (
                                                                    <CommandItem onSelect={handleCreate} className="text-primary">
                                                                        <Plus className="mr-2 h-4 w-4" />
                                                                        Create "{inputValue}"
                                                                    </CommandItem>
                                                                )}
                                                            </CommandGroup>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }
                                case "otp": {
                                    return (
                                        <FormItem>
                                            <FormLabel>{field.label}</FormLabel>
                                            <FormControl>
                                                <InputOTP
                                                    {...field}
                                                    maxLength={field.length || 6}
                                                    value={controllerField.value || ""}
                                                    onChange={controllerField.onChange}
                                                >
                                                    {field.customGroups
                                                        ? renderOtpCustomGroups(field.length || 6, field.customGroups)
                                                        : field.groupSize
                                                            ? renderOtpGroups(field.length || 6, field.groupSize)
                                                            : (
                                                                <InputOTPGroup>
                                                                    {Array.from({ length: field.length || 6 }).map((_, i) => (
                                                                        <InputOTPSlot key={i} index={i} />
                                                                    ))}
                                                                </InputOTPGroup>
                                                            )}
                                                </InputOTP>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }
                                case "multiselect": {
                                    return (
                                        <FormItem>
                                            <FormLabel>{field.label}</FormLabel>
                                            <FormControl>
                                                <MultiSelect
                                                    {...field}
                                                    options={field.options || []}
                                                    value={controllerField.value || []}
                                                    onChange={controllerField.onChange}
                                                    placeholder={field.placeholder || "Select options"}
                                                    showSelectAll={field.showSelectAll ?? true}
                                                    creatable={field.creatable ?? false}
                                                    maxSelected={field.maxSelected}
                                                    maxTagCount={field.maxTagCount || 3}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }
                                default: {
                                    return (
                                        <FormItem>
                                            <FormLabel>{field.label}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    {...controllerField}
                                                    placeholder={field.placeholder}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }
                            }
                        }}
                    />

                    {/* {errors[field.name] && (
                        <p className="text-sm text-red-500">
                            {errors[field.name]?.message}
                        </p>
                    )} */}
                </div>
            ))}
        </>
    )
}