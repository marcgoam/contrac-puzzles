const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();
    return { game };
  }

  async function getWinner() {
    const threshold = "0x00ffffffffffffffffffffffffffffffffffffff";
    let winner;

    while (!winner) {
      const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
      const addr = await wallet.getAddress();

      if (addr < threshold) {
        winner = addr;

        const [signer] = await ethers.getSigners();
        await signer.sendTransaction({
          to: winner,
          value: ethers.utils.parseEther("1.0"),
        });
        return wallet;
      }
    }
  }

  it("should be a winner", async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    // good luck
    const winner = await getWinner();

    await game.connect(winner).win();

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
