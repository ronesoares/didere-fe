import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  Paper,
  Skeleton,
  Typography,
  Box,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useState } from 'react';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  '& .MuiTableHead-root': {
    '& .MuiTableCell-root': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? theme.palette.grey[800] 
        : theme.palette.grey[50],
      fontWeight: 600,
      fontSize: '0.875rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
  },
  '& .MuiTableBody-root': {
    '& .MuiTableRow-root': {
      transition: theme.transitions.create(['background-color'], {
        duration: theme.transitions.duration.short,
      }),
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' 
          ? theme.palette.grey[800] 
          : theme.palette.grey[50],
      },
    },
  },
}));

const MobileCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

export const DataGrid = ({ 
  columns = [], 
  rows = [], 
  loading = false,
  pagination = true,
  rowsPerPageOptions = [5, 10, 25],
  onRowClick,
  sx = {},
  ...props 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = pagination 
    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : rows;

  const renderCellValue = (value, column) => {
    if (column.type === 'chip') {
      return (
        <Chip 
          label={value} 
          size="small" 
          color={column.chipColor || 'default'}
          variant={column.chipVariant || 'filled'}
        />
      );
    }
    if (column.type === 'currency') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    }
    if (column.type === 'date') {
      return new Date(value).toLocaleDateString('pt-BR');
    }
    if (column.render) {
      return column.render(value);
    }
    return value;
  };

  if (loading) {
    return (
      <Box sx={sx}>
        {[...Array(5)].map((_, index) => (
          <Skeleton 
            key={index} 
            variant="rectangular" 
            height={60} 
            sx={{ mb: 1, borderRadius: 1 }} 
          />
        ))}
      </Box>
    );
  }

  if (isMobile) {
    return (
      <Box sx={sx}>
        {paginatedRows.map((row, index) => (
          <MobileCard 
            key={row.id || index}
            onClick={() => onRowClick && onRowClick(row)}
            sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
          >
            {columns.map((column) => (
              <Box key={column.field} sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {column.headerName}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {renderCellValue(row[column.field], column)}
                </Typography>
              </Box>
            ))}
          </MobileCard>
        ))}
        {pagination && (
          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
            }
          />
        )}
      </Box>
    );
  }

  return (
    <Box sx={sx}>
      <StyledTableContainer component={Paper}>
        <Table {...props}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column.field}
                  align={column.align || 'left'}
                  sx={{ minWidth: column.minWidth }}
                >
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow 
                key={row.id || index}
                onClick={() => onRowClick && onRowClick(row)}
                sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((column) => (
                  <TableCell 
                    key={column.field} 
                    align={column.align || 'left'}
                  >
                    {renderCellValue(row[column.field], column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
      {pagination && (
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
          }
        />
      )}
    </Box>
  );
};

DataGrid.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    field: PropTypes.string.isRequired,
    headerName: PropTypes.string.isRequired,
    minWidth: PropTypes.number,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    type: PropTypes.oneOf(['text', 'chip', 'currency', 'date']),
    chipColor: PropTypes.string,
    chipVariant: PropTypes.oneOf(['filled', 'outlined']),
    render: PropTypes.func,
  })).isRequired,
  rows: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  pagination: PropTypes.bool,
  rowsPerPageOptions: PropTypes.array,
  onRowClick: PropTypes.func,
  sx: PropTypes.object,
};

