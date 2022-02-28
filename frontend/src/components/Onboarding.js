import React from "react";
import MetaMaskOnboarding from "@metamask/onboarding";

// Avalanche Network information for automatic onboarding in MetaMask
const AVALANCHE_MAINNET_PARAMS = {
  chainId: "0xA86A",
  chainName: "Avalanche Mainnet C-Chain",
  nativeCurrency: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
  blockExplorerUrls: ["https://snowtrace.io/"],
};
const AVALANCHE_TESTNET_PARAMS = {
  chainId: "0xA869",
  chainName: "Avalanche Testnet C-Chain",
  nativeCurrency: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
  blockExplorerUrls: ["https://testnet.snowtrace.io/"],
};

// This code uses the Avalanche Test Network. If you want to use the main network, simply
// change this to AVALANCHE_MAINNET_PARAMS
const AVALANCHE_NETWORK_PARAMS = AVALANCHE_TESTNET_PARAMS;

// Check if the chain id is the selected Avalanche chain id
const isAvalancheChain = (chainId) =>
  chainId &&
  chainId.toLowerCase() === AVALANCHE_NETWORK_PARAMS.chainId.toLowerCase();

export class OnboardingButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accounts: [],
      chainId: null,
      onboarding: new MetaMaskOnboarding(),
    };

    this.connectMetamask = this.connectMetamask.bind(this);
    this.switchToAvalancheChain = this.switchToAvalancheChain.bind(this);
  }

  componentDidMount() {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      this.connectMetamask();

      // Update the list of accounts if the user switches accounts in MetaMask
      window.ethereum.on("accountsChanged", (accounts) =>
        this.setState({ accounts })
      );

      // Reload the site if the user selects a different chain
      window.ethereum.on("chainChanged", () => window.location.reload());

      // Set the chain id once the MetaMask wallet is connected
      window.ethereum.on("connect", (connectInfo) => {
        const chainId = connectInfo.chainId;
        this.setState({ chainId });
        if (isAvalancheChain(chainId)) {
          // The user is now connected to the MetaMask wallet and has the correct
          // Avalanche chain selected.
          this.props.onConnected();
        }
      });
    }
  }

  connectMetamask() {
    // Request to connect to the metamask wallet
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => this.setState({ accounts }));
  }

  switchToAvalancheChain() {
    // Request to switch to the selected Avalanche network
    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [AVALANCHE_TESTNET_PARAMS],
    });
  }

  render() {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (this.state.accounts.length > 0) {
        // If the user is connected to Metamask, stop the onboarding process
        this.state.onboarding.stopOnboarding();
      }
    }

    if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
      // If Metamask is not yet installed, ask the user to start the Metamask Onboarding process
      // install the metamask browser extension
      return (
        <div>
          <div>To run this dApp you need the Metamask Wallet installed.</div>
          <button onClick={this.state.onboarding.startOnboarding}>
            Install Metamask
          </button>
        </div>
      );
    } else if (this.state.accounts.length === 0) {
      // If accounts is empty the user is not yet connected to the Metamask wallet
      // Ask the user to connect to MetaMask.
      return (
        <div>
          <div>To run this dApp you need to connect your MetaMask Wallet</div>
          <button onClick={this.connectMetamask}>Connect your wallet</button>
        </div>
      );
    } else if (!isAvalancheChain(this.state.chainId)) {
      // If the selected chain id is not the Avalanche chain id, ask the user to switch network to Avalanche
      return (
        <div>
          <div>Metamask Wallet connected!</div>
          <div>Chain: {this.state.chainId}</div>
          <div>Account: {this.state.accounts[0]}</div>
          <div>
            To run this dApp you need to switch to the{" "}
            {AVALANCHE_MAINNET_PARAMS.chainName} chain
          </div>
          <button onClick={this.switchToAvalancheChain}>
            Switch to the {AVALANCHE_NETWORK_PARAMS.chainName} chain
          </button>
        </div>
      );
    } else {
      // The user is connected to the Metamask wallet and has the Avalanche chain selected.
      return (
        <div>
          <div>Metamask wallet connected!</div>
          <div>Chain: {this.state.chainId}</div>
          <div>Account: {this.state.accounts[0]}</div>
        </div>
      );
    }
  }
}
