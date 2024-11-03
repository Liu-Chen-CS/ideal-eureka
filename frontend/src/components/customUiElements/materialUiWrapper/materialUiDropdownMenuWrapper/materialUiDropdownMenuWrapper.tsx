import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";

interface MenuItemProps {
  label: string;
  onClick: () => void;
}

interface DropdownMenuProps {
  menuItems: MenuItemProps[];
  buttonImageSource: string;
  buttonImageAlt: string;
}

const MaterialUIDropdownMenuWrapper: React.FC<DropdownMenuProps> = ({
  menuItems,
  buttonImageSource,
  buttonImageAlt,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ width: "20px", marginLeft: "-20px" }}>
      <Button
        aria-controls={anchorEl ? "edit-dropdown-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <img src={buttonImageSource} alt={buttonImageAlt} />
      </Button>
      <Menu
        id="edit-dropdown-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              item.onClick();
              handleClose();
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default MaterialUIDropdownMenuWrapper;
