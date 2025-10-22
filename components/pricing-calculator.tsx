"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PricingCalculatorProps {
  basePrice: number;
  markupPercentage: number;
  finalPrice: number;
}

export function PricingCalculator({
  basePrice: initialBasePrice,
  markupPercentage: initialMarkupPercentage,
  finalPrice: initialFinalPrice,
}: PricingCalculatorProps) {
  const [basePrice, setBasePrice] = useState(initialBasePrice);
  const [markupPercentage, setMarkupPercentage] = useState(
    initialMarkupPercentage
  );
  const [finalPrice, setFinalPrice] = useState(initialFinalPrice);

  // Calculate final price whenever base price or markup changes
  useEffect(() => {
    if (basePrice && markupPercentage) {
      const calculated = basePrice + (basePrice * markupPercentage) / 100;
      setFinalPrice(calculated);
    } else if (basePrice) {
      setFinalPrice(basePrice);
    }
  }, [basePrice, markupPercentage]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="basePrice">Base Price (Service Provider)</Label>
        <Input
          id="basePrice"
          name="basePrice"
          type="number"
          step="0.01"
          value={basePrice}
          onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          required
        />
      </div>

      <div>
        <Label htmlFor="markupPercentage">Markup Percentage</Label>
        <Input
          id="markupPercentage"
          name="markupPercentage"
          type="number"
          step="0.01"
          value={markupPercentage}
          onChange={(e) => setMarkupPercentage(parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          min="0"
          max="100"
        />
      </div>

      <div>
        <Label htmlFor="finalPrice">Final Price (Customer)</Label>
        <Input
          id="finalPrice"
          name="finalPrice"
          type="number"
          step="0.01"
          value={finalPrice}
          onChange={(e) => setFinalPrice(parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          required
          className="bg-gray-50"
        />
        {basePrice && markupPercentage > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            Markup: ₹{((basePrice * markupPercentage) / 100).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}
