import { Response } from 'express'
import searchService from '~/services/search.service'
import { sendResponse } from '~/utils/response'

class SearchController {
  constructor() {}
  async searchController(req: any, res: Response) {
    const limit = Number(req.query.limit)
    const page = Number(req.query.page)
    const response = await searchService.search({ q: req.query.q, type: req.query.type, limit, page })
    sendResponse(res, response.statusCode, {
      success: response.success,
      message: response.message,
      data: response.data
    })
  }
}

const searchController = new SearchController()
export default searchController
