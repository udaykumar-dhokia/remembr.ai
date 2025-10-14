const cookieOptions = {
  httpOnly: true,
  secure: true,
  maxAge: 60 * 60 * 1000,
  sameSite: "Strict",
};

export default cookieOptions;
