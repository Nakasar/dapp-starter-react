import {Button, Container, TextField} from "@material-ui/core";
import {useEffect, useState} from "react";

import {useToken} from "../contexts/token.context";
import {useWeb3} from "../contexts/web3.context";

function Token() {
  const web3 = useWeb3();
  const tokenContext = useToken();

  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenTransfersLoaded, setTokenTransfersLoaded] = useState(false);
  const [tokenPausing, setTokenPausing] = useState(null);

  useEffect(() => {
    if (tokenContext.loaded) {
      fetchTokenTransfers();
    }
  }, [tokenContext.loaded, tokenContext.token?.address])

  async function loadToken(event) {
    event.preventDefault();

    await tokenContext.loadToken(tokenAddress, web3.provider);
  }

  async function fetchTokenTransfers() {
    await tokenContext.fetchTransfers();
    setTokenTransfersLoaded(true);
  }

  async function pauseToken() {
    const pausingTransaction = await tokenContext.pauseToken(() => {
      setTokenPausing(null);
    });
    setTokenPausing({
      transactionHash: pausingTransaction.hash,
    });
  }

  if (!tokenContext.loaded) {
    return (
      <Container>
        <h2>Load a token</h2>

        <form onSubmit={loadToken}>
          <TextField id="token-address" label="Token address" variant="outlined" value={tokenAddress} onChange={event => setTokenAddress(event.target.value)} />

          <Button variant="contained" color="primary" type="submit">Load token</Button>
        </form>
      </Container>
    )
  }

  return (
    <Container>
      <p>Token at {tokenContext.token.address} (name: {tokenContext.token.name})</p>

      {tokenPausing ? <div>
        <Button variant="contained" color="primary" disabled>Pausing token...</Button>
        hash: {tokenPausing.transactionHash}
      </div>: <Button variant="contained" color="primary" onClick={pauseToken}>Pause token</Button>}

      {tokenTransfersLoaded ? <div>
        <table>
          {tokenContext.transfers.map(transfer => (
            <tr>
              <td>{transfer.event}</td>
              <td>{transfer.transactionHash}</td>
              <td>{transfer.args.value.toString()}</td>
            </tr>
          ))}
        </table>
      </div> : <p>Loading transfers...</p>}
    </Container>
  );
}

export default Token;
