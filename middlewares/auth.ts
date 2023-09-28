/* Json web token middle ware */

import config from '../config'
import jwt from 'jsonwebtoken'

export const auth = async (req:any, res:any, next:any)=> {
  const {headers, url} = req;
  // filter out tokens
  let token = '';
      token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
      if (token) {
        if (token.startsWith('Bearer ')) {
          // Remove Bearer from string
          token = token.slice(7, token.length);
        }
      }


      if (token) {
        let decoded:any = null;
        try {
        decoded = jwt.verify(token, config.secret);
      } catch(e) {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });

      }
          if (!decoded) {
            return res.status(401).json({
              success: false,
              message: 'Token is not valid'
            });
          } else {
            req.decoded = decoded;
            next();
          }

      } else {
        return res.status(401).json({
          success: false,
          message: 'Auth token is not supplied'
        });
      }

};