const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PTISettlementRouter", function () {
  let router;
  let admin, proposer, payee, unapproved;

  beforeEach(async function () {
    [admin, proposer, payee, unapproved] = await ethers.getSigners();
    const PTISettlementRouter = await ethers.getContractFactory("PTISettlementRouter");
    router = await PTISettlementRouter.deploy(admin.address, proposer.address);
    await router.waitForDeployment();

    // Fund router
    await admin.sendTransaction({
      to: await router.getAddress(),
      value: ethers.parseEther("10.0"),
    });
  });

  it("should allow propose -> approve -> execute flow for allowlisted payee", async function () {
    const payoutLimit = ethers.parseEther("5.0");
    await router.connect(admin).setPayeeStatus(payee.address, true, payoutLimit);

    const batchId = ethers.keccak256(ethers.toUtf8Bytes("batch_001"));
    const payoutAmount = ethers.parseEther("1.0");

    await router.connect(proposer).proposeBatch(
      batchId,
      "ERP-INV-2026-001",
      payee.address,
      payoutAmount
    );

    await router.connect(admin).approveBatch(batchId);

    const initialBalance = await ethers.provider.getBalance(payee.address);
    await router.connect(admin).executeBatch(batchId);
    const finalBalance = await ethers.provider.getBalance(payee.address);

    expect(finalBalance - initialBalance).to.equal(payoutAmount);
  });

  it("should reject unapproved payee proposals", async function () {
    const batchId = ethers.keccak256(ethers.toUtf8Bytes("batch_unapproved"));
    await expect(
      router.connect(proposer).proposeBatch(
        batchId,
        "ERP-INV-INVALID",
        unapproved.address,
        ethers.parseEther("1.0")
      )
    ).to.be.revertedWith("Payee not on approved allowlist");
  });
});
