

import { Router } from 'express'
const router = Router()
import { auth } from '../middlewares/auth'

router.get('/user',auth, require('../controller/User/get'))
router.post('/user', require('../controller/User/register'))
router.post('/login', require('../controller/User/login'))

router.get('/task',auth, require('../controller/Tasks/getAll'))
router.post('/task',auth, require('../controller/Tasks/create'))
router.get('/taskbyId',auth, require('../controller/Tasks/getbyId'))

export default router