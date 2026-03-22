"use client";

import * as React from "react";
import { cn } from "./lib/utils";

/**
 * Dialog components that use native HTML for test compatibility.
 * Follows the same API patterns as shadcn/ui Dialog but without Radix dependency.
 */

/** Props for the Dialog root component. */
interface DialogProps {
  /** Whether the dialog is currently open. */
  open: boolean;
  /** Callback when the dialog should close. */
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

/** Dialog context to share open state and close handler. */
const DialogContext = React.createContext<{
  open: boolean;
  onClose: () => void;
}>({ open: false, onClose: () => {} });

/** Dialog root — manages open/close state. */
function Dialog({ open, onOpenChange, children }: DialogProps) {
  const onClose = React.useCallback(
    () => onOpenChange(false),
    [onOpenChange]
  );

  return (
    <DialogContext.Provider value={{ open, onClose }}>
      {children}
    </DialogContext.Provider>
  );
}

/** Dialog overlay + content wrapper. */
const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { "data-testid"?: string }
>(({ className, children, ...props }, ref) => {
  const { open, onClose } = React.useContext(DialogContext);

  React.useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      data-testid={props["data-testid"] ?? "confirm-dialog-overlay"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        ref={ref}
        className={cn(
          "mx-4 w-full max-w-md rounded-lg bg-background p-6 shadow-xl",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </div>
  );
});
DialogContent.displayName = "DialogContent";

/** Dialog header section. */
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

/** Dialog footer section. */
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

/** Dialog title element. */
const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

/** Dialog description element. */
const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
