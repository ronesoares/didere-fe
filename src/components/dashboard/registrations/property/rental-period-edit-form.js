import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import InputMask from 'react-input-mask';
import { Scrollbar } from '../../../scrollbar';
import { SeverityPill } from '../../../severity-pill';
import { PencilAlt as PencilAltIcon } from '../../../../icons/pencil-alt';
import { Trash as TrashRightIcon } from '../../../../icons/trash';
import { Plus as PlusIcon } from '../../../../icons/plus';
import { DialogWarning } from '../../../dialog-warning';
import { format } from 'date-fns';
import DateBR from '../../../../utils/date-br';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/pt-br';
import { useTranslation } from 'react-i18next';

dayjs.extend(localizedFormat);
dayjs.locale('pt-br');

export const RentalPeriods = (props) => {
  const { rentalPeriods, setRentalPeriods, ...other } = props;
  const [openDialogSave, setOpenDialogSave] = useState({});
  const [openDialogDelete, setOpenDialogDelete] = useState(0);
  const { t } = useTranslation();

  const saveRentalPeriod = (item) => {
    
    if (!(item.id > 0))
      rentalPeriods.push(item);

    setRentalPeriods(rentalPeriods);
  };

  const deleteRentalPeriod = async (id) => {
    setRentalPeriods(rentalPeriods.filter(item => item.id !== id));
  };
  
  const isCurrentPeriod = (startDate, endDate) => {
    const now = new DateBR().toUTC3();

    return (now >= new DateBR(startDate) && now <= new DateBR(endDate)) ? true : false;
  };

  const isFuturePeriod = (startDate) => {
    const now = new DateBR().toUTC3();

    return (startDate > now);
  };

  return (
    <Card {...other}>
      <Box sx={{ mb: 1 }}>
        <Grid
            container
            justifyContent="space-between"
            spacing={3}
        >
            <Grid item>
                <Typography variant="h6">
                  {t('Período disponível')}
                </Typography>
            </Grid>
            <Grid item>
                <Button
                  onClick={() => { setOpenDialogSave({
                      startDate: null, 
                      endDate: null, 
                      startHour: '', 
                      endHour: '', 
                      sunday: 'Y',
                      monday: 'Y',
                      tuesday: 'Y',
                      wednesday: 'Y',
                      thursday: 'Y',
                      friday: 'Y',
                      saturday: 'Y',
                      id: 0
                    });
                  }}
                  startIcon={<PlusIcon fontSize="small" />}
                  variant="contained"
                >
                    {t('Adicionar')}
                </Button>
            </Grid>
        </Grid>
      </Box>
      <Divider />
      <Scrollbar>
        <Box >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Data inicial
                </TableCell>
                <TableCell>
                  Data final
                </TableCell>
                <TableCell>
                  Hora inicial
                </TableCell>
                <TableCell>
                  Hora final
                </TableCell>
                <TableCell>
                  Vigente?
                </TableCell>
                <TableCell>
                  Domingo
                </TableCell>
                <TableCell>
                  Segunda-feira
                </TableCell>
                <TableCell>
                  Terça-feira
                </TableCell>
                <TableCell>
                  Quarta-feira
                </TableCell>
                <TableCell>
                  Quinta-feira
                </TableCell>
                <TableCell>
                  Sexta-feira
                </TableCell>
                <TableCell>
                  Sábado
                </TableCell>
                <TableCell>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rentalPeriods?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {format(new DateBR(item.startDate), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    {format(new DateBR(item.endDate), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    {item.startHour}
                  </TableCell>
                  <TableCell>
                    {item.endHour}
                  </TableCell>
                  <TableCell>
                    <SeverityPill color={isFuturePeriod(item.startDate) ? 'primary' : isCurrentPeriod(item.startDate, item.endDate) ? 'success' : 'error'}>
                        {isFuturePeriod(item.startDate) ? 'Futuro' : isCurrentPeriod(item.startDate, item.endDate) ? 'Sim' : 'Não'}
                    </SeverityPill>
                  </TableCell>
                  <TableCell align="center">
                      <Checkbox checked={item.sunday == "Y"} />
                  </TableCell>
                  <TableCell align="center">
                      <Checkbox checked={item.monday == "Y"} />
                  </TableCell>
                  <TableCell align="center">
                      <Checkbox checked={item.tuesday == "Y"} />
                  </TableCell>
                  <TableCell align="center">
                      <Checkbox checked={item.wednesday == "Y"} />
                  </TableCell>
                  <TableCell align="center">
                      <Checkbox checked={item.thursday == "Y"} />
                  </TableCell>
                  <TableCell align="center">
                      <Checkbox checked={item.friday == "Y"} />
                  </TableCell>
                  <TableCell align="center">
                      <Checkbox checked={item.saturday == "Y"} />
                  </TableCell>
                  <TableCell align='right'>
                      <IconButton component="a" onClick={() => { setOpenDialogSave(item); }}>
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                      <IconButton component="a" onClick={() => { setOpenDialogDelete(item.id); }} >
                        <TrashRightIcon fontSize="small" />
                      </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <DialogRentalPeriod
        values={openDialogSave}
        onSubmitOk={() => { saveRentalPeriod(openDialogSave); setOpenDialogSave({}); }}
        onSubmitCancel={() => { setOpenDialogSave({}); }}
        open={openDialogSave?.id != null}
      />
      <DialogWarning
        title={t('Excluir período disponível')}
        description={t('Deseja realmente excluir este período disponível?')}
        cancelButton={t('Cancelar')}
        okButton={t('Excluir')}
        onSubmitOk={() => { deleteRentalPeriod(openDialogDelete); setOpenDialogDelete(0); }}
        onSubmitCancel={() => {setOpenDialogDelete(0)}}
        open={openDialogDelete != 0}
      />
    </Card>
  );
};

RentalPeriods.propTypes = {
    rentalPeriods: PropTypes.array.isRequired,
    setRentalPeriods: PropTypes.func.isRequired
};

export const DialogRentalPeriod = (props) => {
    const {
        values,
        onSubmitOk,
        onSubmitCancel,
        open,
        ...other
      } = props;

    return (
        <Dialog
            maxWidth="md"
            scroll='paper'
            open={open}
            {...other}
        >
            <Box
                sx={{
                backgroundColor: 'background.default',
                minHeight: '100%',
                p: 1
                }}
            >
                <Paper elevation={12}>
                    <Box
                    sx={{
                        display: 'flex',
                        pb: 2,
                        pt: 3,
                        px: 3
                    }}
                    >
                    <div>
                    <Grid
                      container
                      spacing={3}
                    >
                      <Grid
                        item
                        md={3}
                        xs={12}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                            <DatePicker
                            name="startDate"
                            fullWidth
                            required
                            value={dayjs(values.startDate)}
                            label="Data inicial"
                            showTodayButton={true}
                            onChange={(newValue) => {
                                values.startDate = newValue.toDate();
                            }}
                            renderInput={
                                (params) => 
                                <TextField 
                                    fullWidth 
                                    required
                                    {...params} />
                            }
                            />
                        </LocalizationProvider>
                      </Grid>
                      <Grid
                        item
                        md={3}
                        xs={12}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                            <DatePicker
                            name="endDate"
                            fullWidth
                            required
                            value={dayjs(values.endDate)}
                            label="Data final"
                            showTodayButton={true}
                            onChange={(newValue) => {
                                values.endDate = newValue.toDate();
                            }}
                            renderInput={
                                (params) => 
                                <TextField 
                                    fullWidth 
                                    required
                                    {...params} />
                            }
                            />
                        </LocalizationProvider>
                      </Grid>
                      <Grid
                        item
                        md={3}
                        xs={12}
                      >
                        <InputMask
                            mask="99:99"
                            defaultValue={values.startHour}
                            onChange={(newValue) => {
                                values.startHour = newValue.target.value;
                            }}
                        >
                            {(inputProps) => (
                            <TextField
                                {...inputProps}    
                                fullWidth
                                label="Hora inicial"
                                name="startHour"
                                variant="outlined"
                            />
                            )}
                        </InputMask>
                      </Grid>
                      <Grid
                        item
                        md={3}
                        xs={12}
                      >
                        <InputMask
                            mask="99:99"
                            defaultValue={values.endHour}
                            onChange={(newValue) => {
                                values.endHour = newValue.target.value;
                            }}
                        >
                            {(inputProps) => (
                            <TextField
                                {...inputProps}    
                                fullWidth
                                label="Hora final"
                                name="endHour"
                                variant="outlined"
                            />
                            )}
                        </InputMask>
                      </Grid>
                      <Grid
                        item
                        md={3}
                        xs={12}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox 
                              name="sunday"
                              onChange={(newValue) => {
                                values.sunday = newValue.target.checked ? "Y" : "N";
                              }}
                              defaultChecked={values.sunday === "Y"}
                            />
                          }
                          label={
                            <Typography variant="body1">
                              Domingo
                            </Typography>
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        md={3}
                        xs={12}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox 
                              name="monday"
                              onChange={(newValue) => {
                                values.monday = newValue.target.checked ? "Y" : "N";
                              }}
                              defaultChecked={values.monday === "Y"}
                            />
                          }
                          label={
                            <Typography variant="body1">
                              Segunda-feira
                            </Typography>
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        md={3}
                        xs={12}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox 
                              name="tuesday"
                              onChange={(newValue) => {
                                values.tuesday = newValue.target.checked ? "Y" : "N";
                              }}
                              defaultChecked={values.tuesday === "Y"}
                            />
                          }
                          label={
                            <Typography variant="body1">
                              Terça-feira
                            </Typography>
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        md={3}
                        xs={12}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox 
                              name="wednesday"
                              onChange={(newValue) => {
                                values.wednesday = newValue.target.checked ? "Y" : "N";
                              }}
                              defaultChecked={values.wednesday === "Y"}
                            />
                          }
                          label={
                            <Typography variant="body1">
                              Quarta-feira
                            </Typography>
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        md={3}
                        xs={12}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox 
                              name="thursday"
                              onChange={(newValue) => {
                                values.thursday = newValue.target.checked ? "Y" : "N";
                              }}
                              defaultChecked={values.thursday === "Y"}
                            />
                          }
                          label={
                            <Typography variant="body1">
                              Quinta-feira
                            </Typography>
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        md={3}
                        xs={12}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox 
                              name="friday"
                              onChange={(newValue) => {
                                values.friday = newValue.target.checked ? "Y" : "N";
                              }}
                              defaultChecked={values.friday === "Y"}
                            />
                          }
                          label={
                            <Typography variant="body1">
                              Sexta-feira
                            </Typography>
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        md={3}
                        xs={12}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox 
                              name="saturday"
                              onChange={(newValue) => {
                                values.saturday = newValue.target.checked ? "Y" : "N";
                              }}
                              defaultChecked={values.saturday === "Y"}
                            />
                          }
                          label={
                            <Typography variant="body1">
                              Sábado
                            </Typography>
                          }
                        />
                      </Grid>
                    </Grid>
                    </div>
                    </Box>
                    <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        px: 3,
                        py: 1.5
                    }}
                    >
                    <Button
                        sx={{ mr: 2 }}
                        variant="outlined"
                        onClick={onSubmitCancel}
                    >
                        Cancelar
                    </Button>
                    <Button
                        sx={{
                        backgroundColor: 'info.main',
                        '&:hover': {
                            backgroundColor: 'info.dark'
                        }
                        }}
                        variant="contained"
                        onClick={onSubmitOk}
                    >
                        Salvar
                    </Button>
                    </Box>
                </Paper>
            </Box>
        </Dialog>
    );
};

DialogRentalPeriod.propTypes = {
    values: PropTypes.object.isRequired,
    onSubmitOk: PropTypes.func.isRequired,
    onSubmitCancel: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};