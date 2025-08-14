import { useCallback, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  Typography,
  Grid,
  Chip,
  Divider
} from '@mui/material';
import NextLink from 'next/link';
import Head from 'next/head';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { withMainLayout } from '../../../hocs/with-main-layout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import PropertyService from '../../../services/api/properties';
import authorizationService from '../../../services/auth/authorization-service';
import { getFileAsBase64 } from '../../../services/files/file-service';
import { useRouter } from 'next/router';
import { useMounted } from '../../../hooks/use-mounted';
import { gtm } from '../../../lib/gtm';
import { ClaimFormModal } from '../../../components/search/property/claim-form-modal';
import DateBR from '../../../utils/date-br';

const PropertyDetails = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const { propertyId } = router.query;
  const [openInterestModal, setOpenInterestModal] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [property, setProperty] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
  };

  const getProperty = useCallback(async () => {
    try {
      const data = propertyId > 0 ? await PropertyService.getById(propertyId) : null;

      if (isMounted() && data) {
        setProperty(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [propertyId, isMounted]);

  useEffect(() => {
      gtm.push({ event: 'page_view' });
    }, []);

  useEffect(() => {
      getProperty();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [propertyId, getProperty]);

  useEffect(() => {
    const fetchImages = async () => {
      if (property && property.files && property.files.length > 0) {
        // Filtrar apenas imagens que não são thumbnails
        const imageFiles = property.files.filter(file => 
          file.name && 
          !file.name.toLowerCase().includes('thumbnail') &&
          (file.name.toLowerCase().includes('.jpg') || 
           file.name.toLowerCase().includes('.jpeg') || 
           file.name.toLowerCase().includes('.png') || 
           file.name.toLowerCase().includes('.webp'))
        );
        
        const urls = await Promise.all(
          imageFiles.map(async (file) => {
            try {
              const base64Image = await getFileAsBase64(file, 'didere');
              return base64Image;
            } catch (error) {
              console.error('Erro ao carregar imagem:', error);
              return null;
            }
          })
        );
        
        setImageUrls(urls.filter(url => url !== null));
      }
    };
    fetchImages();
  }, [property]);

  const handleCloseInterestModal = () => setOpenInterestModal(false);

  if (!property) {
    return null;
  }

  const sliderSettings = {
    dots: true,
    infinite: imageUrls.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    autoplay: imageUrls.length > 1,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: imageUrls.length > 1,
    dotsClass: "slick-dots slick-thumb",
    customPaging: function(i) {
      return (
        <div style={{
          width: '60px',
          height: '40px',
          backgroundImage: `url(${imageUrls[i]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '4px',
          border: '2px solid transparent',
          cursor: 'pointer'
        }} />
      );
    }
  };

  const states = authorizationService.getStatesAndCities();
  if (states && property.address && property.address.state && property.address.city) {
    const propertyState = states.find(s => s.id === property.address.state.id);
    
    if (propertyState) {
      property.address.state.name = propertyState.abbreviation;
      const city = propertyState.cities.find(c => c.id === property.address.city.id);
    
      if (city) {
        property.address.city.name = city.name;
      }
    }
  }

  const periodicityOptions = new Map([
    [ 'M', 'Mensal' ],
    [ 'D', 'Diária' ],
    [ 'S', 'Semanal' ],
    [ 'H', 'Hora' ]
  ]);

  const handleOpenInterestModal = () => {
    setOpenInterestModal(true);
  };

  const formatRentalPeriods = (rentalPeriods) => {
    const today = new DateBR().toUTC3();
    today.setHours(0, 0, 0, 0);
    
    return rentalPeriods
      .filter(period => {
            const endDate = new DateBR(period.endDate);
            console.log('today', today, 'endDate', endDate);
            return endDate >= today;
      })
      .map(period => {
        const startDate = new DateBR(period.startDate).toDateBR();
        const endDate = new DateBR(period.endDate).toDateBR();
        
        return `De ${startDate} até ${endDate} - entre ${period.startHour} e ${period.endHour}`;
    }).join('\n');
  };

  return (
    <>
      <Head>
        <title>
          Detalhes do Imóvel | Didere
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 0
        }}
      >
        <Container maxWidth="lg">
            <Card sx={{ mt: 4, width: '100%' }}>
            <CardContent sx={{ p: 4 }}>
                <NextLink
                    href="/search/property"
                    passHref
                >
                    <Link
                    color="textPrimary"
                    component="a"
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        mb: 3
                    }}
                    >
                    <ArrowBackIcon
                        fontSize="small"
                        sx={{ mr: 1 }}
                    />
                    <Typography variant="subtitle2">
                        {'Voltar para busca'}
                    </Typography>
                    </Link>
                </NextLink>

                <Grid container spacing={4}>
                  {/* Coluna da esquerda - Imagens */}
                  <Grid item xs={12} md={8}>
                    {/* Carrossel de imagens */}
                    {imageUrls && imageUrls.length > 0 ? (
                      <Box sx={{ mb: 3 }}>
                        <Slider {...sliderSettings}>
                          {imageUrls.map((url, index) => (
                            <div key={index}>
                              <Box
                                component="img"
                                src={url}
                                alt={`${property.title} - Imagem ${index + 1}`}
                                sx={{
                                  width: '100%',
                                  height: '400px',
                                  objectFit: 'cover',
                                  borderRadius: 2
                                }}
                              />
                            </div>
                          ))}
                        </Slider>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: '400px',
                          backgroundColor: 'grey.200',
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3
                        }}
                      >
                        <Typography variant="h6" color="textSecondary">
                          Nenhuma imagem disponível
                        </Typography>
                      </Box>
                    )}

                    {/* Descrição */}
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        Descrição do espaço
                      </Typography>
                      <Typography 
                        variant="body1"
                        sx={{ 
                          whiteSpace: 'pre-line',
                          lineHeight: 1.6
                        }}
                      >
                        {property.description}
                      </Typography>
                    </Box>

                    {/* Características */}
                    {property.features && Array.isArray(property.features) && property.features.length > 0 && (
                      <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" component="h2" gutterBottom>
                          Características
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {property.features
                            .sort((a, b) => a.feature.name.toLowerCase().localeCompare(b.feature.name.toLowerCase()))
                            .map((featureObj, index) => (
                              <Chip 
                                key={index}
                                label={featureObj.feature.name}
                                variant="outlined"
                                color="primary"
                                icon={<HomeWorkIcon />}
                              />
                            ))}
                        </Box>
                      </Box>
                    )}
                  </Grid>

                  {/* Coluna da direita - Informações */}
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined" sx={{ p: 3, position: 'sticky', top: 20 }}>
                      {/* Título e preço */}
                      <Typography variant="h5" component="h1" gutterBottom>
                        {property.title}
                      </Typography>
                      
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        {
                          property.typeActivities && Array.isArray(property.typeActivities) && property.typeActivities.length > 0
                            ? property.typeActivities
                                .map(activityObj => activityObj.typeActivity && activityObj.typeActivity.name)
                                .filter(name => !!name)
                                .join(', ')
                            : ''
                        } 
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      {/* Preço */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <AttachMoneyIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h4" component="p" color="primary" fontWeight="bold">
                          R$ {formatCurrency(property.value)}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ ml: 1 }}>
                          /{periodicityOptions.get(property.periodicity)}
                        </Typography>
                      </Box>

                      {/* Localização */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocationOnOutlinedIcon color="action" sx={{ mr: 1 }} />
                        <NextLink
                          href={property.urlMaps || `https://www.didere.com.br`}
                          passHref
                        >
                          <Link
                            color="inherit"
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Typography variant="body1">
                              {property.address.neighborhood}, {property.address.city.name} - {property.address.state.name}
                            </Typography>
                          </Link>
                        </NextLink>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Período disponível */}
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
                          <Typography variant="h6" component="h3">
                            Período disponível
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body2"
                          sx={{ 
                            whiteSpace: 'pre-line',
                            backgroundColor: 'grey.50',
                            p: 2,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'grey.200'
                          }}
                        >
                          {formatRentalPeriods(property.rentalPeriods)}
                        </Typography>
                      </Box>

                      {/* Botão de interesse */}
                      <Button
                        variant="contained"
                        color="warning"
                        size="large"
                        fullWidth
                        onClick={handleOpenInterestModal}
                        sx={{ 
                          py: 1.5,
                          fontSize: '1.1rem',
                          fontWeight: 'bold'
                        }}
                      >
                        Tenho interesse
                      </Button>

                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{ 
                          display: 'block', 
                          textAlign: 'center', 
                          mt: 1 
                        }}
                      >
                        Resposta em até 10 minutos
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
            </CardContent>

            {}
            <ClaimFormModal
              open={openInterestModal}
              onClose={handleCloseInterestModal}
              propertyId={property.id}
              propertyTitle={property.title}
              source={'Tenant'}
            ></ClaimFormModal>
            </Card>
        </Container>
    </Box>
    </>
  );
};

export default withMainLayout(PropertyDetails);