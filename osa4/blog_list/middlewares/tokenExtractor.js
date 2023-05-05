

const tokenExtractor = (request, response, next) => {
    const body = request.body
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    }
    next()
  }

module.exports = tokenExtractor