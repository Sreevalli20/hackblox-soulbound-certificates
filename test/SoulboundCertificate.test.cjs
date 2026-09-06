const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SoulboundCertificate", function () {
  this.timeout(30000);
  let contract;
  let owner;
  let issuer;
  let recipient;
  let unauthorized;

  const CONTRACT_NAME = "Soulbound Certificate";
  const CONTRACT_SYMBOL = "SBC";

  beforeEach(async function () {
    [owner, issuer, recipient, unauthorized] = await ethers.getSigners();

    const SoulboundCertificate = await ethers.getContractFactory("SoulboundCertificate");
    contract = await SoulboundCertificate.deploy(
      CONTRACT_NAME,
      CONTRACT_SYMBOL,
      owner.address
    );
    await contract.waitForDeployment();
  });

  // Helper function to issue a certificate - reduces code duplication
  async function issueTestCertificate() {
    await contract.issueCertificate(
      recipient.address,
      "Kommavarapu Kanmeswari Sreevalli",
      "Test Certificate",
      "Test Course",
      "Test Institution",
      "A",
      "ipfs://QmTest"
    );
  }

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await contract.name()).to.equal(CONTRACT_NAME);
      expect(await contract.symbol()).to.equal(CONTRACT_SYMBOL);
    });

    it("Should grant DEFAULT_ADMIN_ROLE to deployer", async function () {
      const DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
      expect(await contract.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should grant ISSUER_ROLE to deployer", async function () {
      const ISSUER_ROLE = await contract.ISSUER_ROLE();
      expect(await contract.hasRole(ISSUER_ROLE, owner.address)).to.be.true;
    });

    it("Should register deployer as initial issuer", async function () {
      const issuerInfo = await contract.issuers(owner.address);
      expect(issuerInfo.name).to.equal("System Administrator");
      expect(issuerInfo.role).to.equal("University Admin");
      expect(issuerInfo.isActive).to.be.true;
    });
  });

  describe("Certificate Issuance", function () {
    it("Should allow authorized issuer to mint certificate", async function () {
      const certificateData = {
        recipient: recipient.address,
        recipientName: "Kommavarapu Kanmeswari Sreevalli",
        certificateTitle: "Blockchain Development Certificate",
        courseName: "Advanced Web3 Development",
        institution: "HackBlox University",
        grade: "A",
        metadataURI: "ipfs://QmTest123"
      };

      await contract.issueCertificate(
        certificateData.recipient,
        certificateData.recipientName,
        certificateData.certificateTitle,
        certificateData.courseName,
        certificateData.institution,
        certificateData.grade,
        certificateData.metadataURI
      );
      
      expect(await contract.ownerOf(0)).to.equal(certificateData.recipient);
    });

    it("Should store certificate data correctly", async function () {
      const certificateData = {
        recipient: recipient.address,
        recipientName: "Kommavarapu Kanmeswari Sreevalli",
        certificateTitle: "Blockchain Development Certificate",
        courseName: "Advanced Web3 Development",
        institution: "HackBlox University",
        grade: "A",
        metadataURI: "ipfs://QmTest123"
      };

      await contract.issueCertificate(
        certificateData.recipient,
        certificateData.recipientName,
        certificateData.certificateTitle,
        certificateData.courseName,
        certificateData.institution,
        certificateData.grade,
        certificateData.metadataURI
      );

      const certInfo = await contract.getCertificate(0);
      expect(certInfo.recipient).to.equal(certificateData.recipient);
      expect(certInfo.recipientName).to.equal(certificateData.recipientName);
      expect(certInfo.certificateTitle).to.equal(certificateData.certificateTitle);
      expect(certInfo.courseName).to.equal(certificateData.courseName);
      expect(certInfo.institution).to.equal(certificateData.institution);
      expect(certInfo.grade).to.equal(certificateData.grade);
      expect(certInfo.issuer).to.equal(owner.address);
      expect(certInfo.isRevoked).to.be.false;
    });

    it("Should not allow unauthorized address to mint", async function () {
      const certificateData = {
        recipient: recipient.address,
        recipientName: "Kommavarapu Kanmeswari Sreevalli",
        certificateTitle: "Blockchain Development Certificate",
        courseName: "Advanced Web3 Development",
        institution: "HackBlox University",
        grade: "A",
        metadataURI: "ipfs://QmTest123"
      };

      await expect(
        contract.connect(unauthorized).issueCertificate(
          certificateData.recipient,
          certificateData.recipientName,
          certificateData.certificateTitle,
          certificateData.courseName,
          certificateData.institution,
          certificateData.grade,
          certificateData.metadataURI
        )
      ).to.be.reverted;
    });

    it("Should not allow minting to zero address", async function () {
      await expect(
        contract.issueCertificate(
          "0x0000000000000000000000000000000000000000",
          "Kommavarapu Kanmeswari Sreevalli",
          "Blockchain Development Certificate",
          "Advanced Web3 Development",
          "HackBlox University",
          "A",
          "ipfs://QmTest123"
        )
      ).to.be.revertedWithCustomError(contract, "InvalidRecipient");
    });
  });

  describe("Soulbound Behavior", function () {
    beforeEach(async function () {
      await issueTestCertificate();
    });

    it("Should not allow transferFrom", async function () {
      await expect(
        contract.connect(recipient).transferFrom(recipient.address, unauthorized.address, 0)
      ).to.be.revertedWithCustomError(contract, "SoulboundTokenTransferNotAllowed");
    });

    it("Should not allow approve", async function () {
      await expect(
        contract.connect(recipient).approve(unauthorized.address, 0)
      ).to.be.revertedWithCustomError(contract, "SoulboundTokenTransferNotAllowed");
    });

    it("Should not allow setApprovalForAll", async function () {
      await expect(
        contract.connect(recipient).setApprovalForAll(unauthorized.address, true)
      ).to.be.revertedWithCustomError(contract, "SoulboundTokenTransferNotAllowed");
    });
  });

  describe("Certificate Revocation", function () {
    beforeEach(async function () {
      await issueTestCertificate();
    });

    it("Should allow issuer to revoke certificate", async function () {
      await contract.revokeCertificate(0, "Academic dishonesty");
      
      const certInfo = await contract.getCertificate(0);
      expect(certInfo.isRevoked).to.be.true;
      expect(certInfo.revocationReason).to.equal("Academic dishonesty");
    });

    it("Should not allow double revocation", async function () {
      await contract.revokeCertificate(0, "First revocation");
      
      await expect(
        contract.revokeCertificate(0, "Second revocation")
      ).to.be.revertedWithCustomError(contract, "CertificateAlreadyRevoked");
    });
  });

  describe("Certificate Verification", function () {
    it("Should verify valid certificate as true", async function () {
      await issueTestCertificate();
      expect(await contract.verifyCertificate(0)).to.be.true;
    });

    it("Should verify revoked certificate as false", async function () {
      await issueTestCertificate();
      await contract.revokeCertificate(0, "Test");
      expect(await contract.verifyCertificate(0)).to.be.false;
    });

    it("Should return false for non-existent certificate", async function () {
      expect(await contract.verifyCertificate(999)).to.be.false;
    });
  });
});
