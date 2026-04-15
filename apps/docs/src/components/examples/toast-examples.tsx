"use client";

import { Button, toast } from "@geckoui/geckoui";

export function BasicToastExample() {
  return (
    <div className="flex gap-2">
      <Button onClick={() => toast("This is a basic toast notification")}>Show Toast</Button>
    </div>
  );
}

export function ToastVariantsExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => toast.success("Operation completed successfully!")}>Success</Button>
      <Button onClick={() => toast.error("An error occurred!")}>Error</Button>
      <Button onClick={() => toast.warning("This is a warning message")}>Warning</Button>
      <Button onClick={() => toast.info("Here is some information")}>Info</Button>
    </div>
  );
}

export function ToastWithDescriptionExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() =>
          toast.success("Account created", {
            description: "Your account has been created successfully. You can now sign in."
          })
        }>
        With Description
      </Button>
      <Button
        onClick={() =>
          toast.error("Upload failed", {
            description: "The file size exceeds the 10MB limit. Please choose a smaller file."
          })
        }>
        Error with Details
      </Button>
    </div>
  );
}

export function ToastWithActionExample() {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() =>
          toast("Email sent", {
            description: "Your email has been sent to john@example.com",
            action: {
              label: "Undo",
              onClick: () => toast.info("Email sending cancelled")
            }
          })
        }>
        With Action
      </Button>
    </div>
  );
}

export function PromiseToastExample() {
  const simulateAsyncOperation = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve({ name: "Report.pdf" }) : reject(new Error("Network error"));
      }, 2000);
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={() =>
          toast.promise(simulateAsyncOperation(), {
            loading: "Downloading report...",
            success: (data: any) => `${data.name} downloaded successfully`,
            error: "Download failed. Please try again."
          })
        }>
        Download Report
      </Button>
    </div>
  );
}

export function CustomDurationExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => toast("Quick message", { duration: 1000 })}>1 Second</Button>
      <Button onClick={() => toast("Normal message", { duration: 4000 })}>4 Seconds</Button>
      <Button onClick={() => toast("Persistent message", { duration: Infinity })}>
        Infinite Duration
      </Button>
    </div>
  );
}

export function LoadingToastExample() {
  const handleProcess = () => {
    const toastId = toast.loading("Processing your request...");

    setTimeout(() => {
      toast.success("Process completed!", { id: toastId });
    }, 3000);
  };

  return (
    <div className="flex gap-2">
      <Button onClick={handleProcess}>Start Process</Button>
    </div>
  );
}

export function DismissToastExample() {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => {
          const id = toast("This toast can be dismissed manually", {
            duration: Infinity
          });
          setTimeout(() => toast.dismiss(id), 3000);
        }}>
        Auto Dismiss After 3s
      </Button>
      <Button onClick={() => toast.dismiss()}>Dismiss All</Button>
    </div>
  );
}

export function CustomStyledToastExample() {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() =>
          toast("Custom styled toast", {
            className: "border-2 border-blue-500",
            style: {
              background: "var(--color-surface-secondary)"
            }
          })
        }>
        Custom Style
      </Button>
    </div>
  );
}

export function RichContentToastExample() {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() =>
          toast(
            <div>
              <strong className="block text-sm font-semibold">New Feature Available</strong>
              <p className="text-sm mt-1">
                Check out our new dashboard analytics with real-time data visualization.
              </p>
            </div>,
            {
              duration: 5000
            }
          )
        }>
        Rich Content
      </Button>
    </div>
  );
}

export function PositionExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => toast("Top Left", { position: "top-left" })}>Top Left</Button>
      <Button onClick={() => toast("Top Center", { position: "top-center" })}>Top Center</Button>
      <Button onClick={() => toast("Top Right", { position: "top-right" })}>Top Right</Button>
      <Button onClick={() => toast("Bottom Left", { position: "bottom-left" })}>Bottom Left</Button>
      <Button onClick={() => toast("Bottom Center", { position: "bottom-center" })}>
        Bottom Center
      </Button>
      <Button onClick={() => toast("Bottom Right", { position: "bottom-right" })}>
        Bottom Right
      </Button>
    </div>
  );
}
