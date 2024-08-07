import { useEffect, useState, type FC, type ReactNode } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { SideNavItem } from "./side-nav-item";
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Popover,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import { useWorkSpace } from "src/hooks/use-workSpace";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Edit, DeleteOutline } from "@mui/icons-material";
import { ConfirmationModal } from "src/components";

interface Item {
  disabled?: boolean;
  external?: boolean;
  icon?: ReactNode;
  items?: Item[];
  label?: ReactNode;
  path?: string;
  title: string;
  slug?: string;
}

interface SideNavSectionProps {
  items?: Item[];
  pathname?: string | null;
  subheader?: string;
}

export const SideNavSection: FC<SideNavSectionProps> = (props) => {
  const { items = [], pathname, subheader = "", ...other } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Item | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const workSpace = useWorkSpace();

  const handleOptionsClick = (
    event: React.MouseEvent<HTMLElement>,
    workspace: Item
  ) => {
    setSelectedWorkspace(workspace);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
    handleClose();
  };

  const handleConfirmDelete = () => {
    if (selectedWorkspace?.slug) {
      // workSpace.deleteWorkspace(selectedWorkspace.slug);
    }
    setDeleteModalOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const renderItems = (items: Item[], depth: number = 0): JSX.Element[] => {
    return items.reduce((acc: JSX.Element[], item) => {
      const checkPath = !!(item.path && pathname);
      const partialMatch = checkPath
        ? item.path === "/"
          ? pathname === "/"
          : pathname.includes(item.path!)
        : false;

      if (item.title === "Workspaces" && item.items) {
        acc.push(
          <SideNavItem
            active={partialMatch}
            depth={depth}
            disabled={item.disabled}
            icon={item.icon}
            key={item.title}
            label={item.label}
            open={partialMatch}
            title={item.title}
          >
            <Stack
              component="ul"
              spacing={0.5}
              sx={{
                listStyle: "none",
                m: 0,
                p: 0,
              }}
            >
              <div style={{ marginLeft: "0px", width: "100%" }}>
                <Button
                  size="small"
                  variant="outlined"
                  color="info"
                  sx={{ mb: 0.5 }}
                  fullWidth
                  onClick={() => {
                    workSpace.handleOpen();
                  }}
                >
                  Add New Workspace
                  <Add sx={{ ml: 1 }} fontSize="small" />
                </Button>
              </div>

              {item.items.map((subItem, index) => {
                const subItemMatch = subItem.path === pathname;
                return (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <SideNavItem
                      active={subItemMatch}
                      depth={depth + 1}
                      disabled={subItem.disabled}
                      icon={subItem.icon}
                      label={subItem.label}
                      path={subItem.path}
                      title={subItem.title}
                    />
                    <IconButton
                      aria-describedby={id}
                      size="small"
                      onClick={(event) => handleOptionsClick(event, subItem)}
                    >
                      <MoreHorizIcon />
                    </IconButton>
                  </Box>
                );
              })}
            </Stack>
          </SideNavItem>
        );
      } else if (item.items) {
        acc.push(
          <SideNavItem
            active={partialMatch}
            depth={depth}
            disabled={item.disabled}
            icon={item.icon}
            key={item.title}
            label={item.label}
            open={partialMatch}
            title={item.title}
          >
            <Stack
              component="ul"
              spacing={0.5}
              sx={{
                listStyle: "none",
                m: 0,
                p: 0,
              }}
            >
              {renderItems(item.items, depth + 1)}
            </Stack>
          </SideNavItem>
        );
      } else {
        acc.push(
          <SideNavItem
            active={partialMatch}
            depth={depth}
            disabled={item.disabled}
            external={item.external}
            icon={item.icon}
            key={item.title}
            label={item.label}
            path={item.path}
            title={item.title}
          />
        );
      }

      return acc;
    }, []);
  };

  return (
    <Stack
      component="ul"
      spacing={0.5}
      sx={{
        listStyle: "none",
        m: 0,
        p: 0,
      }}
      {...other}
    >
      {subheader && (
        <Box
          component="li"
          sx={{
            color: "var(--nav-section-title-color)",
            fontSize: 12,
            fontWeight: 700,
            lineHeight: 1.66,
            mb: 1,
            ml: 1,
            textTransform: "uppercase",
          }}
        >
          {subheader}
        </Box>
      )}
      {renderItems(items)}

      <Popover
        id={id}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <MenuItem
          onClick={() => {
            workSpace.handleOpen(selectedWorkspace?.slug);
            handleClose();
          }}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <DeleteOutline fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Popover>

      <ConfirmationModal
        modal={deleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        content={{
          type: "Delete Workspace",
          text: `Are you sure you want to delete ${selectedWorkspace?.title} workspace? `,
        }}
      />
    </Stack>
  );
};

SideNavSection.propTypes = {
  items: PropTypes.array,
  pathname: PropTypes.string,
  subheader: PropTypes.string,
};
