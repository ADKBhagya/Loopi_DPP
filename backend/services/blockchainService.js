import crypto from "crypto";

import Transaction
from "../models/Transaction.js";

export const createBlockchainTransaction =
async ({

  transactionType,
  entityType,
  entityId,
  garmentId,
  user,
  metadata = {},

}) => {

  const blockchainHash =
    crypto
      .createHash("sha256")
      .update(
        `${transactionType}-${entityId}-${Date.now()}`
      )
      .digest("hex");

  const network =
    process.env.BLOCKCHAIN_NETWORK || "Polygon Amoy Testnet";
  const chainId =
    Number(process.env.BLOCKCHAIN_CHAIN_ID || 80002);
  const contractAddress =
    process.env.DPP_CONTRACT_ADDRESS || "";
  const explorerBase =
    process.env.BLOCKCHAIN_EXPLORER_URL || "https://amoy.polygonscan.com/tx";
  const explorerUrl =
    explorerBase && blockchainHash ? `${explorerBase.replace(/\/$/, "")}/${blockchainHash}` : "";

  const transaction =
    await Transaction.create({

      transactionType,

      entityType,

      entityId,

      garmentId,

      performedBy: user?._id,

      performedRole: user?.role,

      blockchainHash,

      network,

      chainId,

      contractAddress,

      explorerUrl,

      metadata,

    });

  return transaction;
};
