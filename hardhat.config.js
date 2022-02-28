require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
const { AVAX_PRIVATE_KEY } = process.env;

const AVAX_TEST_PRIVATE_KEY = AVAX_PRIVATE_KEY;
const AVAX_MAIN_PRIVATE_KEY = AVAX_PRIVATE_KEY;

module.exports = {
  solidity: "0.7.3",
  networks: {
    avalancheTest: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: [`0x${AVAX_TEST_PRIVATE_KEY}`],
    },
    avalancheMain: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43114,
      accounts: [`0x${AVAX_MAIN_PRIVATE_KEY}`],
    },
  },
};
