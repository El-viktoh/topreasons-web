"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Currency = "GHS" | "USD" | "GBP";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceInGHS: number) => number;
  formatPrice: (priceInGHS: number) => string;
  getCurrencySymbol: () => string;
}

const EXCHANGE_RATES: Record<Currency, number> = {
  GHS: 1,
  USD: 0.067,
  GBP: 0.053,
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  GHS: "GHS ",
  USD: "$",
  GBP: "£",
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>("GHS");

  useEffect(() => {
    const saved = localStorage.getItem("preferred_currency");
    if (saved) setCurrencyState(saved as Currency);
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("preferred_currency", c);
  };

  const convertPrice = (priceInGHS: number) => priceInGHS * EXCHANGE_RATES[currency];
  const getCurrencySymbol = () => CURRENCY_SYMBOLS[currency];

  const formatPrice = (priceInGHS: number) => {
    const converted = convertPrice(priceInGHS);
    const symbol = getCurrencySymbol();
    if (currency === "GHS") {
      return `${symbol}${converted.toLocaleString("en-GH", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    return `${symbol}${converted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice, getCurrencySymbol }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within a CurrencyProvider");
  return context;
};
