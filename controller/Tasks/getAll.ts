import { DB } from "../../db/dbconfig"
import jwt from 'jsonwebtoken'
import config from '../../config'
import { ObjectId } from 'mongodb'

module.exports = async (req: any, res: any, next: any) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    const tokenData:any = jwt.verify(token, config.secret);
    const uid = new ObjectId(tokenData.user.user_id);
    const data = await DB
        .collection('Tasks').find({ userId: uid })
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