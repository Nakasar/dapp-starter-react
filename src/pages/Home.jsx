import {Container} from "@material-ui/core";
import {useWeb3} from "../contexts/web3.context";

function Home() {
  const wallet = useWeb3();

  return (
    <Container>
      <h1>dApp starter kit</h1>

      {wallet.loaded ?
        <div>
          <p>Connecté avec le wallet {wallet.walletAddress}.</p>
        </div>
        : <p>Vous devez connecter un wallet.</p>
      }
    </Container>
  );
}

export default Home;
