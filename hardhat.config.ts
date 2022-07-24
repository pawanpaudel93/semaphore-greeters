import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import "hardhat-dependency-compiler";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      }
    }
  },
  dependencyCompiler: {
    /** Allows Hardhat to compile the external Verifier.sol contract. */
    paths: ["@semaphore-protocol/contracts/verifiers/Verifier20.sol"]
  },
  defaultNetwork: "hardhat",
  // networks: {
  //   polygon: {
  //     url: "https://rpc.ankr.com/polygon",
  //     accounts: [process.env.PRIVATE_KEY!],
  //   },
  //   mumbai: {
  //     url: "https://rpc.ankr.com/polygon_mumbai",
  //     accounts: [process.env.PRIVATE_KEY!],
  //   }
  // },
  namedAccounts: {
    deployer: {
      default: 0,
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  // etherscan: {
  //   apiKey: {
  //     polygon: process.env.POLYGONSCAN_API_KEY!,
  //     polygonMumbai: process.env.POLYGONSCAN_API_KEY!,
  //   },
  // },
};

export default config;
