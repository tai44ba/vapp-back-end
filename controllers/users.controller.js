import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Verify from "../models/verify.tokens.model.js";
import { createError, generateVerificationToken } from "../utils/helper.js";
import { createToken } from "../utils/jwt.js";

export const register = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;
    const newUser = await User.create({ fullname, email, password });
    const verifyToken = await generateVerificationToken(newUser);

    res.json({ msg: "register succeeded", user: newUser });
  } catch (error) {
    next(error);
  }
};

export const verifyAccount = async (req, res, next) => {
  try {
    const token = req.params.vToken;
    const userId = req.params.uid;
    const verified = await Verify.findOne({ token, userId });

    if (!verified) throw createError("Verify link is not valid.", 401);

    // find a user and activate him/her
    const findUser = await User.findById(userId);
    if (!findUser) {
      throw createError("User already deleted!", 401);
    }
    findUser.isActive = true;
    await findUser.save();

    res.json({ status: "verify-account-success" });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw createError("Email or Password is not correct", 401);

    // compare password
    if (!(await user.comparePass(password)))
      throw createError("Email or Password is not correct", 401);

    // remove un-necessary data from user object
    user.__v = undefined;
    user.password = undefined;
    user.role = undefined;
    user.register_at = undefined;
    user.pass_changed_at = undefined;
    user.is_activated = undefined;

    // create jwt token
    const token = await createToken(
      { userid: user._id, fullname: user.fullname },
      process.env.JWT_SECRET
    );

    // set cookie
    res
      .cookie("token", token, {
        expiresIn: new Date(Date.now() + 3_600_000 * 24),
        httpOnly: true,
      })
      .json({ status: "login-success", user });
  } catch (error) {
    next(error);
  }
};
