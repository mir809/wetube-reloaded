import User from "../models/User";

// home(/)
export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: `Password confirmation does not match`,
    });
  }

  const Exists = await User.exists({ $or: [{ username }, { email }] });
  if (Exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: `🚫 This E-mail/User Name is already taken 🚫`,
    });
  }
  await User.create({
    name,
    email,
    username,
    password,
    location,
  });
  return res.redirect("/login");
};

export const login = (req, res) => res.send("Log in");

//users
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Delete User");
export const logout = (req, res) => res.send("Log Out");
export const profile = (req, res) => res.send("See MY Profile");
