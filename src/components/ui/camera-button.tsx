import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cameraButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        camera: "bg-gradient-primary text-white shadow-inspection hover:shadow-lg transform hover:scale-105 active:scale-95",
        capture: "bg-gradient-accent text-white shadow-inspection hover:shadow-lg transform hover:scale-105 active:scale-95",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-12 w-12",
        sm: "h-10 w-10",
        lg: "h-16 w-16",
        xl: "h-20 w-20",
      },
    },
    defaultVariants: {
      variant: "camera",
      size: "default",
    },
  }
)

export interface CameraButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof cameraButtonVariants> {
  asChild?: boolean
}

const CameraButton = React.forwardRef<HTMLButtonElement, CameraButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(cameraButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
CameraButton.displayName = "CameraButton"

export { CameraButton, cameraButtonVariants }