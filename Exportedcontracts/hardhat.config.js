require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  
  networks: {
    // ...

    arbitrumSepolia : {
      chainId: 421614,
      ethNetwork: "arbitrum sepolia",
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }

    // hardhat: {
    //   zksync: true,
    // },
  },
  // etherscan: {
  //   apiKey: '6J51DB27K1QJJQ6JBU2DZGVJD5AFQVAHQV', // Required if you want to verify on Ethereum
  // },
};