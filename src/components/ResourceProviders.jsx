import {
  Close,
  Email,
  Language,
  LocationOn,
  Phone
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const ResourceProviders = () => {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    state: '',
    district: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Categories and states for filter dropdowns
  const categories = [
    'Agricultural Equipment',
    'Irrigation & Water Management',
    'Raw Materials',
  ];

  const states = [...new Set(providers.map(p => p.state))].filter(Boolean);

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    filterProviders();
  }, [providers, filters]);

  const fetchProviders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/resource-providers`);
      setProviders(response.data.providers);
      setFilteredProviders(response.data.providers);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch resource providers');
      setLoading(false);
    }
  };

  const filterProviders = () => {
    let filtered = [...providers];
    
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    if (filters.state) {
      filtered = filtered.filter(p => p.state === filters.state);
    }
    if (filters.district) {
      filtered = filtered.filter(p => p.district === filters.district);
    }
    
    setFilteredProviders(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProviderClick = (provider) => {
    setSelectedProvider(provider);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProvider(null);
  };

  const ProviderCard = ({ provider }) => (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          cursor: 'pointer',
        },
      }}
      onClick={() => handleProviderClick(provider)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={provider.logo_url}
            alt={provider.name}
            sx={{ width: 60, height: 60, mr: 2 }}
          />
          <Typography variant="h6" component="div">
            {provider.name}
          </Typography>
        </Box>
        
        <Chip 
          label={provider.category}
          size="small"
          sx={{ mb: 1, mr: 1 }}
        />
        <Chip 
          label={provider.subcategory}
          size="small"
          variant="outlined"
          sx={{ mb: 1 }}
        />
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {provider.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {provider.district}, {provider.state}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          {JSON.parse(provider.services || '[]').map((service, index) => (
            <Chip
              key={index}
              label={service}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  const ProviderDialog = () => (
    <Dialog 
      open={openDialog} 
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
    >
      {selectedProvider && (
        <>
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={selectedProvider.logo_url}
                  alt={selectedProvider.name}
                  sx={{ width: 40, height: 40, mr: 2 }}
                />
                <Typography variant="h6">{selectedProvider.name}</Typography>
              </Box>
              <IconButton onClick={handleCloseDialog}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>About</Typography>
                <Typography paragraph>{selectedProvider.description}</Typography>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Services</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {JSON.parse(selectedProvider.services || '[]').map((service, index) => (
                    <Chip key={index} label={service} />
                  ))}
                </Box>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Certifications</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {JSON.parse(selectedProvider.certifications || '[]').map((cert, index) => (
                    <Chip key={index} label={cert} variant="outlined" />
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>Contact Information</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {selectedProvider.address}<br />
                      {selectedProvider.district}, {selectedProvider.state}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{selectedProvider.contact_phone}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Email sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{selectedProvider.contact_email}</Typography>
                  </Box>
                  
                  <Button
                    variant="contained"
                    startIcon={<Language />}
                    href={selectedProvider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: 1 }}
                  >
                    Visit Website
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        </>
      )}
    </Dialog>
  );

  if (loading) {
    return (
      <Container>
        <Typography>Loading resource providers...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Resource Providers
      </Typography>
      
      {/* Filters */}
      <Card sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="Category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="State"
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
            >
              <MenuItem value="">All States</MenuItem>
              {states.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="District"
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
              disabled={!filters.state}
            >
              <MenuItem value="">All Districts</MenuItem>
              {filters.state && providers
                .filter(p => p.state === filters.state)
                .map(p => p.district)
                .filter((district, index, self) => self.indexOf(district) === index)
                .map((district) => (
                  <MenuItem key={district} value={district}>
                    {district}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
        </Grid>
      </Card>
      
      {/* Provider Grid */}
      <Grid container spacing={3}>
        {filteredProviders.map((provider) => (
          <Grid item xs={12} sm={6} md={4} key={provider.id}>
            <ProviderCard provider={provider} />
          </Grid>
        ))}
      </Grid>
      
      {/* Provider Dialog */}
      <ProviderDialog />
    </Container>
  );
};

export default ResourceProviders; 