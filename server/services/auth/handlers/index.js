const {
  create,
  read,
  readByUsername,
  readByEmail,
  update,
  changePassword,
  remove,
  readByID,
} = require("../../../pkg/users"); // Import user-related database operations

const {
  UserRegister,
  UserLogin,
  UserRequestResetPassword,
  UserResetPassword,
} = require("../../../pkg/users/validate"); // Import validation schemas for user operations

const { validate } = require("../../../pkg/validator"); // Import validation utility
const config = require("../../../pkg/config").get; // Import configuration utility
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Import JWT for token generation and verification
const secret = config("JWT_SECRET"); // JWT secret for access tokens
const refreshSecret = config("REFRESH_JWT_SECRET"); // JWT secret for refresh tokens

const {
  welcomeTemplate,
  resetTemplate,
  sendMail,
} = require("../../../pkg/mailer"); // Import mailer utilities for sending emails

// Token expiration times
const TOKEN_EXPIRE_SECONDS = 1800000; // 30 minutes in milliseconds
const TOKEN_EXPIRE_TIME = "30min"; // 30 minutes in string format for JWT
const REFRESH_TOKEN_EXPIRE_SECONDS = 86400000; // 24 hours in milliseconds
const REFRESH_TOKEN_EXPIRE_TIME = "24h"; // 24 hours in string format for JWT

// Handler for user registration
const registerHandler = async (req, res) => {
  try {
    await validate(req.body, UserRegister); // Validate request body against UserRegister schema
    const { email } = req.body;

    // Check if email is already in use
    if (await readByEmail(email))
      throw {
        code: 409,
        error: "email already in use",
      };

    // Ensure password meets minimum length requirement
    if (req.body.password.length < 8)
      throw {
        code: 409,
        error: "The password must be at least 8 characters long",
      };

    // Hash the password before storing it
    req.body.password = await bcrypt.hash(
      req.body.password,
      parseInt(config("HASHING_SALT"))
    );

    // Create the user in the database
    const user = await create(req.body);

    // Prepare payload for JWT
    const payload = {
      name: user.name,
      lastName: user.lastName,
      email: email,
      id: user._id,
    };

    // Generate access and refresh tokens
    const token = await jwt.sign(payload, secret, {
      expiresIn: TOKEN_EXPIRE_TIME,
    });
    const refreshToken = await jwt.sign(payload, refreshSecret, {
      expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
    });

    // Send welcome email
    sendMail(email, "Welcome To Our Platform", welcomeTemplate(user.name));

    // Set cookies for tokens
    await res.cookie("token", token, {
      expires: new Date(Date.now() + TOKEN_EXPIRE_SECONDS),
      httpOnly: true,
      secure: true,
    });

    return await res
      .cookie("refreshToken", refreshToken, {
        expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRE_SECONDS),
        httpOnly: true,
        secure: true,
      })
      .json({ success: true, userData: payload });
  } catch (err) {
    // Handle errors
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

// Handler for user login
const loginHandler = async (req, res) => {
  try {
    await validate(req.body, UserLogin); // Validate request body against UserLogin schema
    const { email, password } = req.body;

    // Check if user exists
    const user = await readByEmail(email);
    if (!user)
      throw {
        code: 404,
        error: "user not found",
      };

    // Verify password
    if (!(await bcrypt.compare(password, user.password)))
      throw {
        code: 401,
        error: "wrong password",
      };

    // Prepare payload for JWT
    const payload = {
      name: user.name,
      lastName: user.lastName,
      email: email,
      id: user._id,
    };

    // Generate access and refresh tokens
    const token = await jwt.sign(payload, secret, {
      expiresIn: TOKEN_EXPIRE_TIME,
    });
    const refreshToken = await jwt.sign(payload, refreshSecret, {
      expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
    });

    // Set cookies for tokens
    await res.cookie("token", token, {
      expires: new Date(Date.now() + TOKEN_EXPIRE_SECONDS),
      httpOnly: true,
      secure: true,
    });

    return await res
      .cookie("refreshToken", refreshToken, {
        expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRE_SECONDS),
        httpOnly: true,
        secure: true,
      })
      .json({ success: true, userData: payload });
  } catch (err) {
    // Handle errors
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

// Handler for updating user credentials
const updateCredentialsHandler = async (req, res) => {
  try {
    const { id } = req.auth; // Extract user ID from authenticated request
    if (req.body.password) return res.send("unavailable"); // Prevent password updates here
    await update(id, req.body); // Update user data
    return res.status(200).json({ success: true });
  } catch (err) {
    // Handle errors
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

// Handler for requesting a password reset
const requestResetPasswordHandler = async (req, res) => {
  try {
    await validate(req.body, UserRequestResetPassword); // Validate request body
    let user = await readByEmail(req.body.email); // Find user by email

    // Send password reset email
    sendMail(
      user.email,
      "Password Reset Email",
      resetTemplate(user.name, user._id)
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    // Handle errors
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

// Handler for resetting the password
const resetPasswordHandler = async (req, res) => {
  try {
    const id = req.params.id; // Extract user ID from request parameters
    await validate(req.body, UserResetPassword); // Validate request body

    const { newPassword, confirmNewPassword } = req.body;

    // Ensure passwords are provided and match
    if (!newPassword || !confirmNewPassword) {
      return res.status(404).send("passwords aren't entered");
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(409).send("passwords don't match");
    }

    const user = await readByID(id); // Find user by ID

    // Ensure new password is different from the old one
    if (await bcrypt.compare(newPassword, user.password)) {
      return res
        .status(400)
        .send("New password can't be the same as the old one");
    }

    // Hash the new password and update it
    const password = await bcrypt.hash(
      newPassword,
      parseInt(config("HASHING_SALT"))
    );
    await changePassword(id, password);

    return res.status(200).json({ success: true });
  } catch (err) {
    // Handle errors
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

// Handler for logging out the user
const logoutHandler = async (req, res) => {
  try {
    res.clearCookie("refreshToken"); // Clear refresh token cookie
    res.clearCookie("token"); // Clear access token cookie
    return res.json({ logged: false });
  } catch (err) {
    // Handle errors
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

// Handler for reading all users
const readAllHandler = async (req, res) => {
  try {
    let users = await read(); // Fetch all users from the database
    return await res.json(users);
  } catch (err) {
    // Handle errors
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

// Handler for refreshing tokens
const refreshToken = async (req, res) => {
  try {
    if (!req.cookies.token && req.cookies.refreshToken) {
      // If no access token but refresh token exists
      const { iat, exp, ...payload } = jwt.verify(
        req.cookies.refreshToken,
        config("REFRESH_JWT_SECRET")
      );

      // Generate a new access token
      let token = jwt.sign(payload, config("JWT_SECRET"), {
        expiresIn: TOKEN_EXPIRE_TIME,
      });

      await res.cookie("token", token, {
        expires: new Date(Date.now() + TOKEN_EXPIRE_SECONDS),
        httpOnly: true,
        secure: true,
      });

      return res
        .status(200)
        .json({ success: true, msg: "Token refreshed", userData: payload });
    } else if (!req.cookies.refreshToken) {
      // If no refresh token exists
      return res.status(404).json({
        success: false,
        msg: "No refreshToken found",
        userData: false,
      });
    } else if (req.cookies.token) {
      // If access token already exists
      const { iat, exp, ...payload } = jwt.verify(
        req.cookies.token,
        config("JWT_SECRET")
      );

      return res.status(200).json({
        success: true,
        msg: "already had a token",
        userData: payload,
      });
    }
  } catch (err) {
    // Handle errors
    return res.status(err.code || 500).json({
      success: false,
      err: err || "Internal server error",
      userData: false,
    });
  }
};

module.exports = {
  registerHandler,
  loginHandler,
  updateCredentialsHandler,
  requestResetPasswordHandler,
  resetPasswordHandler,
  logoutHandler,
  readAllHandler,
  refreshToken,
};
