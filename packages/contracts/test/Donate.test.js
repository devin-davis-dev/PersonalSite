const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Donate", () => {
  it("should deploy successfully", async () => {
    const Donate = await ethers.getContractFactory("Donate");
    const donate = await Donate.deploy();
    expect(await donate.getAddress()).to.be.properAddress;
  });
});
