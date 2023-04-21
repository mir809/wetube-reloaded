let videos = [
  {
    title: "First Video",
    rating: 4,
    comments: 7,
    createdAt: "2min ago",
    views: 57,
    id: 1,
  },
  {
    title: "Second Video",
    rating: 4,
    comments: 2,
    createdAt: "2min ago",
    views: 59,
    id: 2,
  },
  {
    title: "Third Video",
    rating: 5,
    comments: 4,
    createdAt: "2min ago",
    views: 36,
    id: 3,
  },
];

// home(/)
export const home = (req, res) => {
  res.render("home", { pageTitle: "Home", videos });
};
export const search = (req, res) => res.send("Search");

//videos
export const upload = (req, res) => res.send("Upload Video");
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching ${video.title}`, video });
};
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const deleteVideo = (req, res) => res.send("Delete Video");
