import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Paper,
  Button,
  TextField,
  Autocomplete,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale";

import imgBg from "../../assets/imgBg.png";
import "./home.css";
import arrow from "../../assets/arrow.png";
import imgBus from "../../assets/imgBus.png";

function HomeBanner() {
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDeparture, setSelectedDeparture] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");

  const handleSearch = () => {
    const date = selectedDate ? selectedDate.toISOString() : "";

    navigate(
      `/tickets?departure=${selectedDeparture.name}&destination=${selectedDestination.name}&date=${date}`
    );
  };
  useEffect(() => {
    axios
      .get("https://api.nosomovo.xyz/province/getalllist/193")
      .then((response) => {
        setProvinces(response.data);
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, []);

  return (
    <Box
      className="home-banner"
      sx={{
        paddingTop: "170px",
        paddingBottom: "90px",
        background: `url(${imgBg})  repeat-x bottom`,
      }}
    >
      <img className="home-bus" src={imgBus} alt="bus" />
      <Container>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography
              sx={{
                fontSize: "42px",
                fontWeight: "bold",
                color: "var(--text-color)",
              }}
            >
              Bạn đang cần cộng đồng chia sẽ chuyến đi ?
            </Typography>
            <Button
              onClick={() => {
                navigate("/forum");
              }}
              variant="contained"
              sx={{
                backgroundColor: "var(--primary-color)",
                "&:hover": {
                  backgroundColor: "var(--hover-color)",
                },
                marginTop: "24px",
                padding: "10px 28px",
              }}
            >
              Đến ngay
            </Button>
            <img
              src={arrow}
              alt="Arrow"
              style={{
                height: "55px",
                marginLeft: "6px",
                filter: "invert(1) sepia(1) saturate(5) hue-rotate(180deg)",
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <h2 style={{ color: "var(--text-color)" }}>Tìm vé ngay</h2>
            <Paper
              elevation={3}
              sx={{ padding: "48px 24px 32px", marginTop: 4 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6} md={6}>
                  <Autocomplete
                    id="province-start"
                    options={provinces}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) =>
                      setSelectedDeparture(newValue)
                    }
                    sx={{ width: "100%" }}
                    renderInput={(params) => (
                      <TextField {...params} label="Điểm đi" />
                    )}
                  />
                </Grid>
                <Grid item xs={6} md={6}>
                  <Autocomplete
                    id="province-end"
                    options={provinces}
                    onChange={(event, newValue) =>
                      setSelectedDestination(newValue)
                    }
                    getOptionLabel={(option) => option.name}
                    sx={{ width: "100%" }}
                    renderInput={(params) => (
                      <TextField {...params} label="Điểm đến" />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    locale={vi}
                  >
                    <DatePicker
                      sx={{ width: "100%" }}
                      label="Chọn ngày đi"
                      value={selectedDate}
                      onChange={(newValue) => setSelectedDate(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          inputFormat="dd/MM/yyyy"
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
              <Grid sx={{ textAlign: "center", marginTop: 2 }} item xs={12}>
                <Button
                  onClick={handleSearch}
                  variant="contained"
                  sx={{
                    backgroundColor: "var(--primary-color)",
                    "&:hover": {
                      backgroundColor: "var(--hover-color)",
                    },
                    padding: "8px 64px",
                  }}
                >
                  Tìm vé
                </Button>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
export default HomeBanner;
