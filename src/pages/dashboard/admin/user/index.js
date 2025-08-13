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
import userService from '../../../../services/admin/user-service';
import { UserListTable } from '../../../../components/dashboard/admin/user/user-list-table';
import { withAuthGuard } from '../../../../hocs/with-auth-guard';
import { withDashboardLayout } from '../../../../hocs/with-dashboard-layout';
import { useMounted } from '../../../../hooks/use-mounted';
import { Plus as PlusIcon } from '../../../../icons/plus';
import { Search as SearchIcon } from '../../../../icons/search';
import { gtm } from '../../../../lib/gtm';
import NextLink from 'next/link';
import toast from 'react-hot-toast';

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
  
const applyFilters = (users, filters) => users.filter((user) => {
    if (filters.query) {
        let queryMatched = false;
        const properties = ['login', 'name'];
    
        properties.forEach((property) => {
          const value = getNestedProperty(user, property);
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

const applySort = (users, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = users.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
        const newOrder = comparator(a[0], b[0]);

    if (newOrder !== 0) {
      return newOrder;
    }

        return a[1] - b[1];
  });

    return stabilizedThis.map((el) => el[0]);
};

const applyPagination = (users, page, rowsPerPage) => users.slice(page * rowsPerPage,
  page * rowsPerPage + rowsPerPage);

const UserList = () => {
  const isMounted = useMounted();
  const queryRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sort, setSort] = useState(sortOptions[0].value);
  const [filters, setFilters] = useState({
    query: ''
  });

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getUsers = useCallback(async () => {
    try {
      const data = await userService.getAll('name asc');

      if (isMounted()) {
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
      getUsers();
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

  const filteredUsers = applyFilters(users, filters);
  const sortedUsers = applySort(filteredUsers, sort);
  const paginatedUsers = applyPagination(sortedUsers, page, rowsPerPage);

  const handleDelete = async (id) => {
    try {
      await userService.deleteById(id);
      toast.success('Usuário excluído!');

      setUsers(users.filter(item => item.id !== id));

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
          Usuários | Didere
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
                  Usuários
                </Typography>
              </Grid>
              <Grid item>
                <NextLink
                  href="/dashboard/admin/user/0"
                  passHref
                >
                  <Button

                    startIcon={<PlusIcon fontSize="small" />}
                    variant="contained"
                  >
                    Adicionar
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
                  placeholder="Procurar usuários por nome e login"
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
            <UserListTable
              users={paginatedUsers}
              usersCount={filteredUsers.length}
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

export default withAuthGuard(withDashboardLayout(UserList));