"use client";

import { Button, Menu, MenuItem, MenuTrigger } from "@geckoui/geckoui";
import { ChevronDown, Copy, Edit, Share, Trash } from "lucide-react";

export function BasicMenuExample() {
  return (
    <Menu label="Options">
      <MenuItem label="Edit" onClick={() => console.log("Edit")} />
      <MenuItem label="Duplicate" onClick={() => console.log("Duplicate")} />
      <MenuItem label="Delete" onClick={() => console.log("Delete")} />
    </Menu>
  );
}

export function WithIconsExample() {
  return (
    <Menu>
      <MenuTrigger>
        {({ toggleMenu }) => (
          <Button onClick={toggleMenu}>
            Actions
            <ChevronDown className="size-4" />
          </Button>
        )}
      </MenuTrigger>
      <MenuItem label="Edit" onClick={() => console.log("Edit")}>
        <div className="flex items-center gap-3">
          <Edit className="size-4" />
          <span>Edit</span>
        </div>
      </MenuItem>
      <MenuItem label="Duplicate" onClick={() => console.log("Duplicate")}>
        <div className="flex items-center gap-3">
          <Copy className="size-4" />
          <span>Duplicate</span>
        </div>
      </MenuItem>
      <MenuItem label="Delete" onClick={() => console.log("Delete")}>
        <div className="flex items-center gap-3">
          <Trash className="size-4 text-red-600" />
          <span className="text-red-600">Delete</span>
        </div>
      </MenuItem>
    </Menu>
  );
}

export function WithSectionsExample() {
  return (
    <Menu>
      <MenuTrigger>
        {({ toggleMenu }) => <Button onClick={toggleMenu}>More Actions</Button>}
      </MenuTrigger>
      <MenuItem label="Share" onClick={() => console.log("Share")}>
        <div className="flex items-center gap-3">
          <Share className="size-4" />
          <span>Share</span>
        </div>
      </MenuItem>
      <MenuItem label="Edit" onClick={() => console.log("Edit")}>
        <div className="flex items-center gap-3">
          <Edit className="size-4" />
          <span>Edit</span>
        </div>
      </MenuItem>
      <MenuItem label="Delete" onClick={() => console.log("Delete")}>
        <div className="flex items-center gap-3">
          <Trash className="size-4 text-red-600" />
          <span className="text-red-600">Delete</span>
        </div>
      </MenuItem>
    </Menu>
  );
}

export function DisabledItemsExample() {
  return (
    <Menu label="Actions">
      <MenuItem label="Available Action" onClick={() => console.log("Available")} />
      <MenuItem label="Disabled Action" disabled />
      <MenuItem label="Another Action" onClick={() => console.log("Another")} />
    </Menu>
  );
}

export function CustomButtonExample() {
  return (
    <Menu>
      <MenuTrigger>
        {({ toggleMenu }) => (
          <Button variant="filled" onClick={toggleMenu}>
            User Menu
          </Button>
        )}
      </MenuTrigger>
      <MenuItem label="Profile" onClick={() => console.log("Profile")} />
      <MenuItem label="Settings" onClick={() => console.log("Settings")} />
      <MenuItem label="Logout" onClick={() => console.log("Logout")}>
        <span className="text-red-600">Logout</span>
      </MenuItem>
    </Menu>
  );
}

export function AnchorPositionExample() {
  return (
    <div className="flex gap-4">
      <Menu label="Top Start" placement="top-start">
        <MenuItem label="Option 1" />
        <MenuItem label="Option 2" />
        <MenuItem label="Option 3" />
      </Menu>

      <Menu label="Bottom End" placement="bottom-end">
        <MenuItem label="Option 1" />
        <MenuItem label="Option 2" />
        <MenuItem label="Option 3" />
      </Menu>
    </div>
  );
}
