import { DB } from "../../db/dbconfig"
import Joi from 'joi'
import AES from 'crypto-js/aes'
import config from '../../config'

//validation
const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),

})

module.exports = async (req: any, res: any, result: any) => {
    try {
        const isExist = await DB
            .collection('Users')
            .findOne({ email: req.body.email })
        if (isExist)
            return res.status(400).json({
                status: false,
                message: `User already exist with the email ${req.body.email}`,
            })

        const { error, value } = schema.validate(req.body)
        if (error === undefined) {
            value.password = AES.encrypt(
                value.password,
                config.secret
            ).toString()
            value.createdAt = new Date()
            value.updatedAt = new Date()
            const user = await DB.collection('Users').insertOne(value)
            return res.status(400).json({
                status: true,
                message: 'Record added',
                data: user
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

