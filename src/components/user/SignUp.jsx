import React, { useState } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Container,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // DatePicker
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"; // Use the appropriate adapter
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";
import logo from "../../assets/logo.png";
import Loadding from "../Loadding";
function SignUp() {
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [birthDay, setBirthDay] = useState(null); // Ngày sinh
  const [sex, setSex] = useState(""); // Giới tính

  const [phoneError, setPhoneError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^0[0-9]{9,14}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*])[A-Za-z\d@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let valid = true;

    if (!agreeTerms) {
      enqueueSnackbar("Bạn cần đồng ý với chính sách.", { variant: "error" });
      valid = false;
    }

    if (!validatePhone(phone)) {
      setPhoneError(true);
      enqueueSnackbar("Số điện thoại không hợp lệ.", { variant: "error" });
      valid = false;
    } else {
      setPhoneError(false);
    }

    if (!validatePassword(password)) {
      setPasswordError(true);
      enqueueSnackbar(
        "Mật khẩu phải có ít nhất một ký tự in hoa và thường một ký tự đặc biệt và dài ít nhất 8 ký tự.",
        { variant: "error" }
      );
      valid = false;
    } else {
      setPasswordError(false);
    }

    if (!valid) {
      return;
    }
    setLoading(true);

    try {
      const formattedBirthDay = dayjs(birthDay).format("YYYY-MM-DD");

      const { data: usersResponse } = await axios.get(
        "http://localhost:8080/api/users/all"
      );
      const phoneExists = usersResponse.some((user) => user.phone === phone);

      if (phoneExists) {
        enqueueSnackbar("Số điện thoại đã được đăng ký.", { variant: "error" });
        setLoading(false);
        return;
      }

      console.log(formattedBirthDay, sex);
      const response = await axios.post("http://localhost:8080/api/users", {
        firstName,
        lastName,
        phone,
        password,
        birthDay: formattedBirthDay, // Gửi ngày sinh
        sex, // Gửi giới tính
      });

      enqueueSnackbar("Đăng ký thành công!", { variant: "success" });

      setTimeout(() => {
        setLoading(false);
        navigate("/login");
      }, 1000);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Đăng ký thất bại. Vui lòng thử lại.", {
        variant: "error",
      });
    }
  };

  return (
    <Box sx={{ backgroundColor: "#EEF2F6", minHeight: "100vh" }}>
      <Container>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Grid item xs={12} sm={9} md={6} lg={5}>
            <Paper sx={{ padding: "24px" }} elevation={0}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img width="150px" src={logo} alt="logo" />
                <Typography
                  sx={{
                    fontSize: "22px",
                    fontWeight: "600",
                    textAlign: "center",
                    margin: "10px 0",
                    color: "var(--primary-color)",
                  }}
                  variant="h5"
                >
                  Đăng kí{" "}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "16px",
                    textAlign: "center",
                    color: "var(--grey)",
                    marginBottom: 4,
                  }}
                  variant="p"
                >
                  Đăng kí để tiếp tục
                </Typography>
              </Box>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Họ"
                      variant="outlined"
                      value={firstName}
                      required
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Tên"
                      variant="outlined"
                      value={lastName}
                      required
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      variant="outlined"
                      value={phone}
                      required
                      onChange={(e) => setPhone(e.target.value)}
                      helperText={
                        phoneError &&
                        "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0."
                      }
                      error={phoneError}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Mật khẩu"
                      variant="outlined"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      helperText={
                        passwordError &&
                        "Mật khẩu phải có ít nhất một ký tự in hoa và thường một ký tự đặc biệt và dài ít nhất 8 ký tự."
                      }
                      error={passwordError}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      {" "}
                      {/* Wrap here */}
                      <DatePicker
                        label="Ngày sinh"
                        maxDate={new Date()}
                        value={birthDay}
                        onChange={(newValue) => setBirthDay(newValue)}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth required />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Giới tính</InputLabel>
                      <Select
                        value={sex}
                        onChange={(e) => setSex(e.target.value)}
                      >
                        <MenuItem value="Nam">Nam</MenuItem>
                        <MenuItem value="Nữ">Nữ</MenuItem>
                        <MenuItem value="Khác">Khác</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 1,
                  }}
                >
                  <FormControlLabel
                    sx={{ fontSize: "14px" }}
                    control={
                      <Checkbox
                        color="default"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                    }
                    label="Bạn đồng ý với chính sách"
                  />
                </Box>
                <Button
                  sx={{
                    width: "100%",
                    background: "var(--primary-color)",
                    "&:hover": {
                      backgroundColor: "var(--hover-color)",
                    },
                    marginTop: 2,
                  }}
                  type="submit"
                  variant="contained"
                >
                  Đăng Kí
                </Button>

                <Box>
                  <Link
                    to={"/login"}
                    style={{
                      display: "block",
                      fontSize: "14px",
                      textAlign: "center",
                      color: "var(--text-color)",
                      textDecoration: "none",
                      marginTop: "24px",
                      paddingTop: "24px",
                      borderTop: "2px solid var(--light-grey)",
                    }}
                  >
                    Bạn đã có tài khoản?{" "}
                  </Link>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>{" "}
      </Container>
      {loading && <Loadding />}
    </Box>
  );
}

export default SignUp;
