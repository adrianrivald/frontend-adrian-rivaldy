import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Stack,
  TextField,
  Autocomplete,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { formatRupiah } from './utils/format-rupiah';

export default function SimpleForm() {
  const [country, setCountry] = useState(null);
  const [port, setPort] = useState(null);
  const [item, setItem] = useState(null);
  const [discount, setDiscount] = useState('');
  const [price, setPrice] = useState('');
  const [total, setTotal] = useState('');
  const [description, setDescription] = useState('');

  const [countries, setCountries] = useState([]);
  const [ports, setPorts] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      await fetch('http://202.157.176.100:3001/negaras', {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json().then(data => {
        setCountries(data)
      }));
     
    }
    fetchCountries();
  },[]);

  const fetchPorts = async (countryId) => {
    await fetch(`http://202.157.176.100:3001/pelabuhans?filter={"where" : {"id_negara":${countryId}}}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json().then(data => {
        setPorts(data)
      }));
  }
  
  const fetchItems = async (portId) => {
    await fetch(`http://202.157.176.100:3001/barangs?filter={"where" : {"id_pelabuhan":${portId}}}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json().then(data => {
        setItems(data)
      }));
  }

  const handleItemChange = (event, value) => {
    setItem(value);
    if (value) {
      setDiscount(value.diskon);
      setPrice(value.harga);
      const totalValue = (1 - value.diskon / 100) * value.harga;
      setTotal(formatRupiah(totalValue));
      setDescription(value.description)
    } else {
      setDiscount('');
      setPrice('');
      setTotal('');
    }
  };

  const handleChangeCountry = (val) => {
    setCountry(val);
    fetchPorts(val.id_negara);
    setPort(null);
    setItem(null);
    setDescription('');
    setDiscount('');
    setPrice('');
    setTotal('');
  }
  
  const handleChangePort = (val) => {
    setPort(val);
    fetchItems(val.id_negara);
    setItem(null);
    setDescription('');
    setDiscount('');
    setPrice('');
    setTotal('');
  }

  const handleChangePrice = (val) => {
    setPrice(val);
    // Update price on price change
    const totalValue = (1 - discount / 100) * val;
    setTotal(formatRupiah(totalValue)); 
  }

  const handleChangeDiscount = (val) => {
    setDiscount(val);
    // Update price on discount change
    const totalValue = (1 - val / 100) * price;
    setTotal(formatRupiah(totalValue)); 
  }

  const onReset = () => {
    setCountry(null)
    setPort(null)
    setItem(null);
    setDescription('');
    setDiscount('');
    setPrice('');
    setTotal('');
    window.scrollTo(0,0);
  }

  return (
    <>
      {/* Top Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Frontend Test - Adrian Rivaldy
          </Typography>
          <IconButton edge="end" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Form Body */}
      <Box p={4} maxWidth={500} mx="auto">
        <Stack spacing={3}>
          {/* Negara */}
          <Box>
            <Typography mb={1}>Negara :</Typography>
            <Autocomplete
              options={countries}
              getOptionLabel={(option) =>
                `${option.kode_negara} - ${option.nama_negara}`
              }
              value={country}
              onChange={(e, val) => handleChangeCountry(val)}
              renderInput={(params) => <TextField {...params} label="Negara" fullWidth />}
            />
          </Box>

          {/* Pelabuhan */}
          <Box>
            <Typography mb={1}>Pelabuhan :</Typography>
            <Autocomplete
              options={ports}
              getOptionLabel={(option) =>
                `${option.id_pelabuhan} - ${option.nama_pelabuhan}`
              }
              value={port}
              onChange={(e, val) => handleChangePort(val)}
              disabled={country === null}
              renderInput={(params) => <TextField {...params} label="Pelabuhan" fullWidth />}
            />
          </Box>

          {/* Barang */}
          <Box>
            <Typography mb={1}>Barang :</Typography>
            <Autocomplete
              options={items}
              getOptionLabel={(option) => `${option.id_barang} - ${option.nama_barang}`}
              value={item}
              onChange={handleItemChange}
              disabled={port === null}
              renderInput={(params) => <TextField {...params} label="Barang" fullWidth />}
            />
          </Box>

          {/* Deskripsi */}
          <Box>
            <TextField
              label="Deskripsi"
              multiline
              rows={4}
              value={item ? description : ''}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              sx={{ mt: 2 }}
            />
          </Box>

          {/* Diskon */}
          <Box>
            <Typography mb={1}>Diskon :</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                value={discount}
                disabled={item === null}
                onChange={(e) => handleChangeDiscount(e.target.value)}
                sx={{ width: 100 }}
                InputProps={{ endAdornment: <Typography>%</Typography> }}
              />
            </Stack>
          </Box>

          {/* Harga */}
          <Box>
            <Typography mb={1}>Harga :</Typography>
            <TextField
              value={price}
              disabled={item === null}
              onChange={(e) => handleChangePrice(e.target.value)}
              fullWidth
            />
          </Box>

          {/* Total */}
          <Box>
            <Typography mb={1}>Total :</Typography>
            <TextField value={total} disabled fullWidth />
          </Box>

          <Box>
            <Button onClick={onReset} variant='contained' fullWidth sx={{py: 2, borderRadius: 4}}>Reset</Button>
          </Box>
        </Stack>
      </Box>
    </>
  );
}
