import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  children?: React.ReactNode;
}>({
  open: false,
  setOpen: () => {},
});

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    { value, onValueChange, placeholder, children, disabled, ...props },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(value);

    const handleValueChange = (newValue: string) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
      setOpen(false);
    };

    const contextValue = {
      value: value ?? internalValue,
      onValueChange: handleValueChange,
      open,
      setOpen,
      children,
    };

    return (
      <SelectContext.Provider value={contextValue}>
        <div className="relative" ref={ref} {...props}>
          {children}
        </div>
      </SelectContext.Provider>
    );
  }
);

Select.displayName = "Select";

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { placeholder?: string }
>(({ className, children, placeholder, disabled, ...props }, ref) => {
  const { open, setOpen } = React.useContext(SelectContext);

  return (
    <button
      ref={ref}
      data-select-trigger
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => !disabled && setOpen(!open)}
      disabled={disabled}
      type="button"
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
});

SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, _ref) => {
  const { setOpen, open } = React.useContext(SelectContext);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        contentRef.current &&
        !contentRef.current.contains(target) &&
        !target.closest("[data-select-trigger]")
      ) {
        setOpen(false);
      }
    };

    if (open) {
      // Small delay to prevent immediate closing when opening
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpen, open]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white text-gray-900 shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  HTMLDivElement,
  SelectItemProps & React.HTMLAttributes<HTMLDivElement>
>(({ className, children, value, ...props }, ref) => {
  const { onValueChange, value: selectedValue } =
    React.useContext(SelectContext);
  const isSelected = selectedValue === value;

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900",
        isSelected && "bg-primary-100 text-primary-700",
        className
      )}
      onClick={() => onValueChange?.(value)}
      {...props}
    >
      {children}
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
      )}
    </div>
  );
});

SelectItem.displayName = "SelectItem";

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, placeholder, ...props }, ref) => {
  const { value, children } = React.useContext(SelectContext);

  // Find the selected item from children to get the display text
  let displayValue = value;

  if (children && value) {
    React.Children.forEach(children, (child) => {
      if (
        React.isValidElement(child) &&
        child.type === SelectItem &&
        (child.props as any).value === value
      ) {
        displayValue = (child.props as any).children;
      }
    });
  }

  return (
    <span
      ref={ref}
      className={cn(!value && "text-gray-500", className)}
      {...props}
    >
      {displayValue || placeholder}
    </span>
  );
});

SelectValue.displayName = "SelectValue";

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
