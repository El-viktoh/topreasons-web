"use client";

import { useCurrency, Currency } from "@/contexts/CurrencyContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign } from "lucide-react";

const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
  { value: "GHS", label: "Ghana Cedi", symbol: "GH₵" },
  { value: "USD", label: "US Dollar", symbol: "$" },
  { value: "GBP", label: "British Pound", symbol: "£" },
];

export const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
      <SelectTrigger className="w-[100px] h-9 text-sm bg-card border-border">
        <DollarSign className="w-3 h-3 mr-1 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((curr) => (
          <SelectItem key={curr.value} value={curr.value}>
            <span className="flex items-center gap-2">
              <span className="font-medium">{curr.symbol}</span>
              <span className="text-muted-foreground">{curr.value}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
