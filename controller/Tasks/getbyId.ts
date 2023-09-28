import { DB } from "../../db/dbconfig"
import { ObjectId } from 'mongodb'

module.exports = async (req: any, res: any, next: any) => {

    const tid = new ObjectId(req.params.id);
    const data = await DB
        .collection('Tasks').find({ _id: tid })
        .toArray();
    if (data) {
        return res.status(200).json({
            status: true,
            message: 'Record get successfully',
            data: data
        })
    } else {
        return res.status(422).json({
            status: false,
            message: 'Unknown error',
        })
    }

}