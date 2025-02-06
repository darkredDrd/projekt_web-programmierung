import React from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRole } from '../../../services/RoleContext';

const OptionsMenu = () => {
  const { setRole } = useRole();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <SettingsIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleRoleChange('Basic Account-Manager')}>Account-Manager</MenuItem>
        <MenuItem onClick={() => handleRoleChange('Basic Developer')}>Developer</MenuItem>
        <MenuItem onClick={() => handleRoleChange('Basic User')}>User</MenuItem>
      </Menu>
    </>
  );
};

export default OptionsMenu;