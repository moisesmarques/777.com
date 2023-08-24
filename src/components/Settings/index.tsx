import { Drawer,
        List,
        ListItem,
        ListItemButton,
        ListItemIcon,
        ListItemText,
        Box } from "@mui/material";
import { useContext } from "react";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { UserContext } from "../../App";
import React from "react";

type SettingsProps = {
    showSettings: boolean;
}

const Settings = ({ showSettings }: SettingsProps) => {
    
    const userState = useContext(UserContext);
    const closeHandler = () => {
        userState.set({showSettings: false} as any)
    }

    const handleLogout = (e: any) => {
        e.preventDefault();
        localStorage.removeItem('current_user');
        window.location.reload()
    }

   return  (    
    <Drawer
        anchor={'left'}
        open={showSettings}
        onClose={closeHandler}>
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={closeHandler}
            onKeyDown={closeHandler}
            >
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    </Drawer>
)}

export default Settings;