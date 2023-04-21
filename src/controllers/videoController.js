// home(/)
export const home = (req, res) => {
  const videos = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  res.render("home", { pageTitle: "Home", videos });
};

export const search = (req, res) => res.send("Search");

//videos
export const upload = (req, res) => res.send("Upload Video");
export const watch = (req, res) => res.render("watch", { pageTitle: "Watch" });
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const deleteVideo = (req, res) => res.send("Delete Video");
