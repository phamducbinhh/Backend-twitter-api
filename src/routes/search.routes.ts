import express from 'express'
import { TokenType } from '~/constants/enums'
import searchController from '~/controllers/search.controllers'
import asyncHandler from '~/middlewares/asyncHandler'
import { verifyToken } from '~/middlewares/jwtMiddleware'

const router = express.Router()

router.get('/', verifyToken(TokenType.AccessToken), asyncHandler(searchController.searchController))

export default router
