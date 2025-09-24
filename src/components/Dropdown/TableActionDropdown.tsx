import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import clsx from "clsx";
import { ThreeDotsIcon } from "../Icon/ThreeDots";
import { ReactNode } from "react";

type TableActionDropdownProps = {
  menuItems: React.JSX.Element;
};

const TableActionDropdown = ({ menuItems }: TableActionDropdownProps) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900">
          <ThreeDotsIcon />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 ml-8 z-10 -mt-8  origin-top-right min-w-36 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition ">
        <div className="py-1">{menuItems}</div>
      </MenuItems>
    </Menu>
  );
};

export default TableActionDropdown;
