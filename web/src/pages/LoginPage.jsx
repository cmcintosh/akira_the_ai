import React from 'react'

const LoginPage = () => {
  return (
    <div class="auth-wrapper">

      <form action="index.html">


        <div class="auth-box">

          <a href="index.html" class="auth-logo mb-4">
            <img src="assets/images/logo.svg" alt="Bootstrap Gallery" />
          </a>

          <h4 class="mb-4">Login</h4>

          <div class="mb-2">
            <label class="form-label" for="username">Username <span class="text-danger">*</span></label>
            <input type="text" id="username" class="form-control" placeholder="Enter username"/>
          </div>

          <div class="mb-2">
            <label class="form-label" for="password">Password <span class="text-danger">*</span></label>
            <div class="input-group">
              <input type="password" id="password" class="form-control" placeholder="Enter password"/>
              <button class="btn btn-outline-secondary" type="button">
                <i class="bi bi-eye"></i>
              </button>
            </div>
          </div>

          <div class="d-flex justify-content-between mb-4">
            <div class="form-check m-0">
              <input class="form-check-input" type="checkbox" value="yes" name="remember_me" id="rememberPassword"/>
              <label class="form-check-label small" for="rememberPassword">Remember</label>
            </div>
            <a href="forgot-password.html" class="text-decoration-underline small">Forgot password?</a>
          </div>

          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-danger">Login</button>
            <a href="signup" class="btn btn-secondary">Not registered? Signup</a>
          </div>

        </div>

      </form>

    </div>
  )
}

export default LoginPage
