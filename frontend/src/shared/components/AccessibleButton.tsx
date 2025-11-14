import React from 'react';
import { Button } from '@/components/ui/button';

type ButtonProps = React.ComponentProps<typeof Button>;

interface AccessibleButtonProps extends ButtonProps {
  /**
   * Accessible label for screen readers (required for icon-only buttons)
   */
  'aria-label'?: string;

  /**
   * Indicates if button controls a popup/menu
   */
  'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';

  /**
   * Indicates if controlled element is expanded
   */
  'aria-expanded'?: boolean;

  /**
   * Loading state for async actions
   */
  isLoading?: boolean;

  /**
   * Keyboard shortcut hint
   */
  shortcut?: string;
}

/**
 * Enhanced Button component with built-in accessibility features
 * Ensures proper ARIA attributes and keyboard navigation
 */
export const AccessibleButton = React.forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      children,
      'aria-label': ariaLabel,
      'aria-haspopup': ariaHasPopup,
      'aria-expanded': ariaExpanded,
      isLoading,
      disabled,
      shortcut,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        aria-label={ariaLabel}
        aria-haspopup={ariaHasPopup}
        aria-expanded={ariaExpanded}
        aria-busy={isLoading}
        aria-disabled={disabled || isLoading}
        disabled={disabled || isLoading}
        title={shortcut ? `Shortcut: ${shortcut}` : undefined}
        {...props}
      >
        {children}
        {isLoading && (
          <span className="sr-only" aria-live="polite">
            Cargando...
          </span>
        )}
      </Button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';
