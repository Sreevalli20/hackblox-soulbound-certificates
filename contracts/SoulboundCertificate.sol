// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title SoulboundCertificate
 * @dev Non-transferable NFT certificates for academic credentials
 * @custom:security-contact security@hackblox2026.dev
 */
contract SoulboundCertificate is ERC721, ERC721URIStorage, AccessControl {
    // Role definitions
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    // Custom errors
    error CertificateAlreadyRevoked();
    error CertificateNotRevoked();
    error NotAuthorizedIssuer();
    error SoulboundTokenTransferNotAllowed();
    error InvalidRecipient();
    error CertificateDoesNotExist();

    // Certificate structure
    struct CertificateInfo {
        address recipient;
        string recipientName;
        string certificateTitle;
        string courseName;
        string institution;
        uint256 issueDate;
        string grade;
        address issuer;
        bool isRevoked;
        uint256 revocationDate;
        string revocationReason;
    }

    // Issuer structure
    struct IssuerInfo {
        string name;
        string role;
        bool isActive;
        uint256 addedDate;
    }

    // State variables
    uint256 private _nextTokenId;
    mapping(uint256 => CertificateInfo) public certificates;
    mapping(address => IssuerInfo) public issuers;
    mapping(address => uint256[]) private _recipientCertificates;

    // Events
    event CertificateIssued(
        uint256 indexed tokenId,
        address indexed recipient,
        string recipientName,
        address indexed issuer,
        uint256 issueDate
    );
    event CertificateRevoked(
        uint256 indexed tokenId,
        address indexed issuer,
        uint256 revocationDate,
        string reason
    );
    event IssuerAdded(
        address indexed issuer,
        string name,
        string role,
        uint256 addedDate
    );
    event IssuerRemoved(address indexed issuer);
    event IssuerUpdated(
        address indexed issuer,
        string name,
        string role
    );

    /**
     * @dev Constructor to initialize the contract
     * @param name Token name
     * @param symbol Token symbol
     * @param admin Initial admin address
     */
    constructor(
        string memory name,
        string memory symbol,
        address admin
    ) ERC721(name, symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, admin);
        
        // Add admin as initial issuer
        issuers[admin] = IssuerInfo({
            name: "System Administrator",
            role: "University Admin",
            isActive: true,
            addedDate: block.timestamp
        });
        
        emit IssuerAdded(admin, "System Administrator", "University Admin", block.timestamp);
    }

    /**
     * @dev Issue a new certificate to a recipient
     * @param recipient Wallet address of the certificate recipient
     * @param recipientName Full name of the recipient
     * @param certificateTitle Title of the certificate
     * @param courseName Name of the course/program
     * @param institution Name of the issuing institution
     * @param grade Optional grade achieved
     * @param metadataURI URI for certificate metadata (IPFS or other)
     * @return tokenId The ID of the newly minted certificate
     */
    function issueCertificate(
        address recipient,
        string memory recipientName,
        string memory certificateTitle,
        string memory courseName,
        string memory institution,
        string memory grade,
        string memory metadataURI
    ) public onlyRole(ISSUER_ROLE) returns (uint256) {
        if (recipient == address(0)) {
            revert InvalidRecipient();
        }

        uint256 tokenId = _nextTokenId++;
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, metadataURI);

        certificates[tokenId] = CertificateInfo({
            recipient: recipient,
            recipientName: recipientName,
            certificateTitle: certificateTitle,
            courseName: courseName,
            institution: institution,
            issueDate: block.timestamp,
            grade: grade,
            issuer: msg.sender,
            isRevoked: false,
            revocationDate: 0,
            revocationReason: ""
        });

        _recipientCertificates[recipient].push(tokenId);

        emit CertificateIssued(
            tokenId,
            recipient,
            recipientName,
            msg.sender,
            block.timestamp
        );

        return tokenId;
    }

    /**
     * @dev Revoke a certificate (admin or issuer only)
     * @param tokenId ID of the certificate to revoke
     * @param reason Reason for revocation
     */
    function revokeCertificate(
        uint256 tokenId,
        string memory reason
    ) public onlyRole(ISSUER_ROLE) {
        if (_ownerOf(tokenId) == address(0)) {
            revert CertificateDoesNotExist();
        }
        if (certificates[tokenId].isRevoked) {
            revert CertificateAlreadyRevoked();
        }

        certificates[tokenId].isRevoked = true;
        certificates[tokenId].revocationDate = block.timestamp;
        certificates[tokenId].revocationReason = reason;

        emit CertificateRevoked(tokenId, msg.sender, block.timestamp, reason);
    }

    /**
     * @dev Add a new issuer (admin only)
     * @param issuer Address of the new issuer
     * @param name Name of the issuer/institution
     * @param role Role of the issuer (e.g., "Department Issuer")
     */
    function addIssuer(
        address issuer,
        string memory name,
        string memory role
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(ISSUER_ROLE, issuer);
        
        issuers[issuer] = IssuerInfo({
            name: name,
            role: role,
            isActive: true,
            addedDate: block.timestamp
        });

        emit IssuerAdded(issuer, name, role, block.timestamp);
    }

    /**
     * @dev Remove an issuer (admin only)
     * @param issuer Address of the issuer to remove
     */
    function removeIssuer(address issuer) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(ISSUER_ROLE, issuer);
        issuers[issuer].isActive = false;
        emit IssuerRemoved(issuer);
    }

    /**
     * @dev Update issuer information (admin only)
     * @param issuer Address of the issuer to update
     * @param name New name for the issuer
     * @param role New role for the issuer
     */
    function updateIssuer(
        address issuer,
        string memory name,
        string memory role
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        issuers[issuer].name = name;
        issuers[issuer].role = role;
        emit IssuerUpdated(issuer, name, role);
    }

    /**
     * @dev Get certificate information
     * @param tokenId ID of the certificate
     * @return CertificateInfo structure with all certificate details
     */
    function getCertificate(uint256 tokenId) public view returns (CertificateInfo memory) {
        if (_ownerOf(tokenId) == address(0)) {
            revert CertificateDoesNotExist();
        }
        return certificates[tokenId];
    }

    /**
     * @dev Verify if a certificate is valid (not revoked)
     * @param tokenId ID of the certificate to verify
     * @return bool True if certificate is valid, false if revoked
     */
    function verifyCertificate(uint256 tokenId) public view returns (bool) {
        if (_ownerOf(tokenId) == address(0)) {
            return false;
        }
        return !certificates[tokenId].isRevoked;
    }

    /**
     * @dev Get all certificate IDs for a recipient
     * @param recipient Address of the recipient
     * @return uint256[] Array of token IDs owned by the recipient
     */
    function getRecipientCertificates(address recipient) public view returns (uint256[] memory) {
        return _recipientCertificates[recipient];
    }

    /**
     * @dev Check if an address is an authorized issuer
     * @param issuer Address to check
     * @return bool True if address is an authorized issuer
     */
    function isAuthorizedIssuer(address issuer) public view returns (bool) {
        return hasRole(ISSUER_ROLE, issuer) && issuers[issuer].isActive;
    }

    /**
     * @dev Get total number of certificates issued
     * @return uint256 Total certificate count
     */
    function totalCertificates() public view returns (uint256) {
        return _nextTokenId;
    }

    // ========== Soulbound implementation ==========

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        // Only allow minting (from == address(0))
        if (from != address(0) && to != address(0)) {
            revert SoulboundTokenTransferNotAllowed();
        }
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function approve(address, uint256) public pure override(ERC721, IERC721) {
        revert SoulboundTokenTransferNotAllowed();
    }

    function setApprovalForAll(address, bool) public pure override(ERC721, IERC721) {
        revert SoulboundTokenTransferNotAllowed();
    }

    // ========== Required overrides ==========

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
