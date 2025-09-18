"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type ButtonElement = HTMLButtonElement;

type ButtonProps = React.ButtonHTMLAttributes<ButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-foreground text-background hover:bg-foreground/90",
        outline:
          "border border-input bg-background hover:bg-muted hover:text-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-muted text-muted-foreground hover:bg-muted/80",
        destructive: "bg-red-500 text-white hover:bg-red-500/90",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

const Button = React.forwardRef<ButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Component = asChild ? (React.Fragment as unknown as any) : "button";

    if (asChild) {
      return (
        <Component>
          <button
            ref={ref}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
          />
        </Component>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
