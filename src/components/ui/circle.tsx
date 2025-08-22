"use client";


import { useState } from "react";
import { Circle } from "rc-progress";


type CircleVariant = "HighStock" | "LowStock" | "OutStock" | "DefaultCircle";


interface CircleProps {
  variant?: CircleVariant;
  maxValue?: number;
}


export default function CustomCircle({
  variant = "DefaultCircle",
  maxValue = 100,
}: CircleProps) {


  const [highStockValue, setHighStockValue] = useState(0);
  const [lowStockValue, setLowStockValue] = useState(0);
  const [outStockValue, setOutStockValue] = useState(0);
  const [defaultValue, setDefaultValue] = useState(0);


  const variantColors: Record<CircleVariant, string> = {
    HighStock: "#7ed378",
    LowStock: "#ff6609",
    OutStock: "#fc001b",
    DefaultCircle: "#0f1729",
  };


  const valueMap: Record<
    CircleVariant,
    [number, React.Dispatch<React.SetStateAction<number>>]
  > = {
    HighStock: [highStockValue, setHighStockValue],
    LowStock: [lowStockValue, setLowStockValue],
    OutStock: [outStockValue, setOutStockValue],
    DefaultCircle: [defaultValue, setDefaultValue],
  };


  const [value, setValue] = valueMap[variant];


  const safeValue =
    variant === "DefaultCircle"
      ? Math.min(value, 100)
      : Math.min(value, maxValue);


  return (
    <div
      className="relative w-[80px] h-[80px] min-w-[80px] min-h-[80px] flex-shrink-0 flex items-center justify-center cursor-pointer"
    >
      <div className="absolute w-full h-full rounded-full bg-[#ebdcdb]" />


      <Circle
        percent={
          variant === "DefaultCircle"
            ? safeValue
            : (safeValue / maxValue) * 100
        }
        strokeWidth={8}
        strokeColor={variantColors[variant]}
        trailColor="#f4eaea"
        strokeLinecap="round"
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          zIndex: 1,
        }}
      />


      <span className="absolute text-2xl font-bold text-black z-10">
        {variant === "DefaultCircle" ? `${safeValue}%` : safeValue}
      </span>
    </div>
  );
}
