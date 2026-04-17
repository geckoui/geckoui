"use client";

import { Button, Menu, MenuItem, MenuTrigger } from "@geckoui/geckoui";
import { ChevronDown, Copy, Edit, Share, Trash } from "lucide-react";

export function BasicMenuExample() {
  return (
    <Menu label="Options">
      <MenuItem onClick={() => console.log("Edit")}>Edit</MenuItem>
      <MenuItem onClick={() => console.log("Duplicate")}>Duplicate</MenuItem>
      <MenuItem onClick={() => console.log("Delete")}>Delete</MenuItem>
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
      <MenuItem onClick={() => console.log("Edit")}>
        <div className="flex items-center gap-3">
          <Edit className="size-4" />
          <span>Edit</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => console.log("Duplicate")}>
        <div className="flex items-center gap-3">
          <Copy className="size-4" />
          <span>Duplicate</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => console.log("Delete")}>
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
      <MenuItem onClick={() => console.log("Share")}>
        <div className="flex items-center gap-3">
          <Share className="size-4" />
          <span>Share</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => console.log("Edit")}>
        <div className="flex items-center gap-3">
          <Edit className="size-4" />
          <span>Edit</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => console.log("Delete")}>
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
      <MenuItem onClick={() => console.log("Available")}>Available Action</MenuItem>
      <MenuItem disabled>Disabled Action</MenuItem>
      <MenuItem onClick={() => console.log("Another")}>Another Action</MenuItem>
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
      <MenuItem onClick={() => console.log("Profile")}>Profile</MenuItem>
      <MenuItem onClick={() => console.log("Settings")}>Settings</MenuItem>
      <MenuItem onClick={() => console.log("Logout")}>
        <span className="text-red-600">Logout</span>
      </MenuItem>
    </Menu>
  );
}

export function AnchorPositionExample() {
  return (
    <div className="flex gap-4">
      <Menu label="Top Start" placement="top-start">
        <MenuItem>Option 1</MenuItem>
        <MenuItem>Option 2</MenuItem>
        <MenuItem>Option 3</MenuItem>
      </Menu>

      <Menu label="Bottom End" placement="bottom-end">
        <MenuItem>Option 1</MenuItem>
        <MenuItem>Option 2</MenuItem>
        <MenuItem>Option 3</MenuItem>
      </Menu>
    </div>
  );
}
