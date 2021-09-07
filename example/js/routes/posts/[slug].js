module.exports.get = async (req, res) =>
  res.send(`/posts/${req.params.slug} (SLUG)`)
