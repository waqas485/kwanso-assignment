
import { DB } from "../../db/dbconfig"
import Joi from 'joi'
import jwt from 'jsonwebtoken'
import config from '../../config'
import { ObjectId } from 'mongodb'

//validation
const schema = Joi.object({
    name: Joi.string().required(),
})

module.exports = async (req: any, res: any, result: any) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const tokenData:any = jwt.verify(token, config.secret);
        const uid = new ObjectId(tokenData.user.user_id);

        const { error, value } = schema.validate(req.body)
        if (error === undefined) {

            value.createdAt = new Date()
            value.updatedAt = new Date()
            value.userId = uid
            const task = await DB.collection('Tasks').insertOne(value)
            return res.status(400).json({
                status: true,
                message: 'Record added',
                data: task
            })
        } else {
            return res.status(400).json({
                status: false,
                message: 'Something went wrong',
                data: error,
            })
        }

    } catch (err: any) {
        console.log(`Error ${err.message}`)
        return res.status(500).json({
            status: false,
            message: err.message,
            data: err,
        })
    }
}

