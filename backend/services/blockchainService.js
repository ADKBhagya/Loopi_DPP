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

  const transaction =
    await Transaction.create({

      transactionType,

      entityType,

      entityId,

      garmentId,

      performedBy: user?._id,

      performedRole: user?.role,

      blockchainHash,

      metadata,

    });

  return transaction;
};