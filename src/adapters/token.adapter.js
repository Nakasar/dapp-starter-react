import { ethers } from "ethers";
import TREX from '@tokenysolutions/t-rex';

class Token {
  static async instantiate(address, provider) {
    const tokenContract = new ethers.Contract(
      address,
      TREX.interfaces.IToken.abi,
      provider,
    );

    const token = new Token({ tokenContract });
    await token.loadName();

    return token;
  }

  async loadName() {
    this.name = await this.contract.name();
  }

  async getTransfers() {
    const currentBlock = await this.contract.provider.getBlock();
    const transfers = await this.contract.queryFilter('Transfer', currentBlock.number - 20);

    return transfers;
  }

  listenForTransfers(callback) {
    this.contract.on('Transfer', (from, to, value, event) => {
      console.log(event)
      callback(event);
    });
  }

  async pause(onConfirmation) {
    const signer = this.contract.provider.getSigner();
    const contractWithSigner = this.contract.connect(signer);
    const transaction = await contractWithSigner.pause();

    transaction.wait().then(() => {
      onConfirmation();
    });

    return transaction;
  }

  constructor({ tokenContract }) {
    this.contract = tokenContract;
    this.address = tokenContract.address;
  }
}

class TokenAdapter {
  async getTokenName(address, provider) {
    const tokenContract = new ethers.Contract(
      address,
      TREX.interfaces.IToken.abi,
      provider,
    );

    return tokenContract.name();
  }

  async instantiateToken(address, provider) {
    return Token.instantiate(address, provider);
  }
}

export default TokenAdapter;
