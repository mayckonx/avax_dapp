const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HelloWorld contract", function () {
  it("Deployment should set the inital message", async function () {
    const [owner] = await ethers.getSigners();
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    const initialMessage = "Hello World!";
    const helloWorldContract = await HelloWorld.deploy(initialMessage);

    expect(await helloWorldContract.message()).to.equal(initialMessage);
  });

  it("Updating overwrites the message", async function () {
    const [owner, user1, user2] = await ethers.getSigners();
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    const helloWorldContract = await HelloWorld.deploy("I'm first");

    const user1Message = "This is user 1";
    await helloWorldContract.connect(user1).update(user1Message);
    expect(await helloWorldContract.message()).to.equal(user1Message);

    const user2Message = "This is user 2";
    await helloWorldContract.connect(user2).update(user2Message);
    expect(await helloWorldContract.message()).to.equal(user2Message);
  });
});
