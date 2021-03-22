import { ThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core";
import { BrowserRouter as Router } from "react-router-dom";

import { Web3ContextProvider } from "./contexts/web3.context";
import {TokenContextProvider} from "./contexts/token.context";
import Layout from "./pages/Layout";

const theme = createMuiTheme({});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Web3ContextProvider>
          <TokenContextProvider>
            <Router>
              <Layout />
            </Router>
          </TokenContextProvider>
        </Web3ContextProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
