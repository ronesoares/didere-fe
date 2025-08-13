import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  useTheme,
  useMediaQuery,
  Chip,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Card, Button, TextField } from '../components/ui';
import propertiesService from '../services/api/properties';
import toast from 'react-hot-toast';

const HeroSection = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  minHeight: '70vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark' 
      ? 'rgba(15, 23, 42, 0.3)'
      : 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
}));

const SearchCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? 'rgba(30, 41, 59, 0.9)' 
    : 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[8],
}));

const PropertyCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[12],
  },
}));

const PropertyImage = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 200,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
  position: 'relative',
  display: 'flex',
  alignItems: 'flex-end',
  padding: theme.spacing(2),
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(45deg, #374151, #4b5563)'
    : 'linear-gradient(45deg, #e5e7eb, #f3f4f6)',
}));

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    titleContains: '',
    idCity: '',
    idState: '',
  });

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      setLoading(true);
      const data = await propertiesService.searchPublic({ onlyActive: 'Y' });
      setProperties(data.slice(0, 6)); // Mostrar apenas 6 propriedades em destaque
    } catch (error) {
      toast.error('Erro ao carregar propriedades em destaque');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await propertiesService.searchPublic({
        ...searchFilters,
        onlyActive: 'Y'
      });
      setProperties(data);
    } catch (error) {
      toast.error('Erro ao buscar propriedades');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                }}
              >
                Encontre o Espaço
                <Box component="span" sx={{ color: theme.palette.secondary.main }}>
                  {' '}Perfeito
                </Box>
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 4,
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                Descubra espaços únicos para seus eventos, reuniões e projetos especiais
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <SearchCard>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Buscar Propriedades
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        placeholder="O que você está procurando?"
                        value={searchFilters.titleContains}
                        onChange={(e) => setSearchFilters(prev => ({
                          ...prev,
                          titleContains: e.target.value
                        }))}
                        startIcon={<SearchIcon />}
                        variant="glass"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        placeholder="Cidade"
                        value={searchFilters.idCity}
                        onChange={(e) => setSearchFilters(prev => ({
                          ...prev,
                          idCity: e.target.value
                        }))}
                        startIcon={<LocationIcon />}
                        variant="glass"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        placeholder="Estado"
                        value={searchFilters.idState}
                        onChange={(e) => setSearchFilters(prev => ({
                          ...prev,
                          idState: e.target.value
                        }))}
                        startIcon={<LocationIcon />}
                        variant="glass"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Button
                        variant="gradient"
                        size="large"
                        fullWidth
                        onClick={handleSearch}
                        loading={loading}
                      >
                        Buscar Propriedades
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </SearchCard>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Properties Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #60a5fa, #a78bfa)'
                : 'linear-gradient(135deg, #2563eb, #7c3aed)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Propriedades em Destaque
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Explore nossa seleção cuidadosamente curada de espaços excepcionais
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {properties.map((property, index) => (
            <Grid item xs={12} sm={6} md={4} key={property.id || index}>
              <PropertyCard hover>
                <PropertyImage>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      display: 'flex',
                      gap: 1,
                    }}
                  >
                    <Chip
                      icon={<StarIcon />}
                      label="Destaque"
                      size="small"
                      color="secondary"
                      sx={{ backdropFilter: 'blur(10px)' }}
                    />
                  </Box>
                </PropertyImage>
                
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {property.title || 'Propriedade Exclusiva'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {property.neighborhood}, {property.city} - {property.state}
                    </Typography>
                  </Box>
                  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {property.description || 'Espaço moderno e versátil, perfeito para diversos tipos de eventos e atividades.'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                      {property.value ? `R$ ${property.value}/${property.periodicity}` : 'Consulte'}
                    </Typography>
                    
                    <Button variant="outlined" size="small">
                      Ver Detalhes
                    </Button>
                  </Box>
                </Box>
              </PropertyCard>
            </Grid>
          ))}
        </Grid>

        {properties.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <HomeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Nenhuma propriedade encontrada
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tente ajustar os filtros de busca
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

