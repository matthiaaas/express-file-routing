import { Handler } from "../../../lib/esm";

export const handler: Handler = (req, res) => {
    return res.json({ test: '/', params: req.params });
};