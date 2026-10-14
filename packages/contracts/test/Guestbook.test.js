import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("Guestbook", () => {
  it("should deploy successfully", async () => {
    const Guestbook = await ethers.getContractFactory("Guestbook");
    const guestbook = await Guestbook.deploy();
    expect(await guestbook.getAddress()).to.be.properAddress;
  });
});
