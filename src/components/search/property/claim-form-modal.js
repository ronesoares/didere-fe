import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Link,
  Modal,
  TextField,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import InputMask from 'react-input-mask';
import claimFormService from '../../../services/processes/claim-form-service';
import { gtm } from '../../../lib/gtm';
import PropTypes from 'prop-types';
import { ModalLGPD } from '../../authentication/terms/modal-lgpd';

export const ClaimFormModal = (props) => {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    termsAndConditions: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const phoneInputRef = useRef(null);
  const {
        open,
        onClose,
        propertyId,
        propertyTitle,
        source,
        ...other
      } = props;
  const [openModalLGPD, setOpenModalLGPD] = useState(false);

  const handleCloseModalLGPD = () => setOpenModalLGPD(false);

  useEffect(() => {
      gtm.push({ event: 'page_view' });
    }, []);

  useEffect(() => {
    const { name, email, phone, termsAndConditions } = formValues;
    const isPhoneValid = phone && phone.replace(/\\D/g, '').length >= 10;
    setIsFormValid(!!name && !!email && isPhoneValid && termsAndConditions);
  }, [formValues]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePhoneChange = (event) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      phone: event.target.value,
    }));
  };

  const handleSubmitInterest = async () => {
    try {
      const payload = {
        name: formValues.name,
        phoneNumber: formValues.phone.replace(/[^0-9,]*/g, ''),
        email: formValues.email,
        messageDetail: formValues.message,
        creationDate: new Date().toISOString(),
        property: propertyId === 0
          ? null
          : {
              id: propertyId,
              title: propertyTitle,
            },
        source: source,
      };

      claimFormService.insert(payload);

      onClose();
    } catch (error) {
      console.error("Erro ao enviar formulário de interesse:", error);
    }
  };

  return (
    <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="interest-form-modal-title"
        aria-describedby="interest-form-modal-description"
    >
        <Box
        sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '85%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            alignItems: 'flex-start',
            borderRadius: '16px',
            position: 'relative',
        }}
        >
        <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            }}
        >
            <CloseIcon />
        </IconButton>
        <img 
            src="/static/logo.svg" 
            alt="Didere Logo"
            style={{ marginBottom: '16px', height: '40px' }} 
        /> {}
        <Typography 
            id="interest-form-modal-title" 
            variant="h6"
            component="h2" 
            sx={{ mb: 2 }}
        >
            Formulário de interesse
        </Typography>
        <TextField 
            label="Nome completo" 
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            fullWidth 
            sx={{ mb: 2 }} 
        />
        <TextField 
            label="E-mail" 
            name="email"
            type="email" 
            value={formValues.email}
            onChange={handleInputChange}
            fullWidth 
            sx={{ mb: 2 }} 
        />
        <InputMask
            mask="(99) 99999-9999"
            value={formValues.phone}
            onChange={handlePhoneChange}
        >
            {(inputProps) => {
            const handleRef = (instance) => {
                if (typeof inputProps.ref === 'function') {
                inputProps.ref(instance);
                } else if (inputProps.ref && typeof inputProps.ref === 'object') {
                inputProps.ref.current = instance;
                }
                
                phoneInputRef.current = instance;
            };

            const { ref: maskRef, ...restInputProps } = inputProps;

            return (
                <TextField
                {...restInputProps}
                inputRef={handleRef}
                fullWidth
                required
                label="Telefone"
                name="phone"
                type='tel'
                variant="outlined"
                sx={{ mb: 2 }}
                InputLabelProps={{
                    shrink: !!inputProps.value || !!formValues.phone,
                }}
                />
            );
            }}
        </InputMask>
        <TextField
            label="Envie uma mensagem (opcional)"
            name="message"
            value={formValues.message}
            onChange={handleInputChange}
            multiline
            rows={4}
            fullWidth
            sx={{ mb: 2 }}
        />
        <FormControlLabel
            control={(
            <Checkbox 
                name="termsAndConditions" 
                checked={formValues.termsAndConditions}
                onChange={handleInputChange}
            />
            )}
            label={(<Link
                      color="primary"
                      component="a"
                      onClick={() => { setOpenModalLGPD(true); }}
                    >
                      Li e concordo com os Termos e Condições da Política de Privacidade - LGPD
                    </Link>)}
            sx={{ mb: 2, alignSelf: 'flex-start' }}
        />
        <Button 
            variant="contained" 
            color="primary"
            onClick={handleSubmitInterest}
            fullWidth
            disabled={!isFormValid}
        >
            Enviar
        </Button>
        <ModalLGPD
          open={openModalLGPD} 
          onClose={handleCloseModalLGPD} 
        />
        </Box>
    </Modal>
  );
};

ClaimFormModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    propertyId: PropTypes.number.isRequired,
    propertyTitle: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
};