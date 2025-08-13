import { useCallback, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  Typography
} from '@mui/material';
import NextLink from 'next/link';
import Head from 'next/head';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import { withMainLayout } from '../../../hocs/with-main-layout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import propertyService from '../../../services/registrations/property-service';
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

  useEffect(() => {
      gtm.push({ event: 'page_view' });
    }, []);

  useEffect(() => {
      getProperty();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [propertyId, getProperty]);

  const getProperty = useCallback(async () => {
    try {
      const data = propertyId > 0 ? await propertyService.getById(propertyId) : null;

      if (isMounted() && data) {
        setProperty(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [propertyId, isMounted]);

  useEffect(() => {
    const fetchImages = async () => {
      if (property && property.photos) {
        const urls = await Promise.all(
          property.photos.map(async (photo) => {
            const base64Image = await getFileAsBase64(photo.file, 'property');
            return base64Image;
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
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true
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
        <Container maxWidth="md">
            <Card sx={{ mt: 4, width: '100%' }}>
            <CardContent>
                <NextLink
                    href="/search/property"
                    passHref
                >
                    <Link
                    color="textPrimary"
                    component="a"
                    sx={{
                        alignItems: 'center',
                        display: 'flex'
                    }}
                    >
                    <ArrowBackIcon
                        fontSize="small"
                        sx={{ mr: 1 }}
                    />
                    <Typography variant="subtitle2">
                        {'Voltar'}
                    </Typography>
                    </Link>
                </NextLink>

                {}
                <Box>
                {}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
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
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" component="p" color="primary" gutterBottom>
                        R$ {formatCurrency(property.value)}/{periodicityOptions.get(property.periodicity)}
                    </Typography>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={handleOpenInterestModal}
                    >
                        Tenho interesse
                    </Button>
                    </Box>
                </Box>

                {}
                {imageUrls && imageUrls.length > 0 ? (
                    <Slider {...sliderSettings}>
                    {imageUrls.map((url, index) => (
                        <div key={index}>
                        <Box
                            component="img"
                            src={url}
                            alt={`${property.title} - Imagem ${index + 1}`}
                            sx={{
                            width: '100%',
                            height: 'auto', 
                            maxHeight: '500px',
                            objectFit: 'cover',
                            borderRadius: 1
                            }}
                        />
                        </div>
                    ))}
                    </Slider>
                ) : (
                    property.photo && ( 
                    <Box
                        component="img"
                        src={property.photo}
                        alt={property.title}
                        sx={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover',
                        borderRadius: 1,
                        mb: 2
                        }}
                    />
                    )
                )}

                {}
                <Box sx={{ mt: 3 }}>
                    <Box 
                      sx={{ display: 'flex', 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            mb: 2 
                         }}
                    >
                    <NextLink
                      href={property.urlMaps || `https:\\www.didere.com.br`}
                      passHref
                    >
                      <Link
                        color="inherit"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Box 
                          sx={{ display: 'flex', 
                                alignItems: 'center', 
                                mr: 2 
                            }}
                        >
                          <LocationOnOutlinedIcon 
                            color="action" 
                            sx={{ mr: 1 }} 
                          />
                          <Typography 
                            variant="body1" 
                            color="text.secondary"
                          >
                            {property.address.neighborhood}, {property.address.city.name} - {property.address.state.name}
                          </Typography>
                        </Box>
                      </Link>
                    </NextLink>

                    {property.features && Array.isArray(property.features) && property.features.length > 0 && (
                        <Box 
                          sx={{ display: 'flex', 
                                alignItems: 'center' 
                             }}
                        >
                          <HomeWorkIcon 
                            color="action" 
                            sx={{ mr: 1 }} 
                          />
                          <Typography 
                            variant="body1" 
                            color="text.secondary"
                          >
                            {property.features
                              .sort((a, b) => a.feature.name.toLowerCase().localeCompare(b.feature.name.toLowerCase()))
                              .map(f => f.feature.name).join(', ')}
                          </Typography>
                        </Box>
                    )}
                    </Box>

                    <Box sx={{ mt: 4 }}>
                      <Typography
                        variant="h6" 
                        component="h2" 
                      >
                        Período disponível
                      </Typography>
                      <Typography 
                        variant="body1"
                        sx={{ whiteSpace: 'pre-line' }}
                      >
                        {formatRentalPeriods(property.rentalPeriods)}
                      </Typography>
                    </Box>

                    <Typography 
                      variant="h6" 
                      component="h2" 
                      gutterBottom 
                      sx={{ mt: 4}}
                    >
                      Descrição do espaço
                    </Typography>
                    <Typography 
                      variant="body1"
                      sx={{ whiteSpace: 'pre-line' }}
                    >
                      {property.description}
                    </Typography>
                </Box>
                </Box>
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