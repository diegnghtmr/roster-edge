import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface INewCurrency {
  name: string;
  symbol: string;
}

interface IField {
  name: string;
  value: string | number;
}

interface CurrencyFormProps {
  currency: INewCurrency;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeValue: (field: IField) => void;
  isLoading: boolean;
}

export const CurrencyForm: React.FC<CurrencyFormProps> = ({
  currency,
  onSubmit,
  onChangeValue,
  isLoading,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nombre de la moneda
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          value={currency.name}
          onChange={(e) =>
            onChangeValue({ name: "name", value: e.target.value })
          }
          placeholder="Ingrese el nombre de la moneda"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="symbol" className="text-sm font-medium text-gray-700">
          Símbolo
        </label>
        <Input
          id="symbol"
          name="symbol"
          type="text"
          value={currency.symbol}
          onChange={(e) =>
            onChangeValue({ name: "symbol", value: e.target.value })
          }
          placeholder="Ingrese el símbolo de la moneda"
          required
        />
      </div>

      <div className="flex justify-end col-span-1 md:col-span-2">
        <Button type="submit" disabled={isLoading} className="max-w-[200px]">
          {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
};
