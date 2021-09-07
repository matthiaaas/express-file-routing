import { Handler } from "../../../lib/esm";

export const priority = 2;

const handler : Handler<{id: number},{name: string}, {search: string} > = (req,res) => {
        //  req.params.id => 1
        //  req.body.name => 'name'
        // req.query.search => 'jhon'

        return res.json({test: '/', params: req.params});
    };

export default handler;