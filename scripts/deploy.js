const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const test = await hre.ethers.getContractFactory("tester");
  const testerContract = await test.deploy();
  await testerContract.deployed();
  console.log("nftMarketplace deployed to:", testerContract.address);

  fs.writeFileSync('./config.js', `
  export const testerAddress = "${testerContract.address}"
  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
