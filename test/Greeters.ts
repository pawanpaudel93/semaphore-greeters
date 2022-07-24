import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
import { generateProof, packToSolidityProof } from "@semaphore-protocol/proof";
import identityCommitments from "../static/identityCommitments.json";
import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { deployments, ethers } from "hardhat";

describe("Greeters", () => {
  let contract: Contract;
  let signers: Signer[];

  before(async () => {
    await deployments.fixture(["all"]);
    contract = await ethers.getContract("Greeters");
    signers = await ethers.getSigners();
  });

  describe("# greet", () => {
    const wasmFilePath = "./static/semaphore.wasm"
    const zkeyFilePath = "./static/semaphore.zkey"

    it("Should greet", async () => {
      const greeting = "Hello, world!";
      const bytes32Greeting = ethers.utils.formatBytes32String(greeting);
      const message = await signers[0].signMessage("Sign this message to create your identity!");
      const identity = new Identity(message);

      const group = new Group();
      group.addMembers(identityCommitments);

      const fullProof = await generateProof(
        identity, group, group.root, greeting, {
        wasmFilePath, zkeyFilePath
      });
      const solidityProof = packToSolidityProof(fullProof.proof);

      const transaction = contract.greet(
        bytes32Greeting,
        fullProof.publicSignals.nullifierHash,
        solidityProof
      )

      await expect(transaction).to.emit(contract, "NewGreeting").withArgs(bytes32Greeting);
    })

    it("Should not greet twice", async () => {
      const greeting = "Hello, world!";
      const bytes32Greeting = ethers.utils.formatBytes32String(greeting);
      const message = await signers[0].signMessage("Sign this message to create your identity!");
      const identity = new Identity(message);

      const group = new Group();
      group.addMembers(identityCommitments);

      const fullProof = await generateProof(
        identity, group, group.root, greeting, {
        wasmFilePath, zkeyFilePath
      });
      const solidityProof = packToSolidityProof(fullProof.proof);

      const transaction = contract.greet(
        bytes32Greeting,
        fullProof.publicSignals.nullifierHash,
        solidityProof
      )

      await expect(transaction).to.be.revertedWith("SemaphoreCore: you cannot use the same nullifier twice");
    })
  })
});  