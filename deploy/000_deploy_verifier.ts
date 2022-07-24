import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const deployVerifier: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, network, run } = hre;
    const { deploy, log } = hre.deployments;
    const { deployer } = await getNamedAccounts();
    const isDevelopmentEnvironment = network.name === 'hardhat' || network.name === 'localhost';
    const Verifier = await deploy("Verifier20", {
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: isDevelopmentEnvironment ? 0 : 1,
    });
    log(`Verifier contract has been deployed to: ${Verifier.address}`)
    if (!isDevelopmentEnvironment) {
        log(`Verifying Verifier at ${Verifier.address}...`);
        await run("verify:verify", {
            address: Verifier.address,
            constructorArguments: [],
        });
    }
};
export default deployVerifier;
deployVerifier.tags = ["all", 'Verifier'];