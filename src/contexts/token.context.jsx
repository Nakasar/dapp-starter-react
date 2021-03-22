import React from 'react';
import TokenAdapter from "../adapters/token.adapter";

const tokenAdapter = new TokenAdapter();

const TokenContext = React.createContext({ loaded: false });

function TokenContextProvider(props) {
  const [loaded, setLoaded] = React.useState(false);
  const [token, setToken] = React.useState(null);
  const [transfers, dispatchTransfers] = React.useReducer((state, action) => {
    switch (action.action) {
      case 'ADD':
        return [...state, action.transfer];
      case 'SET':
        return action.transfers;
    }
  }, []);

  async function loadToken(tokenAddress, provider) {
    const token = await tokenAdapter.instantiateToken(tokenAddress, provider);
    setToken(token);
    setLoaded(true);

    token.listenForTransfers((transfer) => {
      dispatchTransfers({
        action: 'ADD',
        transfer,
      });
    });
  }

  async function fetchTransfers() {
    dispatchTransfers({
      action: 'SET',
      transfers: await token.getTransfers() ?? [],
    });
  }

  async function pauseToken(onConfirmation) {
    return token.pause(onConfirmation);
  }

  const value = {
    loaded,
    token,
    transfers,
    loadToken,
    fetchTransfers,
    pauseToken,
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
