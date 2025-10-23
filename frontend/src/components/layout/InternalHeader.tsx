import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeaderButton {
  text: string;
  icon?: ReactNode;
  link?: string;
  onClick?: () => void;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
}

interface InternalHeaderProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonIcon?: ReactNode;
  buttonLink?: string;
  onButtonClick?: () => void;
  buttons?: HeaderButton[];
}

export const InternalHeader = ({
  title,
  description,
  buttonText,
  buttonIcon,
  buttonLink,
  onButtonClick,
  buttons = [],
}: InternalHeaderProps) => {
  // Compatibilidad con el formato anterior
  const allButtons: HeaderButton[] = [
    ...buttons,
    ...(buttonText
      ? [
          {
            text: buttonText,
            icon: buttonIcon,
            link: buttonLink,
            onClick: onButtonClick,
            variant: "default" as const,
          },
        ]
      : []),
  ];

  const renderButton = (button: HeaderButton, index: number) => {
    const buttonContent = (
      <Button
        key={index}
        className="flex items-center gap-2"
        variant={button.variant || "default"}
        onClick={button.onClick}
      >
        {button.icon}
        <span>{button.text}</span>
      </Button>
    );

    if (button.link) {
      return <Link to={button.link}>{buttonContent}</Link>;
    }

    return buttonContent;
  };

  return (
    <div className="w-full mb-6 p-6 bg-gradient-to-br from-white to-red-100 rounded-lg relative overflow-hidden">
      {/* Patrón SVG de fondo */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="#dc2626"
                strokeWidth="1.5"
                opacity="0.4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <circle cx="30" cy="30" r="3" fill="#dc2626" opacity="0.3" />
          <circle cx="90" cy="30" r="3" fill="#dc2626" opacity="0.3" />
          <circle cx="30" cy="90" r="3" fill="#dc2626" opacity="0.3" />
          <circle cx="90" cy="90" r="3" fill="#dc2626" opacity="0.3" />
        </svg>
      </div>

      <div className="flex justify-between items-center gap-4 relative">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-700 mt-2">{description}</p>
        </div>
        {allButtons.length > 0 && (
          <div className="flex gap-2">{allButtons.map(renderButton)}</div>
        )}
      </div>
    </div>
  );
};
