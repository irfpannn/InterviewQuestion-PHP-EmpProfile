import * as React from "react";
import { cn } from "../../lib/utils";

type Department = "hr" | "engineering" | "marketing" | "sales" | "finance" | "operations";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
  department?: Department;
}

const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  department,
  ...props
}) => {
  const departmentStyles = {
    hr: "bg-blue-100 text-blue-800 border border-blue-200",
    engineering: "bg-green-100 text-green-800 border border-green-200",
    marketing: "bg-purple-100 text-purple-800 border border-purple-200",
    sales: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    finance: "bg-indigo-100 text-indigo-800 border border-indigo-200",
    operations: "bg-rose-100 text-rose-800 border border-rose-200"
  };

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        department ? departmentStyles[department] : variants[variant],
        className
      )}
      {...props}
    />
  );
};

export { Badge };
