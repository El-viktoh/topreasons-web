"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/20",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-primary/50 bg-background text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground lowercase font-normal tracking-normal",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-primary text-primary-foreground font-bold uppercase tracking-[0.2em] hover:bg-primary/90 transition-all duration-500 px-10 py-8 text-xs shadow-xl hover:shadow-primary/30",
        "hero-outline": "bg-transparent text-foreground border border-foreground/30 hover:border-primary hover:text-primary uppercase tracking-widest transition-all duration-300",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
        success: "bg-success text-success-foreground hover:bg-success/90",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 px-3",
        lg: "h-14 px-10",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

