const { ethers } = require("hardhat");

async function main() {
  const HelloWorld = await ethers.getContractFactory("HelloWorld");
  const helloWorldContract = await HelloWorld.attach(
    "0xd56909f29d175F45e2ccdDc099abFa78FA3641c9"
  );

  console.log("Current message:", await helloWorldContract.message());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
