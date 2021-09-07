/**
 * @type {import("../../../../../lib/cjs/types").Handler<{postId:string}>}
 */
module.exports.Get = (req,res) => {
    res.json({postId: req.params.postId , url: '/[postId]/index'});
}