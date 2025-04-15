const UserRegister = {
  name: "required|string",
  lastName: "required|string",
  email: "required|email",
  password: "required|string",
}; // Validation rules for user registration

const UserLogin = {
  email: "required|email",
  password: "required|string",
}; // Validation rules for user login

const UserRequestResetPassword = {
  email: "required|email",
}; // Validation rules for requesting a password reset

const UserResetPassword = {
  newPassword: "required|string",
  confirmNewPassword: "required|string",
}; // Validation rules for resetting the password
// The rules are used to validate the data before saving it to the database

module.exports = {
  UserRegister,
  UserLogin,
  UserRequestResetPassword,
  UserResetPassword,
};
