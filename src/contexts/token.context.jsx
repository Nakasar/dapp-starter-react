import React from 'react';
import TokenAdapter from "../adapters/token.adapter";

const tokenAdapter = new TokenAdapter();

const TokenContext = React.createContext({ loaded: false });

function TokenContextProvider(props) {
  const [loaded, setLoaded] = React.useState(false);
  const [token, setToken] = React.useState(null);
  const [transfers, setTransfers] = React.useState([]);

  async function loadToken(tokenAddress, provider) {
    setToken(await tokenAdapter.instantiateToken(tokenAddress, provider));
    setLoaded(true);
  }

  async function fetchTransfers() {
    setTransfers(await token.getTransfers());
  }

  const value = {
    loaded,
    token,
    transfers,
    loadToken,
    fetchTransfers,
  };

  return (
    <TokenContext.Provider value={value}>{props.children}</TokenContext.Provider>
  );
}

const TokenContextConsumer = TokenContext.Consumer;

export const withToken = Component => props => (
  <TokenContextConsumer>
    {value => <Component {...props} tokenContext={value} />}
  </TokenContextConsumer>
);

export default TokenContext;

export {TokenContextConsumer, TokenContextProvider};

export const useToken = () => React.useContext(TokenContext);
