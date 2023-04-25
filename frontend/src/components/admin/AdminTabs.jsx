import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import UsersTable from "./UsersTable";
import AddLocation from "./AddLocation";
import { useMediaQuery } from "react-responsive";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"span"} variant={"body2"}>
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function getInitialState() {
  const currentAdminTab = localStorage.getItem("adminTab");
  if (currentAdminTab) {
    const adminTab = JSON.parse(currentAdminTab);

    return adminTab;
  }

  return 0;
}

export default function AdminTabs() {
  const [value, setValue] = React.useState(getInitialState);
  const isMobile = useMediaQuery({ query: "(max-width: 548px)" });

  const handleChange = (event, newValue) => {
    setValue(newValue);
    localStorage.setItem("adminTab", JSON.stringify(newValue));
  };

  return (
    <Box
      sx={{
        padding: "4% 5% 0% 5%",
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          {...a11yProps(0)}
          aria-label="secondary tabs example"
          TabIndicatorProps={{
            style: {
              backgroundColor: "#f45b69",
            },
          }}
          variant={isMobile ? "fullWidth" : "standard"}
        >
          <Tab
            value={0}
            label="Add Location"
            {...a11yProps(1)}
            sx={{
              "&.Mui-selected": {
                color: "#f45b69",
              },
            }}
          />
          <Tab
            value={1}
            label="Manage Users"
            sx={{
              "&.Mui-selected": {
                color: "#f45b69",
              },
            }}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <AddLocation />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <UsersTable />
      </TabPanel>
    </Box>
  );
}
