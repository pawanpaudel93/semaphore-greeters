import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { Group } from "@semaphore-protocol/group";
import identityCommitments from "../static/identityCommitments.json";
import { BigNumber } from 'ethers';

const deployGreeters: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, network, run } = hre;
    const { deploy, log } = hre.deployments;
    const { deployer } = await getNamedAccounts();
    const isDevelopmentEnvironment = network.name === 'hardhat' || network.name === 'localhost';
    const Verifier = await hre.ethers.getContract("Verifier20");

    const group = new Group();
    group.addMembers(identityCommitments);

    const args = [BigNumber.from(group.root.toString()), Verifier.address];
    const Greeters = await deploy("Greeters", {
        from: deployer,
        log: true,
        args,
        waitConfirmations: isDevelopmentEnvironment ? 0 : 1,
    });
    log(`Greeters contract has been deployed to: ${Greeters.address}`)
    if (!isDevelopmentEnvironment) {
        log(`Verifying Greeters at ${Greeters.address}...`);
        await run("verify:verify", {
            address: Greeters.address,
            constructorArguments: args,
        });
    }
};
export default deployGreeters;
deployGreeters.tags = ["all", 'Greeters'];