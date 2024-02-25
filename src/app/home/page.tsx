'use client'

import React, { useState } from 'react'
import { createWorker } from 'tesseract.js';
import { getText, goTSignin } from '../actions/auth';
import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Container, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, PaletteMode, Snackbar, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MenuAppBar from '../components/appbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../functions/config';
import Link from 'next/link';

type Textuel = {
  src: string;
  texte: string;
};

type User = {
  email : string
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function page() {
    const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>("/tala_logo.png");
    const [taille, setTaille] = useState({})
    const [texte, setTexte] = useState("")
    const [textes, setTextes] = useState<Textuel[]>([])
    const [mode, setMode] = React.useState<PaletteMode>('dark')
    const [open, setOpen] = React.useState(false);
    const [toast, setToast] = useState("")
    const [user, setUser] = useState<User>()

    /*React.useEffect(()=>{
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const _user : User = {
            email : user.email+""
          }
          
          setUser(_user)
          // ...
          console.log("User connecté!")
        } else {
          // User is signed out
          // ...
          console.log("Pas connecté!")
          goTSignin()
        }
      });
    }, [])*/

    const handleCopy = async (event : any) => {
      console.log(event)
        try {
            await navigator.clipboard.writeText(texte);
            setToast("Texte copié avec succès !")
            handleClick()
          } catch (err) {
            console.error('Erreur lors de la copie du texte :', err);
          }
      };

    const handleImageChange = (e : any) => {
        const file = e.target.files[0];
    
        if (file) {

          // Obtenez la taille de l'image
          const imageSizeInBytes = file.size;
          const imageSizeInKb = imageSizeInBytes / 1024;
          const imageSizeInMb = imageSizeInKb / 1024;

          /*console.log(`Taille de l'image: ${imageSizeInBytes} octets`);
          console.log(`Taille de l'image: ${imageSizeInKb} Ko`);
          console.log(`Taille de l'image: ${imageSizeInMb} Mo`);*/

          const formData = new FormData();
          formData.append('file', file);

          const reader = new FileReader();
          reader.onloadend = async () => {
            setImageSrc(reader.result);

            setToast("Veuillez patienter...")
            handleClick()
            
              console.log(imageSrc)
              const worker = await createWorker('eng');
              const ret = await worker.recognize(reader.result+"");
              console.log(ret);
              setTexte(ret.data.text)
              const item : Textuel = {
                src : reader.result+"",
                texte : ret.data.text
              }
              setTextes(
                [
                  ...textes, item
                ]
              )
              await worker.terminate();
           
          };
          reader.readAsDataURL(file);
        }
      };

      const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        /*getText(data).then(async (res)=>{
          console.log(res, data.get("file"))
          if(res.value == false){
            //Toast pour dire que la taille du fichier ne correspond pas à votre formule.
            setTexte(res.msg!)
            return 
          }*/
          
          const worker = await createWorker('eng');
          const ret = await worker.recognize(imageSrc+"");
          console.log(ret);
          setTexte(ret.data.text)
          const item : Textuel = {
            src : imageSrc+"",
            texte : ret.data.text
          }
          setTextes(
            [
              ...textes, item
            ]
          )
          await worker.terminate();
       // });
        
      };


      const handleClick = () => {
        setOpen(true);
      };

      const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }

        setOpen(false);
      };

      const action = (
        <React.Fragment>
          <Button color="secondary" size="small" onClick={handleClose}>
            UNDO
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      );

  return (
    <>
    <MenuAppBar />
    
    <Container>
    <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
    <Card sx={{ maxWidth: 500 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          //height="140"
          image={imageSrc+""}
          alt="Image à traiter"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Notification
          </Typography>
          <Typography variant="body2" color= {texte.startsWith("La taille")? "warning" : "secondary"} >
            {texte}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Telecharger le fichier
              <VisuallyHiddenInput type="file" name="file" onChange={handleImageChange} accept="image/*" />
            </Button>
          </Box>
        </CardContent>
      </CardActionArea>
      {
        texte.length>0 ? <CardActions>
        <Button onClick={handleCopy} size="small" color="info">
          Copier le texte
        </Button>
      </CardActions> : <></>
      }
    </Card>
  </Box>
</Container>

<Container>
  <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
  <List
        sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Traitements précédents
          </ListSubheader>
        }
      >
        {
          textes.map((value, index)=>{
            return <ListItemButton key={index} onClick={async ()=>{
              try {
                await navigator.clipboard.writeText(texte);
                console.log('Texte copié avec succès !');
                setToast("Texte copié avec succès !")
                handleClick()
              } catch (err) {
                console.error('Erreur lors de la copie du texte :', err);
                setToast("Erreur lors de la copie du texte")
              }
            }}>
              <ListItemIcon>
                <SendIcon />
              </ListItemIcon>
              <ListItemText primary={value.texte} />
          </ListItemButton>
          })
        }
      </List>
  </Box>

  <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <Typography variant="body2" color="warning" >
              Contact : stephanebazebibouta@gmail.com
          </Typography>
          </Box>
</Container>

<Snackbar
  open={open}
  autoHideDuration={6000}
  onClose={handleClose}
  message={toast}
  action={action}
/>

    </>
  ) 
}
