import { uploadPicture } from "../middleware/uploadPictureMiddleware";
import User from "../models/User";
import { fileRemover } from "../utils/fileRemover";

export const registerUser = async (req, res, next) => {
  try {
    // get info from body
    const { name, email, password } = req.body;

    // Check if user exists already or not
    let user = await User.findOne({ email });

    // If user exists
    if (user) {
      throw new Error("User is already registered");
    }

    // Create a new user with the info
    user = await User.create({
      name,
      email,
      password,
    });

    // Return the user data created
    return res.status(201).json({
      _id: user._id,
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      verified: user.verified,
      admin: user.admin,
      token: await user.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists already or not
    let user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email not found.");
    }

    if (await user.comparePassword(password)) {
      // Passwords were equal, send back the user data
      return res.status(201).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        verified: user.verified,
        admin: user.admin,
        token: await user.generateJWT(),
      });
    } else {
      throw new Error("Invalid email or password.");
    }
  } catch (error) {
    next(error);
  }
};

export const userProfile = async (req, res, next) => {
  try {
    // We have access to req.user._id by the authMiddleware since we modify the req object with a user object
    let user = await User.findById(req.user._id);

    // if we have a user, send back the user, no token bc the user is already logged in
    if (user) {
      return res.status(201).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        verified: user.verified,
        admin: user.admin,
      });
    } else {
      let err = new Error("User not found.");
      err.statusCode = 404;
      next(err);
    }
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);

    if (!user) {
      throw new Error("User not found.");
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password && req.body.password.length < 6) {
      throw new Error("Password length must be at least 6 characters.");
    } else if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      avatar: updatedUser.avatar,
      name: updatedUser.name,
      email: updatedUser.email,
      verified: updatedUser.verified,
      admin: updatedUser.admin,
      token: await updatedUser.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

export const updateProflePicture = async (req, res, next) => {
  try {
    const upload = uploadPicture.single("profilePicture");

    upload(req, res, async function (err) {
      if (err) {
        const error = new Error(
          "An unknown error occured when uploading" + err.message
        );
        next(error);
      } else {
        // if everything went well, continue process
        if (req.file) {
          let filename;
          let updatedUser = await User.findById(req.user._id);
          filename = updatedUser.avatar;
          if (filename) {
            // avatar isnt empty string, use fileRemover
            // => there was a previous image
            fileRemover(filename);
          }
          updatedUser.avatar = req.file.filename;
          await updatedUser.save();

          res.json({
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            verified: updatedUser.verified,
            admin: updatedUser.admin,
            token: await updatedUser.generateJWT(),
          });
        } else {
          // if req.file is false...
          // so if no file, reset avatar to empty string
          let filename;
          let updatedUser = await User.findById(req.user._id);
          filename = updatedUser.avatar;
          updatedUser.avatar = "";
          // save changes in db
          await updatedUser.save();

          // delete the file that the user uploaded in db, in the uploads folder
          fileRemover(filename);
          res.json({
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            verified: updatedUser.verified,
            admin: updatedUser.admin,
            token: await updatedUser.generateJWT(),
          });
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
