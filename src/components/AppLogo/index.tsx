import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';

type AppLogoProps = {
  theme: 'light' | 'dark';
};

export const AppLogo = ({ theme }: AppLogoProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {theme === 'light' ? (
        <Avatar alt="Kinetic Logo" src="/src/white-logo.svg" />
      ) : (
        <Avatar alt="Kinetic Logo" src="/src/logo.svg" />
      )}
      <Typography component="h1" variant="h5" fontWeight={500}>
        Open Commerce
      </Typography>
    </Box>
  );
};
