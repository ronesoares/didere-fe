import { useCallback, useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  TablePagination,
  Typography
} from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import propertyService from '../../../services/registrations/property-service';
import { PropertyBrowseFilter } from '../../../components/search/property/property-browse-filter';
import { withMainLayout } from '../../../hocs/with-main-layout';
import { useMounted } from '../../../hooks/use-mounted';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { getInitials } from '../../../utils/get-initials';

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

  const jsonFIlter = useMemo(() => ({
    "titleContains": "",
    "heightGreaterThan": 0,
    "heightLessThan": 0,
    "widthGreaterThan": 0,
    "widthLessThan": 0,
    "depthGreaterThan": 0,
    "depthLessThan": 0,
    "periodicityList": [],
    "valueGreaterThan": 0,
    "valueLessThan": 0,
    "idCity": null,
    "idState": null,
    "neighborhoodContains": "",
    "startDate": null,
    "endDate": null,
    "startHour": null,
    "endHour": null,
    "onlyActive": "S",
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

  useEffect(() => {
    if (Object.keys(currentFilters).length > 0) {
      getProperties(currentFilters);
    }
  }, [currentFilters, getProperties]);

  const getProperties = useCallback(async (filters = {}) => {
    try {
      const hasFilters = Object.values(filters).some(value => 
        value !== null && value !== undefined && value !== '' && 
        (Array.isArray(value) ? value.length > 0 : true)
      );

      const requestFilters = hasFilters ? filters : {};
      const data = await propertyService.getAll(requestFilters);

      if (isMounted()) {
        setProperties(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getProperties(jsonFIlter);
  }, [getProperties, jsonFIlter]);

  const handleFilter = (filters) => {
    setCurrentFilters(filters || jsonFIlter);
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
                      <Avatar
                        component="a"
                        src={property.photo}
                        sx={{
                          background: 'transparent',
                          mr: 2,
                          mb: {
                            xs: 2,
                            md: 0
                          }
                        }}
                        variant="rounded"
                      >
                        {getInitials(property.title)}
                      </Avatar>
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
                            <Typography variant="body2">
                              {property.typeActivities}
                            </Typography>
                            <Box
                              sx={{
                              backgroundImage: `url(${property.photo})`,
                              backgroundPosition: 'center',
                              backgroundSize: 'cover',
                              borderRadius: 1,
                              height: 230,
                              mt: 3
                              }}
                          />
                          </Link>
                        </NextLink>
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexWrap: 'wrap',
                            ml: -3,
                            '& > *': {
                              ml: 3,
                              mt: 1
                            }
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
                          {property.photo && (
                            <Box
                              sx={{
                                alignItems: 'center',
                                display: 'flex'
                              }}
                            >
                              <HomeWorkIcon
                                color="textSecondary"
                                fontSize="small"
                                sx={{ mr: 1 }}
                              />
                              <Typography
                                color="textSecondary"
                                noWrap
                                variant="overline"
                              >
                                {property.features.replace(/;/g, ',')}
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
                            >
                              R$ {formatCurrency(property.value)}/{property.periodicity}
                            </Typography>
                          </Box>
                          <NextLink
                            href={`/search/property/${property.id}`}
                            passHref
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="contained"
                              color="warning"
                            >
                              Detalhes
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