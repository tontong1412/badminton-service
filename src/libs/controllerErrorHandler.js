const controllerErrorHandler = (func) => async (req, res) => {
  try {
    return await func(req, res)
  } catch (error) {
    const errorStatus = 500
    console.log(error)
    res.status(errorStatus).send({
      error: error.toString(),
    })
  }
}

export default controllerErrorHandler
