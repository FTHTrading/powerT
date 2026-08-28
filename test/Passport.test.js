const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PTICredentialPassport", function () {
  let passport;
  let admin, issuer, member, attacker;

  beforeEach(async function () {
    [admin, issuer, member, attacker] = await ethers.getSigners();
    const PTICredentialPassport = await ethers.getContractFactory("PTICredentialPassport");
    passport = await PTICredentialPassport.deploy(admin.address, issuer.address);
    await passport.waitForDeployment();
  });

  it("should allow issuer to issue a non-transferable passport", async function () {
    const credHash = ethers.keccak256(ethers.toUtf8Bytes("member_identity_123"));
    await passport.connect(issuer).issuePassport(
      member.address,
      3, // Founder
      365, // 1 year
      credHash,
      1000, // 10%
      true // Concierge
    );

    const isValid = await passport.isValidMember(member.address);
    expect(isValid).to.equal(true);
  });

  it("should prevent unauthorized issuance", async function () {
    const credHash = ethers.keccak256(ethers.toUtf8Bytes("attacker_attempt"));
    await expect(
      passport.connect(attacker).issuePassport(
        attacker.address,
        1,
        30,
        credHash,
        0,
        false
      )
    ).to.be.revertedWith("PTICredentialPassport: unauthorized");
  });

  it("should strictly revert any transfer attempts (Soulbound)", async function () {
    const credHash = ethers.keccak256(ethers.toUtf8Bytes("member_identity_123"));
    await passport.connect(issuer).issuePassport(member.address, 2, 365, credHash, 500, false);

    await expect(
      passport.connect(member).transferFrom(member.address, attacker.address, 1)
    ).to.be.revertedWith("PTICredentialPassport: SOULBOUND_CREDENTIAL_NON_TRANSFERABLE");
  });

  it("should support controlled account recovery by admin", async function () {
    const oldHash = ethers.keccak256(ethers.toUtf8Bytes("old_id"));
    const newHash = ethers.keccak256(ethers.toUtf8Bytes("new_id"));
    const newWallet = attacker; // simulating new member wallet

    await passport.connect(issuer).issuePassport(member.address, 3, 365, oldHash, 1000, true);

    await passport.connect(admin).recoverPassport(member.address, newWallet.address, newHash);

    expect(await passport.isValidMember(member.address)).to.equal(false);
    expect(await passport.isValidMember(newWallet.address)).to.equal(true);
  });
});
