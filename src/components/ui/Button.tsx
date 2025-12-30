import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => {

        // Base styles
        const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background";

        // Variants
        const variants = {
            primary: "bg-primary text-black hover:bg-primary/90 hover:scale-105 shadow-glow hover:shadow-glow-strong focus:ring-primary",
            secondary: "bg-secondary text-black hover:bg-secondary/90 hover:scale-105 shadow-md",
            outline: "border border-gray-700 bg-transparent text-white hover:bg-white/5 hover:border-gray-500",
            ghost: "bg-transparent text-gray-300 hover:text-white hover:bg-white/5",
        };

        // Sizes
        const sizes = {
            sm: "h-8 px-3 text-sm",
            md: "h-10 px-5 text-base",
            lg: "h-12 px-8 text-lg font-semibold",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    fullWidth ? "w-full" : "",
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";
