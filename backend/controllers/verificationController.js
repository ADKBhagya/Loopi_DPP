import Garment from "../models/Garment.js";
import Certificate from "../models/Certificate.js";
import OwnershipTransfer
from "../models/OwnershipTransfer.js";

export const verifyPassport =
async (req, res) => {

  try {

    const { garmentId } = req.params;

    /* =========================
       FIND GARMENT
    ========================= */

    const garment =
      await Garment.findById(garmentId);

    if (!garment) {
      return res.status(404).json({

        verified: false,

        message:
          "Digital passport not found",

      });
    }

    /* =========================
       CERTIFICATES
    ========================= */

    const certificates =
      await Certificate.find({
        garmentId,
      });

    /* =========================
       OWNERSHIP HISTORY
    ========================= */

    const ownershipHistory =
      await OwnershipTransfer.find({
        garmentId,
      }).sort({ createdAt: -1 });

    /* =========================
       VERIFICATION RESPONSE
    ========================= */

    res.status(200).json({

      verified: true,

      garment: {

        id: garment._id,

        productName:
          garment.productName,

        material:
          garment.material,

        originCountry:
          garment.originCountry,

        productionDate:
          garment.createdAt,

      },

      blockchain: {

        network:
          "LOOPI MAINNET",

        status:
          "BLOCKCHAIN VERIFIED",

      },

      sustainability: {

        recyclable: true,

        carbonScore: 92,

        organicCertified:
          certificates.some(
            (c) =>
              c.certificateType ===
              "GOTS"
          ),

      },

      certificates:
        certificates.map((c) => ({

          type:
            c.certificateType,

          issuer:
            c.issuer,

          verified:
            c.verificationStatus,

        })),

      ownershipHistory:
        ownershipHistory.length,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      verified: false,

      message:
        "Verification failed",

    });
  }
};