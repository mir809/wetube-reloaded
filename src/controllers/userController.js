import User from "../models/User";
import bcrypt from "bcrypt";

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
  try {
    await User.create({
      name,
      email,
      username,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log in" });

export const postLogin = async (req, res) => {
  const pageTitle = "Log in";
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "❗An account with this username does not exists.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "❗Wrong password❗",
    });
  }
  console.log("Log User in! Comming Soon!");
  return res.redirect("/");
};

//users
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Delete User");
export const logout = (req, res) => res.send("Log Out");
export const profile = (req, res) => res.send("See MY Profile");
