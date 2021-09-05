module.exports = {
    priority: -1, // sort router organization
    get: [(req, res) => {
        res.json({ params: req.params, url: '/' });
    }],
    put: (req, res) => {
        res.json({ params: req.params, url: '/' });
    },
    post: (req, res) => {
        res.json({ params: req.params, url: '/' });
    },
    del: (req, res) => {
        res.json({ params: req.params, url: '/' });
    }
}