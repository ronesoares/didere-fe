import { useCallback, useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  TablePagination,
  Typography,
  CardMedia
} from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ImageIcon from '@mui/icons-material/Image';
import PropertiesService from '../../../services/api/properties';
import { PropertyBrowseFilter } from '../../../components/search/property/property-browse-filter';
import { withMainLayout } from '../../../hocs/with-main-layout';
import { useMounted } from '../../../hooks/use-mounted';
import { getBase64 } from '../../../services/api/files';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const PropertyBrowse = () => {
  const isMounted = useMounted();
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentFilters, setCurrentFilters] = useState({});
  const [thumbnails, setThumbnails] = useState({});

  // Função para carregar thumbnail de uma propriedade
  const loadThumbnail = useCallback(async (property) => {
    if (!property.files || property.files.length === 0) return null;
    
    try {
      // Procurar por arquivo thumbnail primeiro
      const thumbnailFile = property.files.find(file => 
        file.name && file.name.toLowerCase().includes('thumbnail')
      );
      
      // Se não encontrar thumbnail, usar a primeira imagem
      const fileToUse = thumbnailFile || property.files[0];
      
      if (fileToUse) {
        const base64Image = await getBase64(fileToUse.id, true);
        return base64Image;
      }
    } catch (error) {
      console.error('Erro ao carregar thumbnail:', error);
    }
    return null;
  }, []);

  // Carregar thumbnails para as propriedades
  useEffect(() => {
    const loadThumbnails = async () => {
      const newThumbnails = {};
      
      for (const property of properties) {
        if (!thumbnails[property.id]) {
          const thumbnail = await loadThumbnail(property);
          if (thumbnail) {
            newThumbnails[property.id] = thumbnail;
          }
        }
      }
      
      if (Object.keys(newThumbnails).length > 0) {
        setThumbnails(prev => ({ ...prev, ...newThumbnails }));
      }
    };

    if (properties.length > 0) {
      loadThumbnails();
    }
  }, [properties, loadThumbnail, thumbnails]);

  const jsonFilter = useMemo(() => ({
    "titleContains": null,
    "heightGreaterThan": null,
    "heightLessThan": null,
    "widthGreaterThan": null,
    "widthLessThan": null,
    "depthGreaterThan": null,
    "depthLessThan": null,
    "periodicityList": [],
    "valueGreaterThan": null,
    "valueLessThan": null,
    "idCity": null,
    "idState": null,
    "neighborhoodContains": null,
    "startDate": null,
    "endDate": null,
    "startHour": null,
    "endHour": null,
    "onlyActive": "Y",
    "featureList": [],
    "typeActivityList": []
  }), []);

  const applyPagination = (properties, page, rowsPerPage) => properties.slice(page * rowsPerPage,
    page * rowsPerPage + rowsPerPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const paginatedProperties = applyPagination(properties, page, rowsPerPage);

  const getProperties = useCallback(async (filters = {}) => {
    try {
      const hasFilters = Object.values(filters).some(value => 
        value !== null && value !== undefined && value !== '' && 
        (Array.isArray(value) ? value.length > 0 : true)
      );

      const requestFilters = hasFilters ? filters : {};
      const data = await PropertiesService.searchPublic(requestFilters);

      if (isMounted()) {
        setProperties(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    if (Object.keys(currentFilters).length > 0) {
      getProperties(currentFilters);
    }
  }, [currentFilters, getProperties]);

  useEffect(() => {
    getProperties(jsonFilter);
  }, [getProperties, jsonFilter]);

  const handleFilter = (filters) => {
    setCurrentFilters(filters || jsonFilter);
    setPage(0);
  };

  const separateTextInNewLines = (text) => {
    return text.split(';')
      .map(linha => linha.trim())
      .filter(linha => linha.length > 0)
      .join('\n');
  };

  return (
    <>
      <Head>
        <title>
          Busca de Imóveis | Didere
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
          <Box sx={{ mt: 4 }}>
            <PropertyBrowseFilter
              properties={properties}
              onFilter={handleFilter}
            />
          </Box>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              {properties.map((property) => (
                <Card
                  key={property.id}
                  sx={{ mt: 4, width: '100%' }}
                >
                  <CardContent 
                      sx={{ 
                        mt: 4, 
                        display: 'flex', 
                        flexDirection: 'column' 
                        }} 
                    >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: {
                          xs: 'column',
                          sm: 'row'
                        }
                      }}
                    >
                      {/* Thumbnail da propriedade */}
                      <Box
                        sx={{
                          mr: 2,
                          mb: {
                            xs: 2,
                            md: 0
                          },
                          minWidth: 200,
                          maxWidth: 200
                        }}
                      >
                        {thumbnails[property.id] ? (
                          <CardMedia
                            component="img"
                            height="150"
                            image={thumbnails[property.id]}
                            alt={property.title}
                            sx={{
                              borderRadius: 1,
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              height: 150,
                              width: '100%',
                              backgroundColor: 'grey.200',
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <ImageIcon sx={{ fontSize: 40, color: 'grey.500' }} />
                          </Box>
                        )}
                      </Box>
                      
                      <div style={{ width: '100%' }}>
                        <NextLink
                          href={`/search/property/${property.id}`}
                          passHref
                        >
                          <Link
                            color="inherit"
                            variant="subtitle2"
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Typography variant="h6">
                              {property.title} - Cód.: {property.id}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {property.typeActivities}
                            </Typography>
                          </Link>
                        </NextLink>
                        
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexWrap: 'wrap',
                            ml: -1,
                            mt: 2,
                            '& > *': {
                              ml: 1,
                              mt: 1
                            }
                          }}
                        >
                          <NextLink
                            href={property.urlMaps || `https://www.didere.com.br`}
                            passHref
                          >
                            <Link
                              color="inherit"
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <Box
                                sx={{
                                  alignItems: 'center',
                                  display: 'flex'
                                }}
                              >
                                <LocationOnOutlinedIcon
                                  color="action"
                                  fontSize="small"
                                  sx={{ mr: 1 }}
                                />
                                <Typography
                                  color="textSecondary"
                                  noWrap
                                  variant="overline"
                                >
                                  {property.neighborhood}, {property.city} - {property.state}
                                </Typography>
                              </Box>
                            </Link>
                          </NextLink>
                          
                          {property.features && (
                            <Box
                              sx={{
                                alignItems: 'center',
                                display: 'flex'
                              }}
                            >
                              <HomeWorkIcon
                                color="action"
                                fontSize="small"
                                sx={{ mr: 1 }}
                              />
                              <Typography
                                color="textSecondary"
                                noWrap
                                variant="overline"
                              >
                                {property.features.replace(/;/g, ', ')}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        
                        <Box sx={{ mt: 2 }}>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                          >
                            Período disponível
                          </Typography>
                          <Typography 
                            variant="body2"
                            sx={{ whiteSpace: 'pre-line' }}
                          >
                            {separateTextInNewLines(property.rentalPeriod)}
                          </Typography>
                        </Box>
                        
                        <Box 
                          sx={{ 
                            mt: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Box>
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              color="primary"
                            >
                              R$ {formatCurrency(property.value)}/{property.periodicity}
                            </Typography>
                          </Box>
                          <NextLink
                            href={`/search/property/${property.id}`}
                            passHref
                          >
                            <Button
                              variant="contained"
                              color="warning"
                              size="large"
                            >
                              Ver Detalhes
                            </Button>
                          </NextLink>
                        </Box>
                      </div>
                    </Box>
                  </CardContent>
                </Card>
              ))}
              <TablePagination
                component="div"
                count={paginatedProperties.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[25, 50, 100]}
              />
            </div>
        </Container>
      </Box>
    </>
  );
};

export default withMainLayout(PropertyBrowse);