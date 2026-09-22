"use client";

import { Button, Drawer, Input, Label, Select, SelectOption } from "@geckoui/geckoui";
import { Menu } from "lucide-react";
import { useState } from "react";

export function BasicDrawerExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement="right"
        allowClickOutside
        className="w-80 p-6">
        <h2 className="text-xl font-semibold mb-4">Drawer Content</h2>
        <p className="text-gray-600 mb-4">
          This is a basic drawer that slides in from the right side.
        </p>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Drawer>
    </>
  );
}

export function MobileMenuExample() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setMenuOpen(true)} variant="outlined" size="sm">
        <Menu className="size-4" />
        Menu
      </Button>
      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        placement="left"
        allowClickOutside
        dismissOnEscape
        className="w-80">
        <nav className="p-6">
          <h2 className="text-lg font-semibold mb-4">Navigation</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="block py-2 px-3 rounded hover:bg-gray-100">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 rounded hover:bg-gray-100">
                Products
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 rounded hover:bg-gray-100">
                About
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 rounded hover:bg-gray-100">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </Drawer>
    </>
  );
}

export function FilterPanelExample() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [category, setCategory] = useState("");

  return (
    <>
      <Button onClick={() => setFiltersOpen(true)}>Show Filters</Button>
      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        placement="right"
        allowClickOutside
        backdropClassName="bg-black/60"
        className="w-96 p-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Price Range</Label>
              <div className="flex gap-2">
                <Input type="number" placeholder="Min" />
                <Input type="number" placeholder="Max" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Category</Label>
              <Select value={category} onChange={setCategory}>
                <SelectOption value="" label="All Categories" />
                <SelectOption value="electronics" label="Electronics" />
                <SelectOption value="clothing" label="Clothing" />
                <SelectOption value="books" label="Books" />
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="ghost" onClick={() => setFiltersOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setFiltersOpen(false)}>Apply Filters</Button>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export function NotificationDrawerExample() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <Button onClick={() => setShowNotifications(true)}>Notifications</Button>
      <Drawer
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
        placement="top"
        hideBackdrop={false}
        allowClickOutside
        className="h-96 border-b">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-3">
            <div className="p-3 border rounded-md">
              <p className="font-medium">New message received</p>
              <p className="text-sm text-gray-600">5 minutes ago</p>
            </div>
            <div className="p-3 border rounded-md">
              <p className="font-medium">Your order has shipped</p>
              <p className="text-sm text-gray-600">2 hours ago</p>
            </div>
            <div className="p-3 border rounded-md">
              <p className="font-medium">Password changed successfully</p>
              <p className="text-sm text-gray-600">1 day ago</p>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export function BottomSheetExample() {
  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setBottomSheetOpen(true)}>Show Actions</Button>
      <Drawer
        open={isBottomSheetOpen}
        onClose={() => setBottomSheetOpen(false)}
        placement="bottom"
        allowClickOutside
        backdropClassName="bg-black/40"
        className="h-64 rounded-t-2xl">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left py-3 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800">
              Share
            </button>
            <button className="w-full text-left py-3 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800">
              Edit
            </button>
            <button className="w-full text-left py-3 px-4 rounded-md hover:bg-gray-100 text-red-600 dark:hover:bg-neutral-800">
              Delete
            </button>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export function NoBackdropDrawerExample() {
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <>
      <Button onClick={() => setSettingsVisible(true)}>Settings</Button>
      <Drawer
        open={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        placement="right"
        hideBackdrop
        allowClickOutside={false}
        className="w-[600px] border-l">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="profile">Profile</Label>
              <Input id="profile" type="text" defaultValue="John Doe" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="settings-email">Email</Label>
              <Input id="settings-email" type="email" defaultValue="john@example.com" />
            </div>
            <Button onClick={() => setSettingsVisible(false)}>Save Settings</Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}
