'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useDebounce } from 'use-debounce'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ChevronsUpDown, Search, X } from 'lucide-react'

interface AutoCompleteProps {
    className?: string
    placeholder?: string
    value?: string
    minLength?: number
    onChange?: (value: string) => void
    onFetching?: (query: string) => void
    onEnter?: boolean

    allowMultiple?: boolean                     // NEW
    onSubmitSelected?: (selected: string[]) => void // NEW

    exclude?: string[]

    showButtonSearch?: boolean
    showButtonReset?: boolean
    showOpenSuggestion?: boolean
}

export default function AutoComplete({
    className,
    placeholder = 'Search Data',
    minLength = 0,

    onEnter = false,
    allowMultiple = false,

    exclude, //bentuk harus sama dengan hasil return onFetching

    value = '',
    onChange,

    onFetching,
    onSubmitSelected,

    showButtonSearch,
    showButtonReset,
    showOpenSuggestion,
}: AutoCompleteProps) {
    const lastFetchedRef = useRef<string>("");
    const insideClickRef = useRef<Boolean>(false);

    const [query, setQuery] = useState(value)
    const [debouncedQuery] = useDebounce(query, 500)
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [isLoading, setIsLoading] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const [selectedMultiple, setSelectedMultiple] = useState<string[]>([]) // NEW

    const fetchSuggestions = useCallback(async (query: string): Promise<string[]> => {
        if (typeof onFetching !== "function") return [];

        try {
            const results = await Promise.resolve(onFetching(query));
            const allSuggestions: string[] = Array.isArray(results) ? results : [];

            // Jika "exclude" mungkin undefined/null -> fallback ke []
            const excludeArray: string[] = Array.isArray(exclude) ? exclude : [];
            const excludeSet = new Set<string>(excludeArray);

            const filtered: string[] = allSuggestions
                .filter((item: string) =>
                    item.toLowerCase().includes(query.toLowerCase())
                )
                .filter((item: string) => !excludeSet.has(item)); // EXCLUDE items

            return filtered;

        } catch (err) {
            console.error("fetchSuggestions error:", err);
            return [];
        }
    }, [exclude]);

    const fetchSuggestionsCallback = useCallback(async (q: string) => {
        if (q.trim() === "") {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        const results = await fetchSuggestions(q);
        setSuggestions(results);
        setIsLoading(false);
    }, [exclude]);

    // ============================================================
    // MODE AUTO (DEBOUNCE)
    // ============================================================
    useEffect(() => {
        if (onEnter) return;

        if (debouncedQuery.length < minLength || debouncedQuery.trim() === "") {
            setSuggestions([]);
            setIsLoading(false);
            return;
        }

        if (debouncedQuery === lastFetchedRef.current) return;

        fetchSuggestionsCallback(debouncedQuery).then(() => {
            lastFetchedRef.current = debouncedQuery;
        });
    }, [debouncedQuery, fetchSuggestionsCallback, minLength, onEnter]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setQuery(newValue);
        onChange?.(newValue);
        setSelectedIndex(-1);

        if (newValue.length < minLength || newValue.trim() === "") {
            setSuggestions([]);
            setIsLoading(false);
        }
    };

    // ============================================================
    // KEYDOWN
    // ============================================================
    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
            return;
        }

        if (e.key === 'Escape') {
            setSuggestions([]);
            setSelectedIndex(-1);
            return;
        }

        if (e.key === 'Enter') {

            // ============================
            // MODE MULTIPLE
            // ============================
            if (allowMultiple) {
                // ENTER tidak memilih item
                // tetapi tetap boleh memicu fetch jika onEnter = true
                if (onEnter && query.trim() !== "" && query.length >= minLength) {
                    setIsLoading(true);
                    await fetchSuggestionsCallback(query);
                    lastFetchedRef.current = query;
                }
                return;
            }

            // ============================
            // MODE SINGLE (default behaviour)
            // ============================

            // Case 1: pilih suggestion
            if (selectedIndex >= 0) {
                const selectedText = suggestions[selectedIndex];
                setQuery(selectedText);
                onChange?.(selectedText);
                setSuggestions([]);
                setSelectedIndex(-1);
                return;
            }

            // Case 2: trigger fetch (onEnter mode)
            if (onEnter) {
                if (query.trim() === "" || query.length < minLength) return;

                setIsLoading(true);
                await fetchSuggestionsCallback(query);
                lastFetchedRef.current = query;
                return;
            }
        }

    };

    const handleSuggestionClick = (suggestion: string) => {
        if (allowMultiple) {
            setSelectedMultiple(prev =>
                prev.includes(suggestion)
                    ? prev.filter(s => s !== suggestion)
                    : [...prev, suggestion]
            );
            return;
        }

        setQuery(suggestion);
        onChange?.(suggestion);
        lastFetchedRef.current = suggestion;
        if (suggestion.trim() === "") setSuggestions([]);
        setSelectedIndex(-1);
        setIsFocused(false);
    };

    const handleFocus = () => setIsFocused(true);

    const handleBlur = () => {
        setTimeout(() => {
            if (!insideClickRef.current) {
                // klik di luar → close
                setIsFocused(false);
                if (query.trim() === "") {
                    setSuggestions([]);
                }
                setSelectedIndex(-1);
            }
            // reset
            insideClickRef.current = false;
        }, 120);
    };

    const handleSubmitMultiple = () => {
        if (onSubmitSelected) {

            // Kirim data yang dipilih
            onSubmitSelected(selectedMultiple);

            // Hapus dari suggestions item yang sudah dipilih
            setSuggestions(prev =>
                prev.filter(item => !selectedMultiple.includes(item))
            );

            // Reset state
            setSelectedMultiple([]);
            setQuery("");
        }

        setIsFocused(false);
    };

    const handleIconClickReset = () => {
        setQuery("");
        onChange?.("");
        setSuggestions([]);
        setSelectedIndex(-1);
    };

    const handleIconClick = async () => {
        if (!query.trim() || query.length < minLength) return;

        setIsFocused(true); // supaya dropdown muncul
        setIsLoading(true);

        await fetchSuggestionsCallback(query);
        lastFetchedRef.current = query;

        setIsLoading(false);
    };



    return (
        <div className="relative w-full">
            <Input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={cn(`w-full ${(showOpenSuggestion || showButtonSearch || showButtonReset) ? 'pr-8' : 'pr-8'}`, className)}   // beri ruang kanan untuk 3 icon
            />

            {/* RIGHT ICON GROUP */}
            <div
                className="
                    absolute inset-y-0 right-2 
                    flex items-center gap-2 
                    pointer-events-auto
                "
            >
                <button
                    type="button"
                    onClick={() => { }}
                    className="text-muted-foreground"
                >
                    <ChevronsUpDown className="h-4 w-4" />
                </button>

                {/* OPEN SUGGESTION (ondev) */}
                {showOpenSuggestion && (
                    <button
                        type="button"
                        onClick={() => setIsFocused((prev) => !prev)}
                        className="text-muted-foreground hover:text-foreground transition"
                    >
                        <ChevronsUpDown className="h-4 w-4" />
                    </button>
                )}

                {/* SEARCH (ondev) */}
                {showButtonSearch && (
                    <button
                        type="button"
                        onClick={handleIconClick}
                        className="text-muted-foreground hover:text-foreground transition"
                    >
                        <Search className="h-4 w-4" />
                    </button>
                )}

                {/* RESET (ondev) */}
                {showButtonReset && query !== "" && (
                    <button
                        type="button"
                        onClick={handleIconClickReset}
                        className="text-muted-foreground hover:text-foreground transition"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {isLoading && isFocused && (
                <div className="absolute text-sm left-0 right-0 mt-2 p-2 bg-background border rounded-md shadow-sm z-10">
                    Mencari Data...
                </div>
            )}

            {!isLoading &&
                isFocused &&
                query.length >= minLength &&
                suggestions.length === 0 &&
                query.trim() !== "" &&
                (!onEnter || lastFetchedRef.current === query) && (
                    <div className="absolute text-sm left-0 right-0 mt-2 p-2 bg-background border rounded-md shadow-sm text-muted-foreground z-99">
                        No data available
                    </div>
                )}

            {suggestions.length > 0 && isFocused && !isLoading && (
                <div
                    className="absolute left-0 right-0 mt-2 bg-background border rounded-md shadow-sm z-99"
                    onMouseDown={() => {
                        insideClickRef.current = true;
                    }}
                >
                    <ul id="suggestions-list" className="text-sm max-h-64 overflow-auto">
                        {suggestions.map((suggestion, index) => {
                            const isSelected = selectedMultiple.includes(suggestion);

                            return (
                                <li
                                    key={suggestion}
                                    className={`px-4 py-2 cursor-pointer flex items-center justify-start gap-2 hover:bg-muted ${index === selectedIndex ? 'bg-muted' : ''
                                        }`}
                                    onClick={(e) =>
                                        !allowMultiple && handleSuggestionClick(suggestion)
                                    }
                                >
                                    {allowMultiple && (
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={(e) =>
                                                handleSuggestionClick(suggestion)
                                            }
                                        />
                                    )}
                                    <span>{suggestion}</span>
                                </li>
                            );
                        })}
                    </ul>

                    {allowMultiple && (
                        <div className="flex justify-end p-2 gap-2 border-t bg-background">
                            <Button size="sm" variant="outline" onClick={handleIconClickReset}>
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleSubmitMultiple}>
                                Submit
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

}