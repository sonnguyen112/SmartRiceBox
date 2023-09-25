import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import WaterIcon from '@mui/icons-material/Water';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import RiceBowlIcon from '@mui/icons-material/RiceBowl';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export default function ContentMarker(props) {

  const marker = props.marker
  const navigate = useNavigate()

  const handleDetailButton = () => {
    navigate("/detail", {
      state: { url_dashboard: marker.url_dashboard }
    })
  }

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Stack style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            marginRight: 10,
            flex: 1
          }}>
            <Typography>{marker.name}</Typography>
          </Stack>
          <Stack style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            flex: 1,
            flexDirection: "row"
          }}>
            <Chip icon={<RiceBowlIcon />} label={`${marker.rice_amount}%`} />
            <Chip icon={<ThermostatIcon />} label={`${marker.temperature}°C`} />
            <Chip icon={<WaterIcon />} label={`${marker.humidity}%`} />
          </Stack>
        </AccordionSummary>
        <AccordionDetails style={{
          display: "flex",
          flexDirection: "row"
        }}>
          <Stack style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginRight: 10,
            flex: 1
          }}>
            <Typography>
              {`${marker.house_num_street}, ${marker.ward}, ${marker.district}, ${marker.city}`}
            </Typography>
          </Stack>
          <Stack style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            flex: 1,
            flexDirection: "row",
          }}>
            <Button variant="contained" onClick={() => handleDetailButton()}>Xem chi tiết</Button>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}