// home(/)
export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = (req, res) => {
  console.log(req.body);
  res.end();
};

export const login = (req, res) => res.send("Log in");

//users
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Delete User");
export const logout = (req, res) => res.send("Log Out");
export const profile = (req, res) => res.send("See MY Profile");
