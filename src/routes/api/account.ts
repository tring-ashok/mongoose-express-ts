import { Router, Response } from "express";
import { check, validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";
import { checkRole } from "../../middleware/checkRole";

import auth from "../../middleware/auth";
import Account, { IAccount } from "../../models/Account";
import Request from "../../types/Request";

const router: Router = Router();

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
// router.get("/me", auth, async (req: Request, res: Response) => {
//   try {
//     const profile: IProfile = await Profile.findOne({
//       user: req.userId,
//     }).populate("user", ["avatar", "email"]);
//     if (!profile) {
//       return res.status(HttpStatusCodes.BAD_REQUEST).json({
//         errors: [
//           {
//             msg: "There is no profile for this user",
//           },
//         ],
//       });
//     }

//     res.json(profile);
//   } catch (err) {
//     console.error(err.message);
//     res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
//   }
// });

// @route   POST api/profile
// @desc    Create or update user's profile
// @access  Private
router.post(
  "/",
  [
    auth,
    check("companyName", "Company Name is required").not().isEmpty(),
    check("adminName", "Admin Name is required").not().isEmpty(),
    check("adminEmail", "Admin Email is required").not().isEmpty(),
    check("adminContactNo", "Admin Contact Number is required").not().isEmpty(),
    check("features", "At least one feature should be selected is required").not().isEmpty(),

  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { companyName, adminName, adminEmail, adminContactNo, features } = req.body;

    // Build profile object based on IProfile
    const accountFields = {
      user: req.userId,
      companyName,
      adminName,
      adminEmail,
      adminContactNo,
      features,
      createdBy: req.userId
    };

    try {
      
      let account: IAccount = await Account.findOne({ adminEmail });

      if (account) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "Account already exists"
            }
          ]
        });
      }

      account = new Account(accountFields);

      await account.save();

      res.json({});

    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

// @route   GET api/account
// @desc    Get all accounts
// @access  Public
router.get("/", auth, async (_req: Request, res: Response) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   GET api/account/:accountId
// @desc    Get account by accountId
// @access  Public
router.get("/:accountId", auth, checkRole(["USER"]) , async (req: Request, res: Response) => {
  try {
    const account: IAccount = await Account.findOne({
      _id: req.params.accountId,
    });

    if (!account)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ msg: "Profile not found" });

    res.json(account);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ msg: "Account not found" });
    }
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// @route   DELETE api/profile
// @desc    Delete profile and user
// @access  Private
// router.delete("/", auth, async (req: Request, res: Response) => {
//   try {
//     // Remove profile
//     await Profile.findOneAndRemove({ user: req.userId });
//     // Remove user
//     await User.findOneAndRemove({ _id: req.userId });

//     res.json({ msg: "User removed" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
//   }
// });

export default router;
