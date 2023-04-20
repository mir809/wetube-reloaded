// home(/)
export const home = (req, res) => res.render("home");
export const search = (req, res) => res.send("Search");

//videos
export const upload = (req, res) => res.send("Upload Video");

export const watch = (req, res) => res.render("watch");
export const edit = (req, res) => res.render("edit");

export const deleteVideo = (req, res) => {
  res.send("Delete Video");
};
