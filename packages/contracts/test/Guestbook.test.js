const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Guestbook", () => {
  it("should deploy successfully", async () => {
    const Guestbook = await ethers.getContractFactory("Guestbook");
    const guestbook = await Guestbook.deploy();
    expect(await guestbook.getAddress()).to.be.properAddress;
  });
});
