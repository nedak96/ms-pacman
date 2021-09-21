import { FC } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';

import './GlobalStyles.css';
import { GamePage } from './GamePage/GamePage';
import { GameContext, useGameContext } from './components/StoreContext';

const theme = createTheme({
  
  typography: {
    fontFamily: 'Joystix',
  },
  palette: {
    mode: 'dark',
  }
});

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GameContext.Provider value={useGameContext()}>
        <GamePage />
      </GameContext.Provider>
    </ThemeProvider>
  );
};

export default App;
