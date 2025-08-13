import {
  Box, Grid, Button, Card, Chip, Dialog, DialogActions,
  DialogContent, DialogTitle, MenuItem, Select, TextField, Divider, Input,
  FormControl, InputLabel, Checkbox, ListItemText
} from '@mui/material';
import { Search as SearchIcon } from '../../../icons/search';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import featureService from '../../../services/registrations/feature-service';
import typeActivityService from '../../../services/registrations/type-activity-service';
import authorizationService from '../../../services/auth/authorization-service';

export const PropertyBrowseFilter = (props) => {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typeActivitiesOptions, setTypeActivitiesOptions] = useState([]);
  const [typeActivities, setTypeActivities] = useState([]);
  const [featuresOptions, setFeaturesOptions] = useState([]);
  const [features, setFeatures] = useState([]);
  const { property, onFilter, ...other } = props;
  const [price, setPrice] = useState(null);
  const [openPriceDialog, setOpenPriceDialog] = useState(false);
  const [periodicity, setPeriodicity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minPriceError, setMinPriceError] = useState(false)

  const [sizeDialogOpen, setSizeDialogOpen] = useState(false);
  const [sizeFilter, setSizeFilter] = useState(null);
  const [height, setHeight] = useState('');
  const [widthState, setWidthState] = useState('');
  const [depth, setDepth] = useState('');

  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [location, setLocation] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');


  const periodicityOptions = {
    'M': 'Mensal',
    'D': 'Diária', 
    'S': 'Semanal',
    'H': 'Hora'
  };

  const checkPriceFilterValues = () => {
    if (!periodicity || !minPrice || !maxPrice) {
      return false;
    }
    if (Number(minPrice) > Number(maxPrice)) {
      return false;
    }
    return true;
  };

  const handleAddPriceFilter = () => {
    if (!periodicity || !minPrice || !maxPrice) {
      return;
    }
    
    if (Number(minPrice) > Number(maxPrice)) {
      setMinPriceError(true);
      return;
    }

    setMinPriceError(false);
    setPrice({ periodicity, minPrice, maxPrice });
    setPeriodicity('');
    setMinPrice('');
    setMaxPrice('');
    setOpenPriceDialog(false);
  };

  const handleAddSizeFilter = () => {
    if (height && widthState && depth) {
      setSizeFilter({ height, width: widthState, depth });
      setHeight('');
      setWidthState('');
      setDepth('');
      setSizeDialogOpen(false);
    }
  };

  const handleAddLocationFilter = () => {
    if (selectedState && selectedCity) {
      const selectedStateObj = states.find(s => s.id === selectedState);
      const selectedCityObj = cities.find(c => c.id === selectedCity);
      
      setLocation({
        state: selectedStateObj?.name,
        city: selectedCityObj?.name,
        stateId: selectedState,
        cityId: selectedCity
      });

      setSelectedState('');
      setSelectedCity('');
      setLocationDialogOpen(false);
    }
  };

  const handleDeletePriceFilter = () => {
    setPrice(null);
  };

  const handleDeleteSizeFilter = () => {
    setSizeFilter(null);
  };

  const handleDeleteLocationFilter = () => {
    setLocation(null);
  };

  const getTypeActivities = (async () => {
    try {
      const options = await typeActivityService.getAll();
      setTypeActivitiesOptions(options);
      
      if (property?.typeActivities) {
        setTypeActivities(property.typeActivities.map(item => item.typeActivity.id));
      }
    } catch (err) {
      console.error(err);
    }
  });

  const getStates = (async () => {
    try {
      const statesData = authorizationService.getStatesAndCities();
      setStates(statesData);
    } catch (err) {
      console.error(err);
    }
  });

  const getCitiesByState = (stateId, allStates = states) => {
    const state = allStates.find((s) => s.id === stateId);
    setCities(state ? state.cities : []);
  };

  const getFeatures = (async () => {
      try {
        const options = await featureService.getAll();
        setFeaturesOptions(options);
        
        if (property?.features) {
          setFeatures(property.features.map(item => item.feature.id));
        }
      } catch (err) {
        console.error(err);
      }
    });

  useEffect(() => {
      getFeatures();
      getTypeActivities();
      getStates();
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  const handleTypeActivitiesChange = (event) => {
    const { target: { value } } = event;
    setTypeActivities(typeof value === 'string' ? value.split(',') : value);
  };

  const handleFeaturesChange = (event) => {
    const { target: { value } } = event;
    setFeatures(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSearch = () => {
    const finalFilters = {
      titleContains: keyword || "",
      heightGreaterThan: sizeFilter?.height ? Number(sizeFilter.height) : 0,
      heightLessThan: 0,
      widthGreaterThan: sizeFilter?.width ? Number(sizeFilter.width) : 0,
      widthLessThan: 0,
      depthGreaterThan: sizeFilter?.depth ? Number(sizeFilter.depth) : 0,
      depthLessThan: 0,
      periodicityList: price?.periodicity ? [price.periodicity] : [],
      valueGreaterThan: price?.minPrice ? Number(price.minPrice) : 0,
      valueLessThan: price?.maxPrice ? Number(price.maxPrice) : 0,
      idCity: location?.cityId ? Number(location.cityId) : null,
      idState: location?.stateId ? Number(location.stateId) : null,
      neighborhoodContains: "",
      startDate: null,
      endDate: null,
      startHour: null,
      endHour: null,
      onlyActive: 'S',
      featureList: features.length > 0 ? features.map(id => Number(id)) : null,
      typeActivityList: typeActivities.length > 0 ? typeActivities.map(id => Number(id)) : []
    };

    props.onFilter(finalFilters);
  };

  const renderActiveFilterChips = () => {
    const chips = [];

    typeActivities.forEach(activityId => {
      const activity = typeActivitiesOptions.find(opt => opt.id === activityId);
      if (activity) {
        chips.push(
          <Chip
            key={`typeActivity-${activity.id}`}
            label={`Atividade: ${activity.name}`}
            onDelete={() => setTypeActivities(prev => prev.filter(id => id !== activity.id))}
            sx={{ m: 0.5 }}
          />
        );
      }
    });
    
    features.forEach(featureId => {
      const feature = featuresOptions.find(opt => opt.id === featureId);
      if (feature) {
        chips.push(
          <Chip
            key={`feature-${feature.id}`}
            label={`Característica: ${feature.name}`}
            onDelete={() => setFeatures(prev => prev.filter(id => id !== feature.id))}
            sx={{ m: 0.5 }}
          />
        );
      }
    });

    if (price) {
      chips.push(
        <Chip
          key="price"
          label={`Preço: ${periodicityOptions[price.periodicity]}: ${price.minPrice} - ${price.maxPrice}`}
          onDelete={handleDeletePriceFilter}
          sx={{ m: 0.5 }}
        />
      );
    }

    if (location) {
      chips.push(
        <Chip
          key="location"
          label={`Local: ${location.city}, ${location.state}`}
          onDelete={handleDeleteLocationFilter}
          sx={{ m: 0.5 }}
        />
      );
    }

    if (sizeFilter) {
      chips.push(
        <Chip
          key="size"
          label={`Tamanho: A:${sizeFilter.height}, L:${sizeFilter.width}, P:${sizeFilter.depth} (m)`}
          onDelete={handleDeleteSizeFilter}
          sx={{ m: 0.5 }}
        />
      );
    }
    
    if (chips.length === 0) {
      return null;
    }

    return (
      <Box sx={{ p: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5, mt:1, mb:1 }}>
        {chips}
      </Box>
    );
  };


  return (
    <Card {...other}> {}
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          p: 2
        }}
      >
        <SearchIcon fontSize="small" />
        <Box
          sx={{
            flexGrow: 1,
            ml: 3
          }}
        >
          <Input
            disableUnderline
            fullWidth
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Pesquise por palavras-chave"
          />
        </Box>
      </Box>
      
      <Divider /> {}
      {renderActiveFilterChips()}
      <Divider /> {}

      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          p: 2,
          gap: 2
        }}
      >
        <Grid 
          container 
          spacing={2} 
          alignItems="center"
        >
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md
          >
            <FormControl 
              fullWidth 
              variant="outlined" 
              size="small"
            >
              <InputLabel id="type-activities-select-label">Atividades</InputLabel>
              <Select
                labelId="type-activities-select-label"
                multiple
                value={typeActivities}
                onChange={handleTypeActivitiesChange}
                label="Atividades"
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <em>Selecione</em>;
                  }
                  const selectedNames = selected.map(id => typeActivitiesOptions.find(opt => opt.id === id)?.name).filter(Boolean);
                  if (selectedNames.length > 1) {
                    return `${selectedNames.length} selecionadas`;
                  }
                  return selectedNames.join(', '); 
                }}
              >
                {typeActivitiesOptions.map((option) => (
                  <MenuItem 
                    key={option.id} 
                    value={option.id}
                  >
                    <Checkbox checked={typeActivities.indexOf(option.id) > -1} />
                    <ListItemText primary={option.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid 
            item 
            xs={12} 
            sm={6} 
            md
          >
            <FormControl 
              fullWidth 
              variant="outlined" 
              size="small"
            >
              <InputLabel id="features-select-label">Características</InputLabel>
              <Select
                labelId="features-select-label"
                multiple
                value={features}
                onChange={handleFeaturesChange}
                label="Características"
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <em>Selecione</em>;
                  }
                  const selectedNames = selected.map(id => featuresOptions.find(opt => opt.id === id)?.name).filter(Boolean);
                  if (selectedNames.length > 1) {
                    return `${selectedNames.length} selecionadas`;
                  }
                  return selectedNames.join(', ');
                }}
              >
                {featuresOptions.map((option) => (
                  <MenuItem 
                    key={option.id} 
                    value={option.id}
                  >
                    <Checkbox checked={features.indexOf(option.id) > -1} />
                    <ListItemText primary={option.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid 
            item 
            xs={12} 
            sm={4} 
            md="auto"
          >
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => setOpenPriceDialog(true)} 
              size="medium"
            >
              Preço
            </Button>
          </Grid>
          <Grid 
            item 
            xs={12} 
            sm={4} 
            md="auto"
          >
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => setLocationDialogOpen(true)} 
              size="medium"
            >
              Localização
            </Button>
          </Grid>
          <Grid 
            item 
            xs={12} 
            sm={4} 
            md="auto"
          >
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => setSizeDialogOpen(true)} 
              size="medium"
            >
              Tamanho
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}> {}
        <Button
            color="primary"
            variant="contained"
            onClick={handleSearch}
            disabled={isSubmitting}
          >
            {t('Search')}
        </Button>
      </Box>

      {}
      <Dialog 
        open={openPriceDialog} 
        onClose={() => setOpenPriceDialog(false)}
      >
        <DialogTitle>Filtrar por Preço</DialogTitle>
        <DialogContent>
          <Grid 
            container 
            spacing={2} 
            sx={{pt: 1}}
          > {}
            <Grid 
              item 
              xs={12} 
              sm={4}
            >
              <FormControl 
                fullWidth 
                variant="outlined"
              >
                <InputLabel id="periodicity-label">Periodicidade</InputLabel>
                <Select
                  labelId="periodicity-label"
                  value={periodicity}
                  onChange={(e) => setPeriodicity(e.target.value)}
                  label="Periodicidade"
                >
                  <MenuItem value=""><em>Nenhuma</em></MenuItem>
                  {Object.entries(periodicityOptions).map(([key, value]) => (
                    <MenuItem 
                      key={key} 
                      value={key}
                    >
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid 
              item 
              xs={12} 
              sm={4}
            >
              <TextField
                fullWidth
                type="number"
                label="Valor Mínimo"
                variant="outlined"
                value={minPrice}
                onChange={(e) => {
                  const newMinPrice = e.target.value;
                  setMinPrice(newMinPrice);

                  if (maxPrice !== '' && newMinPrice !== '' && Number(newMinPrice) > Number(maxPrice)) {
                    setMinPriceError(true);
                  } else {
                    setMinPriceError(false);
                  }
                }}
                error={minPriceError}
                helperText={minPriceError ? "Mínimo não pode ser maior que máximo" : ""}
              />
            </Grid>
            <Grid 
              item 
              xs={12} 
              sm={4}
            >
              <TextField
                fullWidth
                type="number"
                label="Valor Máximo"
                variant="outlined"
                value={maxPrice}
                onChange={(e) => {
                  const newMaxPrice = e.target.value;
                  setMaxPrice(newMaxPrice);
                  
                  if (minPrice !== '' && newMaxPrice !== '' && Number(minPrice) > Number(newMaxPrice)) {
                    setMinPriceError(true);
                  } else {
                    setMinPriceError(false);
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenPriceDialog(false);
            setMinPriceError(false);
          }}>Cancelar</Button>
          <Button 
            onClick={handleAddPriceFilter} 
            color="primary" 
            variant="contained" 
            disabled={!periodicity || !minPrice || !maxPrice || minPriceError}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={sizeDialogOpen} 
        onClose={() => setSizeDialogOpen(false)}
      >
        <DialogTitle>Filtrar por Tamanho (metros)</DialogTitle>
        <DialogContent>
          <Grid 
            container 
            spacing={2} 
            sx={{pt: 1}}
          >
            <Grid 
              item 
              xs={12} 
              sm={4}
            >
              <TextField
                fullWidth
                type="number"
                label="Altura (m)"
                variant="outlined"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                inputProps={{ min: "0" }}
              />
            </Grid>
            <Grid 
              item 
              xs={12} 
              sm={4}
            >
              <TextField
                fullWidth
                type="number"
                label="Largura (m)"
                variant="outlined"
                value={widthState}
                onChange={(e) => setWidthState(e.target.value)}
                inputProps={{ min: "0" }}
              />
            </Grid>
            <Grid 
              item 
              xs={12} 
              sm={4}
            >
              <TextField
                fullWidth
                type="number"
                label="Profundidade (m)"
                variant="outlined"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                inputProps={{ min: "0" }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSizeDialogOpen(false)}>Cancelar</Button>
          <Button 
            onClick={handleAddSizeFilter} 
            color="primary" 
            variant="contained" 
            disabled={!height || !widthState || !depth}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={locationDialogOpen}
        sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: '90%' } }}
        onClose={() => setLocationDialogOpen(false)}
      >
        <DialogTitle>Filtrar por Localização</DialogTitle>
        <DialogContent>
          <Grid 
            container 
            spacing={2} 
            sx={{pt: 1}}
          >
            <Grid 
              item 
              xs={12} 
              sm={6}
            >
              <TextField
                fullWidth
                select
                label="Estado"
                variant="outlined"
                value={selectedState}
                onChange={(e) => {
                  const stateId = e.target.value;
                  setSelectedState(stateId);
                  setSelectedCity('');
                  getCitiesByState(stateId);
                }}
              >
                <MenuItem value=""><em>Selecione um Estado</em></MenuItem>
                {states && states.map((state) => (
                  <MenuItem 
                    key={state.id} 
                    value={state.id}
                  >
                    {state.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid 
              item 
              xs={12} 
              sm={6}
            >
              <TextField
                fullWidth
                select
                label="Cidade"
                variant="outlined"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedState || !cities || cities.length === 0}
              >
                <MenuItem value=""><em>{selectedState && cities && cities.length > 0 ? "Selecione uma Cidade" : (selectedState ? "Nenhuma cidade encontrada" : "Selecione um Estado primeiro")}</em></MenuItem>
                {cities && cities.map((city) => (
                  <MenuItem 
                    key={city.id} 
                    value={city.id}
                  >
                    {city.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLocationDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleAddLocationFilter}
            color="primary"
            variant="contained"
            disabled={!selectedState || !selectedCity}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

    </Card>
  );
};