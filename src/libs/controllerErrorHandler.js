const controllerErrorHandler = (func) => async (req, res) => {
  try {
    return await func(req, res)
  } catch (error) {
    const errorStatus = error.status || 500
    console.error(error)
    return res.status(errorStatus).send({
      error: error.toString(),
    })
  }
}

export default controllerErrorHandler
