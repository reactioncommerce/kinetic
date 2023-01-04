import { MouseEvent, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

type MenuActionsProps = {
  options: {
    label: string
    onClick: () => void
    disabled?: boolean
  }[]
  renderTriggerButton?: (onClick: (event: MouseEvent<HTMLElement>) => void) => JSX.Element
}

export const MenuActions = ({ options, renderTriggerButton }: MenuActionsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (event: MouseEvent<HTMLElement>, optionOnClick: () => void) => {
    event.stopPropagation();
    setAnchorEl(null);
    optionOnClick();
  };

  return (
    <div>
      {renderTriggerButton ? renderTriggerButton(handleClick) :
        <Button
          aria-label="more"
          id="more-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          variant="outlined"
          color="secondary"
          sx={{ color: "grey.500", minWidth: "32px", height: "32px", width: "32px" }}
          size="small"
        >
          <MoreHorizIcon />
        </Button>
      }

      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "more-button"
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: "auto"
          },
          sx: {
            mt: 1
          }
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.label}
            onClick={(event) => handleMenuItemClick(event, option.onClick)}
            sx={{ fontSize: "0.9rem" }}
            disabled={option.disabled}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
