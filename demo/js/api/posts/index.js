/**
 * @type {import("../../../../lib/esm").Handler}
 */
module.exports.get = (req,res) => {
    res.json({params: req.params, url: '/posts/index'});
}

/**
 * @type {import("../../../../lib/esm").Handler}
 */
module.exports.post = (req,res) => {
    res.json({params: req.params, url: '/posts/index'});
}

/**
 * @type {import("../../../../lib/esm").Handler}
 */
module.exports.del = (req,res) => {
    res.json({params: req.params, url: '/posts/index'});
}