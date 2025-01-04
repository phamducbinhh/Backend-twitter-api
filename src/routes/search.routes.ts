import express from 'express'
import { TokenType } from '~/constants/enums'
import searchController from '~/controllers/search.controllers'
import asyncHandler from '~/middlewares/asyncHandler'
import { verifiedUserValidator, verifyToken } from '~/middlewares/jwtMiddleware'
import { validate } from '~/middlewares/validate'
import { SearchSchema } from '~/schema/search/search.schema'

const router = express.Router()

router.get(
  '/',
  verifyToken(TokenType.AccessToken),
  verifiedUserValidator,
  validate(SearchSchema),
  asyncHandler(searchController.searchController)
)

export default router
