const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PTICreditReceipt", function () {
  let creditReceipt;
  let admin, relayer, member;

  beforeEach(async function () {
    [admin, relayer, member] = await ethers.getSigners();
    const PTICreditReceipt = await ethers.getContractFactory("PTICreditReceipt");
    creditReceipt = await PTICreditReceipt.deploy(admin.address, relayer.address);
    await creditReceipt.waitForDeployment();
  });

  it("should log issuance receipt with idempotency protection", async function () {
    const orderHash = ethers.keccak256(ethers.toUtf8Bytes("stripe_pi_123456789"));
    
    await expect(
      creditReceipt.connect(relayer).logIssuanceReceipt(
        member.address,
        orderHash,
        250,
        "CEO-SUMMIT-2026-FTL"
      )
    ).to.emit(creditReceipt, "CreditIssuanceReceiptLogged");

    // Idempotency check: replay attempt must revert
    await expect(
      creditReceipt.connect(relayer).logIssuanceReceipt(
        member.address,
        orderHash,
        250,
        "CEO-SUMMIT-2026-FTL"
      )
    ).to.be.revertedWith("PTICreditReceipt: order already processed (idempotency key match)");
  });

  it("should log redemption receipts", async function () {
    const redemptionHash = ethers.keccak256(ethers.toUtf8Bytes("redemption_rec_999"));
    
    await expect(
      creditReceipt.connect(relayer).logRedemptionReceipt(
        member.address,
        redemptionHash,
        250,
        "CEO-SUMMIT-2026-FTL"
      )
    ).to.emit(creditReceipt, "CreditRedemptionReceiptLogged");
  });
});
