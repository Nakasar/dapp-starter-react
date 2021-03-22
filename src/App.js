import { ThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core";
import { BrowserRouter as Router } from "react-router-dom";

import { Web3ContextProvider } from "./contexts/web3.context";
import Layout from "./pages/Layout";

const theme = createMuiTheme({});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Web3ContextProvider>
          <Router>
            <Layout />
          </Router>
        </Web3ContextProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
