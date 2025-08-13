import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography
} from '@mui/material';
import { FileDropzone } from './file-dropzone';
import { gtm } from '../lib/gtm';
import { fileToBase64 } from '../utils/file-to-base64';

export const CoverImage = (props) => {
  const { cover, setCover,...other } = props;

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const handleDropCover = async ([file]) => {
    const data = await fileToBase64(file);
    setCover(data);
  };

  const handleRemove = () => {
    setCover(null);
  };

  return (
    <>
      <Card sx={{ mt: 4 }}>
        <CardContent>
            <Typography variant="h6">
                Imagem principal
            </Typography>
            {cover ? (
            <Box
                sx={{
                backgroundImage: `url(${cover})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                borderRadius: 1,
                height: 230,
                mt: 3
                }}
            />
            ) : (
            <Box
                sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                border: 1,
                borderRadius: 1,
                borderStyle: 'dashed',
                borderColor: 'divider',
                height: 230,
                mt: 3,
                p: 3
                }}
            >
                <Typography
                    align="center"
                    color="textSecondary"
                    variant="h6"
                >
                    Selecione a imagem principal
                </Typography>
                <Typography
                    align="center"
                    color="textSecondary"
                    sx={{ mt: 1 }}
                    variant="subtitle1"
                >
                    Imagem usada para ser exibida como capa principal do anúncio
                </Typography>
            </Box>
            )}
            <Button
                onClick={handleRemove}
                sx={{ mt: 3 }}
                disabled={!cover}
            >
                Remover imagem
            </Button>
            <Box sx={{ mt: 3 }}>
            <FileDropzone
                accept="image/*"
                maxFiles={1}
                onDrop={handleDropCover}
            />
            </Box>
        </CardContent>
      </Card>
    </>
  );
};

CoverImage.propTypes = {
  cover: PropTypes.string,
  setCover: PropTypes.func
};