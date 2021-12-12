const express = require('express')
const router = express.Router()
module.exports = () => {
  const route = new SignUpRouter()
  router.post('/signup', new ExpressRouterAdapter.Adapter(route))
}

class ExpressRouterAdapter {
  static Adapter (route) {
    return async (req, res) => {
      const httpRequest = {
        body: req.body
      }
      const httpResponse = await route.route(httpRequest)
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}

// presentation
// signup-router

class SignUpRouter {
  async route (httpRequest) {
    const { email, password, resetPassword } = httpRequest.body
    const user = new SignUpUseCase().signUp(email, password, resetPassword)
    return {
      statusCode: 200,
      body: user
    }
  }
}

// Domain
// signUp-useCase

class SignUpUseCase {
  async signUp (email, password, resetPassword) {
    if (password === resetPassword) {
      new AddAccountRepository().add(email, password)
    }
  }
}

// Infra
// add-account-repo
const mongoose = require('mongoose')
const AccountModel = mongoose.model('Account')

class AddAccountRepository {
  async add (email, password) {
    const user = await AccountModel.create({ email, password })
    return user
  }
}
