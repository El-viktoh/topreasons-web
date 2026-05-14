"use client";

import { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  suggestions?: string[];
}

export default function TagInput({ value, onChange, placeholder = "Type and press Enter", maxTags = 10, suggestions = [] }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      e.preventDefault();
      removeTag(value.length - 1);
    }
  };

  const addTag = (tag: string) => {
    if (value.length >= maxTags || value.includes(tag)) return;
    onChange([...value, tag]);
    setInputValue("");
  };

  const removeTag = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag, index) => (
            <Badge key={index} variant="secondary" className="px-2 py-1 text-sm gap-1">
              {tag}
              <button type="button" onClick={() => removeTag(index)} className="ml-1 hover:bg-destructive/20 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length >= maxTags ? `Max ${maxTags} tags` : placeholder}
        disabled={value.length >= maxTags}
      />

      {suggestions.length > 0 && value.length < maxTags && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Suggestions:</span>
          {suggestions
            .filter((s) => !value.includes(s))
            .slice(0, 5)
            .map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => addTag(suggestion)}
                className="text-xs px-2 py-1 rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                + {suggestion}
              </button>
            ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">{value.length}/{maxTags} tags • Press Enter to add</p>
    </div>
  );
}
