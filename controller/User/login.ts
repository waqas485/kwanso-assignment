import { DB } from "../../db/dbconfig"
import Joi from 'joi'
import CryptoJS from 'crypto-js'
import AES from 'crypto-js/aes'
import jwt from 'jsonwebtoken'
import config from '../../config'

module.exports = async (req: any, res: any, next: any) => {
    try {
        //validation
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        })
        let obj = req.body
        //check validation
        const { error, value } = schema.validate(obj)
        if (error == undefined) {
            const user = await DB
                .collection('Users')
                .find(
                    { email: value.email }
                )
                .toArray()
            if (user.length != 0) {

                //match password
                let bytes = AES.decrypt(user[0].password, config.secret)
                let orignialPassword = bytes.toString(CryptoJS.enc.Utf8)
                if (
                    value.password === orignialPassword
                ) {


                    //creating jwt token
                    const token = jwt.sign(
                        {
                            user: {
                                user_id: user[0]._id,
                                userId: user[0].id,
                                email: user[0].email,
                            },
                        },
                        config.secret,
                        { expiresIn: config.expiresIn }
                    )
                    return res.status(200).json({
                        status: true,
                        message: 'Login successfully',
                        data: user,
                        token: token
                    })


                } else {
                    return res.status(422).json({
                        status: false,
                        message: 'You have entered incorrect password',
                    })
                }
            } else {
                return res
                    .status(422)
                    .json({ status: false, message: "An account doesn't exist for this email address." })
            }
        } else {
            return res.status(422).json({
                status: false,
                message: 'Email must be a valid email.',
                data: error.message,
            })
        }
    } catch (err) {
        console.log(err)
        return res
            .status(422)
            .json({ status: false, message: (err as any).message, data: err })
    }
}

