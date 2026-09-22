"use client";

import { Button, Dialog, Input, Label } from "@geckoui/geckoui";
import { useState } from "react";

export function BasicDialogExample() {
  const openDialog = () => {
    Dialog.show({
      content: ({ dismiss }) => (
        <div>
          <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
          <p className="text-gray-600 mb-6">This is a simple dialog with custom content.</p>
          <Button onClick={dismiss}>Close</Button>
        </div>
      )
    });
  };

  return <Button onClick={openDialog}>Open Dialog</Button>;
}

export function ImageLightboxExample() {
  const openImageViewer = () => {
    Dialog.show({
      content: ({ dismiss }) => (
        <div className="relative rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
            alt="Preview"
            className="max-w-4xl rounded-lg object-cover"
          />
          <button
            onClick={dismiss}
            className="absolute top-2 right-2 size-8 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-black/70">
            ✕
          </button>
        </div>
      ),
      className: "bg-transparent shadow-none",
      dismissOnEscape: true,
      dismissOnOutsideClick: true
    });
  };

  return <Button onClick={openImageViewer}>View Image</Button>;
}

export function FormDialogExample() {
  const showUserForm = () => {
    Dialog.show({
      content: ({ dismiss }) => (
        <div>
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" defaultValue="John Doe" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john@example.com" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={dismiss}>
                Cancel
              </Button>
              <Button onClick={dismiss}>Save Changes</Button>
            </div>
          </div>
        </div>
      ),
      className: "max-w-2xl",
      dismissOnEscape: false,
      dismissOnOutsideClick: false
    });
  };

  return <Button onClick={showUserForm}>Edit Profile</Button>;
}

export function NoEscapeDialogExample() {
  const openDialog = () => {
    Dialog.show({
      content: ({ dismiss }) => (
        <div>
          <h2 className="text-xl font-semibold mb-4">Important Notice</h2>
          <p className="text-gray-600 mb-6">
            This dialog can only be closed by clicking the button.
          </p>
          <Button onClick={dismiss}>I Understand</Button>
        </div>
      ),
      dismissOnEscape: false,
      dismissOnOutsideClick: false
    });
  };

  return <Button onClick={openDialog}>Open Non-Dismissible Dialog</Button>;
}

export function ControlledDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Controlled Dialog</h2>
        <p className="text-gray-600 mb-6">
          The parent component owns the open state, the same way it does for Drawer.
        </p>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Dialog>
    </>
  );
}
