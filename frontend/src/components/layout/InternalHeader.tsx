import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface InternalHeaderProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonIcon?: ReactNode;
  buttonLink?: string;
  onButtonClick?: () => void;
}

export const InternalHeader = ({
  title,
  description,
  buttonText,
  buttonIcon,
  buttonLink,
  onButtonClick,
}: InternalHeaderProps) => {
  const renderButton = () => {
    if (!buttonText) return null;

    const buttonContent = (
      <Button className="flex items-center gap-2" onClick={onButtonClick}>
        {buttonIcon}
        <span>{buttonText}</span>
      </Button>
    );

    if (buttonLink) {
      return <Link to={buttonLink}>{buttonContent}</Link>;
    }

    return buttonContent;
  };

  return (
    <div className="w-full mb-6 p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-2">{description}</p>
        </div>
        {renderButton()}
      </div>
    </div>
  );
};
