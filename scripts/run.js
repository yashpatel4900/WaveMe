const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WaveMe");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();
  console.log("Contract deployed to:", waveContract.address);

  let waveCount;
  waveCount = await waveContract.showTotalCount();
  console.log("Present waveCount: ", waveCount);

  let waveTxn = await waveContract.waveAtMe("1st Wave, Hiiiii!");
  await waveTxn.wait();
  console.log(waveTxn);

  waveCount = await waveContract.showTotalCount();
  console.log("New waveCount: ", waveCount);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // exit Node process without error
  } catch (error) {
    console.log(error);
    process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
  }
  // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
};

runMain();
