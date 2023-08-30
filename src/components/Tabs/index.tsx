import { Box } from "@mui/material";
import React from "react";

export type TabPanelProps = {
    children?: React.ReactNode;
    index: number;
    value: number;
  }
  
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" 
            hidden={value !== index} 
            id={`simple-tabpanel-${index}`} 
            aria-labelledby={`simple-tab-${index}`}
            {...other}>
            {value === index && (
                <Box sx={{mt: 1}}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default TabPanel;