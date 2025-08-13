import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import featureService from '../../../../services/registrations/feature-service';
import { FeatureListTable } from '../../../../components/dashboard/registrations/feature/feature-list-table';
import { withAuthGuard } from '../../../../hocs/with-auth-guard';
import { withDashboardLayout } from '../../../../hocs/with-dashboard-layout';
import { useMounted } from '../../../../hooks/use-mounted';
import { Plus as PlusIcon } from '../../../../icons/plus';
import { Search as SearchIcon } from '../../../../icons/search';
import { gtm } from '../../../../lib/gtm';
import NextLink from 'next/link';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const sortOptions = [
  {
    label: 'Nome (A-Z)',
    value: 'name|asc'
  },
  {
    label: 'Nome (Z-A)',
    value: 'name|desc'
  },
];

const getNestedProperty = (obj, propertyPath) => {
    return propertyPath.split('.').reduce((acc, part) => acc && acc[part], obj);
};
  
const applyFilters = (features, filters) => features.filter((feature) => {
    if (filters.query) {
        let queryMatched = false;
        const properties = ['name', 'description'];
    
        properties.forEach((property) => {
          const value = getNestedProperty(feature, property);
          if (value && value.toLowerCase().includes(filters.query.toLowerCase())) {
            queryMatched = true;
          }
        });
    
        if (!queryMatched) {
          return false;
        }
    }
    
    return true;
});

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
};

const getComparator = (order, orderBy) => (order === 'desc'
  ? (a, b) => descendingComparator(a, b, orderBy)
  : (a, b) => -descendingComparator(a, b, orderBy));

const applySort = (features, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = features.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
        const newOrder = comparator(a[0], b[0]);

    if (newOrder !== 0) {
      return newOrder;
    }

        return a[1] - b[1];
  });

    return stabilizedThis.map((el) => el[0]);
};

const applyPagination = (features, page, rowsPerPage) => features.slice(page * rowsPerPage,
  page * rowsPerPage + rowsPerPage);

const FeatureList = () => {
  const isMounted = useMounted();
  const queryRef = useRef(null);
  const [features, setFeatures] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sort, setSort] = useState(sortOptions[0].value);
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    query: ''
  });

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getFeatures = useCallback(async () => {
    try {
      const data = await featureService.getAll();

      if (isMounted()) {
        setFeatures(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
      getFeatures();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  const handleQueryChange = (event) => {
    event.preventDefault();
    setFilters((prevState) => ({
      ...prevState,
      query: queryRef.current?.value
    }));
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const filteredFeatures = applyFilters(features, filters);
  const sortedFeatures = applySort(filteredFeatures, sort);
  const paginatedFeatures = applyPagination(sortedFeatures, page, rowsPerPage);

  const handleDelete = async (id) => {
    try {
      await featureService.deleteById(id);
      toast.success('Característica excluída!');

      setFeatures(features.filter(item => item.id !== id));

      setFilters({
        query: query.value
      });

    } catch (err) {
      console.error(err.message + '. ' + err.detail);
      toast.error(err.message + '. ' + err.detail);
    }
  };

  return (
    <>
      <Head>
        <title>
          {t('Características')} | Didere
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
            >
              <Grid item>
                <Typography variant="h4">
                  {t('Características')}
                </Typography>
              </Grid>
              <Grid item>
                <NextLink
                  href="/dashboard/registrations/feature/0"
                  passHref
                >
                  <Button

                    startIcon={<PlusIcon fontSize="small" />}
                    variant="contained"
                  >
                    {t('Adicionar')}
                  </Button>
                </NextLink>
              </Grid>
            </Grid>
          </Box>
          <Card>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                m: -1.5,
                p: 3
              }}
            >
              <Box
                onChange={handleQueryChange}
                sx={{
                  flexGrow: 1,
                  m: 1.5
                }}
              >
                <TextField
                  defaultValue=""
                  fullWidth
                  id='query'
                  inputProps={{ ref: queryRef }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                  placeholder="Procurar características por nome e descrição"
                />
              </Box>
              <TextField
                label="Ordenar por"
                name="sort"
                onChange={handleSortChange}
                select
                SelectProps={{ native: true }}
                sx={{ m: 1.5 }}
                value={sort}
              >
                {sortOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Box>
            <FeatureListTable
              features={paginatedFeatures}
              featuresCount={filteredFeatures.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPage={rowsPerPage}
              page={page}
              onDelete={handleDelete}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default withAuthGuard(withDashboardLayout(FeatureList));