import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";
import bcrypt from "bcrypt";

const defaultAvatars = [
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxEHBhAIBw8OFRUODw8QEBMSEBAPEA4SFhMWFhYSFx8YHTQgGRoxHRMTITEhJSkuLi4uFx8zODMsNyktLisBCgoKDg0OGhAQGjYlHyU1Ky0tKy0wKy0tLi0tLS0rLS0tLS0tLS0tKy03NystLSsrNS0tLS03Kzc3LS0rLS0tN//AABEIAOEA4QMBIgACEQEDEQH/xAAaAAEAAgMBAAAAAAAAAAAAAAAABAUCAwYB/8QAMxABAAECAwUFBwQDAQAAAAAAAAECAwQRcQUhMTJBEhNRYXI0gZGhsdHhIkKSwSMzghT/xAAZAQEBAQEBAQAAAAAAAAAAAAAAAwIBBAX/xAAcEQEBAQEBAQEBAQAAAAAAAAAAAQIRAzESQSH/2gAMAwEAAhEDEQA/AOsAe980AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHvHgscLs/d27/8fu5bx2S1At2qrk5W4mdISKdn3J6RGs/ZbUxFMZUxlo9Y/ak84qJ2fcjhETpLRcs1Wv8AZTMfRfExnGUn7L5xzotMVs+Ko7VjdPh0nTwVkx2Zyno3L1O5seAOuAAAAAAAAAAAAAAAAAAANlm33t2KI6yCds3DZR39f/Pl5rAiMoyjoJW9Xk5ABx0AAQto4bt0d7Rxjj5wmhLws7HOjdirXc36qI8d2ktKzzgAAAAAAAAAAAAAAAAACZsunPE5+FMz/X9oabsqcsRMeNM/WHNfHc/VqAkuAAAAAAq9rU5XqavGnL4T+UFYbWn/ACUx5T9fwr1c/ENfQB1wAAAAAAAAAAAAAAAAbsJc7rEU1T45TpO5pAjohFwGI7612auNO6fOPFKRv+PRL0AAAABoxl/uLOccZ3U/cLeK3H3O8xU5dP0/D85oz14tHnt6AAAAAAAAAAAAAAAAAAAAztXJtVxXRxhcYXFU4iMuE9Y+ykexOW+HLOu51x0IqLW0K7cZVZVa8fik07Tp/dTV7piWPzVZuJwgztOn9tNXvyhHu7Qrr3UZU6b5c/NLuLDEYmmxT+rj0jrKnvXZvXO3X+IjwYTPanOp4pM8T1roA6yAAAAAAAAAAAAAAAAAAAAAADKmmauWJnSM2cWK54UV/wAZBqG2cPXHGiv+MsJomnmiY1jIOMQAAAAAAAAAAAAAAAAAAABnatTdq7NuM/6WVjZ0U772+fDp+XLZHZm1W0W5uTlREzpCVb2dVVvrmI+crSmmKYypiI03PWLtSec/qJb2dRTzZz78o+TfRYoo5aafhvbBztakkAHHQAGFVmmvmppn3Q0V7Poq4RMaT90oOlkqsubNmN9uqJ13SiXbNVqcrkTH0XxMZxlLU1WLiOdFtf2fTXvt/pn5K69Yqs1ZXI0npLcsqdzY1AOuAAAAAAAAAADdhcPOIudmOEcZ8GleYSz3NiKevGdXNXjWc9rOzaizR2bcfedWYJLAAAAAAAAAAAADyuiK6ezXGcS9AU2Mwv8A56s6eWeHl5Iy/vW4u2poq6/LzUMx2ZynpuUzeo7zyvAGmQAAAAAAAHtPNGroXPU80aw6FjanmAMKAAAAAAAAAAAAAACixW7E1+qfqvVHi/aq/VLeGPT40gNpAAAAAAAAMqeaNYdA5+nmjWHQMbU8wBhQAAAAAAAAAAAAAAUeL9qr9UrxR4v2qv1S3hj0+NIDaQAAAAAAADKnmjWHQOfo541h0DG1PMAYUAAAAAAAAAAAAAAFHi/aq/VK8UeL9qr9Ut4Y9PjSA2kAAAAAAAAyo541h0AMbU8wBhQAAAAAAAAAAAAAAUeL9qr9Ug3hj0+NIDaQAAAD/9k=",
  "data:image/jpeg;base64,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",
  "data:image/png;base64,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",
  "data:image/png;base64,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",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAY1BMVEUAAACZmZmcnJwwMDCenp5sbGyTk5N+fn6WlpZ6enqLi4uOjo53d3eEhISIiIhzc3NdXV1FRUVSUlIXFxcRERFkZGQ4ODhAQEAqKiokJCRXV1dubm5lZWUdHR0tLS1BQUFMTExStGPNAAAEtklEQVR4nO2cWZeqOhBGJScMMigqgqJ92v//Ky8CTu0RJSmoou+3X3qtXj5krwoZKzWbAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC/kyw/bd14Po+Xbvm9424NOcVh4WitVYtWnp/+IssiDio55wFVCUfbPXfTSCjDn3ZXtPJz7uZZU3ov/epQ6uQPdxOtyEPdodc6LrlbacGhM35Xx2DF3VBD9u8DeAmjy91WI4rgkwA26IS7tQasPwxgG0bvi7vBfSl7CVZ4E5sb+0VwglFc9RasFCPuVvdg9/kYc8eUhhvPyNCZzqQRG/TRRrHgbvpnmHyELQF32z/DMxacSD/dmoewGlAnsC3eWPhVQZxzt/89rk0IK8W/3AJvsfKruqn43WLv9egTGbfCG0Kzyf6GTrkVutlZh1AJX7tZTRVtEGVvoxa2nbQK4ppbohP7EDoq5pbooiAwdDxuiy5SCkMteb6I7T9D4XsogoGm+hBLbo0OLDZOd4Zbbo0OehwCdxgKXppmAYGg6OnCbm94NRS8R/z9hhmNoeBeOqP5DgWPNESzxZFbowOSGV9LnvFpVm3f3BodEGyAK8MNt0YHFgf6N0TvnjKKHbDPbdGJ9VGb8IFmNjsSGMq+uvhj301Dboc3RNYnwpJ3h2dSW0MlPSXDdnsheWPRsrQLopafcLq3MpR+a1FzsBlOJxBCu22w6M3vjf45bTckH3ffkZh+ilr2tdONjeFhxoQyvnOjfqqkr9fuMfoUA+mrmQdMNvvyM2ke6Js4pJwpzIQPVFHsMaQqZ4JPZ/rkDqmp5bE35B/ftWnZRzOvyfyPwqiU8DSoLk7ee0edTGqWeOLodDoqHU31WdeVTeX46ntUOjxxt4+EdfL0SLbWc+LJzYEv2Ze+U79zrgcWpbTW0XLy3fMnu9Nx6YeeFyXzQ1pMZCMIAAAAAAAAAACAf5LVcLeCnE2+St04iSLPOR/QaBV4UZjEbnrKJ3mWf0+Wp8skUPpyCPVw0F3/24n8Q5lLTpl9SSU3j9Sz2dOZYm3q+cfVlOKZfbvnKol98hUqTRXNS9mJly35dqH62d1rBvFadCy/1r5naHezVKEr9Ch8ny4s7S5UoTyIe0f6lYb63aDSB6U9V9C9d7ZekOo1aB2uZSwOiljRdM4nlHYO/CkoZTSQ3kWSt4Zrtg0G9WscF3zXcJXfwHqtI9NNcTmOX40Ox589PqifS+voj7yiW47r54xdqLYYsYPe0OPVG7YsWGbhOM5zkw3JY19DRW+EFcBfw9KdVAzeUwtev+Hz+VfcgkMrmiXhE6MH7Kg7brkGNdxwwzzIXBmsarRxfWBq9GEYQZJyAjQM9IiPpHAJDWoxhCBJtTkqBqnpRlJdh4wBXtMK+grPaPoEf5LSM3QMUD1D0Dhzhr4CypesEA4w6xOU9CCG+lpVnKGivoWTZ0h9cQPD0YEhDGHIDwxhCEN+YAhDGPIDQxjCkB8YwhCG/MAQhjDkB4YwhCE/MIQhDPmBIQxhyA8MYfh/NJSWuYcYGhieq5Coz6lb8fN/l45w+YFz/anTpwr/IIZ798qhYdkSN8z/if9I0v6paf8kyeKBsGYRRg94DUFDH8P/AB6wWaG5fgD0AAAAAElFTkSuQmCC",
  "data:image/png;base64,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",
  "data:image/jpeg;base64,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",
  "data:image/png;base64,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",
  "data:image/png;base64,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",
];

// home(/)
export const getJoin = (req, res) =>
  res.render("users/account/join", { pageTitle: "Join" });

export const postJoin = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;
  const pageTitle = "Join";

  /*
  const Exists = await User.exists({ $or: [{ username }, { email }] });
  // username 과 email 한번에 확인 (연산자 이용)
  if (Exists) {
    return res.status(400).render("users/account/join", {
      pageTitle,
      errorMessage: `🚫 This E-mail/User Name is already taken 🚫`,
    });
  } 
  */

  const existsUsername = await User.exists({ username });
  const existsEmail = await User.exists({ email });
  // username 과 email 따로 확인
  if (existsEmail) {
    return res.status(400).render("users/account/join", {
      pageTitle,
      errorMessage: `🚫 이미 사용중인 이메일 입니다. 🚫`,
    });
  }
  if (existsUsername) {
    return res.status(400).render("users/account/join", {
      pageTitle,
      errorMessage: `🚫 이미 사용중인 아이디 입니다. 🚫`,
    });
  }

  if (password !== password2) {
    return res.status(400).render("users/account/join", {
      pageTitle,
      errorMessage: `입력한 비밀번호가 일치하지 않습니다.`,
    });
  }
  try {
    const choseAvatar =
      defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
    await User.create({
      name,
      email,
      username,
      password,
      location,
      avatarUrl: choseAvatar,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("users/account/join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
};

export const getLogin = (req, res) =>
  res.render("users/account/login", { pageTitle: "Log in" });

export const postLogin = async (req, res) => {
  const pageTitle = "Log in";
  const { username, password } = req.body;
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("users/account/login", {
      pageTitle,
      errorMessage: "❗존재하지 않는 아이디 입니다.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("users/account/login", {
      pageTitle,
      errorMessage: "❗비밀번호가 틀렸습니다.❗",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = `https://github.com/login/oauth/authorize`;
  const config = {
    client_id: process.env.GH_GLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = `https://github.com/login/oauth/access_token`;
  const config = {
    client_id: process.env.GH_GLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );

    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name ? userData.name : "Unknown",
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

//users
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  res.render("users/edit-profile", {
    pageTitle: "Edit Profile",
    defaultAvatars,
  });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl, defaultAvartar },
    },
    body: { name, email, username, location },
    file,
  } = req;
  const nowUsername = req.session.user.username;
  const nowEmail = req.session.user.email;
  if (nowUsername !== username || nowEmail !== email) {
    const Exists = await User.exists({ $or: [{ username }, { email }] });
    if (Exists) {
      return res.status(400).render("users/edit-profile", {
        pageTitle: "Edit Profile",
        errorMessage: `🚫 This E-mail/User Name is already taken 🚫`,
      });
    }
  }

  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      defaultAvartar: file ? false : defaultAvartar,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updateUser;
  res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    req.flash(
      "error",
      "비밀번호를 변경할 수 없습니다. (Github로 로그인한 계정입니다.)"
    );

    return res.redirect("/");
  }
  return res.render("users/account/change-password", {
    pageTitle: "Change Password",
  });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPass, newPass, newPass2 },
  } = req;

  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPass, user.password);
  const pageTitle = "Change Password";
  if (!ok) {
    return res.status(400).render("users/account/change-password", {
      pageTitle,
      errorMessage: "❗기존 비밀번호가 일치하지 않습니다.",
    });
  }
  if (oldPass === newPass) {
    return res.status(400).render("users/account/change-password", {
      pageTitle,
      errorMessage: "⚠️새로운 비밀번호가 기존 비밀번호와 일치합니다.",
    });
  }
  if (newPass !== newPass2) {
    return res.status(400).render("users/account/change-password", {
      pageTitle,
      errorMessage:
        "❗❗새로운 비밀번호 확인이 잘못되었습니다. 다시 입력해주세요.",
    });
  }
  _id;
  user.password = newPass;
  await user.save();
  req.flash("info", "비밀번호가 변경되었습니다.");

  req.session.destroy();
  return res.redirect("/login");
};

export const profile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  if (!user) {
    req.flash("error", "존재하지 않는 사용자 입니다.");

    return res.status(404).render("404", { pageTitle: "User not found" });
  }

  return res.render("users/profile", {
    pageTitle: `${user.name}`,
    user,
  });
};

export const getDeleteAccount = async (req, res) => {
  return res.render("users/account/delete-account", {
    pageTitle: "Delete Account",
  });
};
export const postDeleteAccount = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { username, password, password2 },
  } = req;

  const user = await User.findById(_id).populate("videos");
  const pageTitle = "Delete Account";

  /*
  const userComments = await Comment.find({ owner: _id });
  console.log(userComments);
  const videosArray = userComments.map((item) => item.video);
  console.log(videosArray);
  */

  if (username !== user.username) {
    return res.status(400).render("users/account/delete-account", {
      pageTitle,
      errorMessage: "아이디가 틀렸습니다.",
    });
  }
  if (password !== password2) {
    return res.status(400).render("users/account/delete-account", {
      pageTitle,
      errorMessage: `비밀번호 확인이 잘못되었습니다.`,
    });
  }
  const passOk = await bcrypt.compare(password, user.password);
  if (!passOk) {
    return res.status(400).render("users/account/delete-account", {
      pageTitle,
      errorMessage: "비밀번호가 틀렸습니다.",
    });
  }

  await Video.deleteMany({ owner: _id });
  await Comment.deleteMany({ owner: _id });
  await User.findByIdAndDelete(_id);
  await Video.updateMany({}, { $pull: { comments: { owner: _id } } });

  req.session.destroy();
  // 현재 세션 지워줌 => 로그아웃
  return res.redirect("/");
};

export const changeDefaultAvatar = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { nowImgSrc } = req.body;
  const user = await User.findById(_id);
  if (!user) {
    return res.sendStatus(404);
  }

  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: nowImgSrc,
      defaultAvartar: true,
    },
    { new: true }
  );
  req.session.user = updateUser;
  return res.sendStatus(200);
};
