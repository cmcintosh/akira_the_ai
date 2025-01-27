import React from 'react'

const SignupPage = () => {
  return (

    <div class="auth-wrapper">

      <form action="index.html">  
        <div class="auth-box">

          
          <a href="index.html" class="auth-logo mb-4">
            <img src="assets/images/logo.svg" alt="Bootstrap Gallery" />
          </a>

          <h4 class="mb-4">Create an account</h4>

          <div class="mb-2">
            <label class="form-label" for="name">Name <span class="text-danger">*</span></label>
            <input type="text" id="name" class="form-control" placeholder="Enter name"/>
          </div>

          <div class="mb-2">
            <label class="form-label" for="email">Email <span class="text-danger">*</span></label>
            <input type="text" id="email" class="form-control" placeholder="Enter email"/>
          </div>

          <div class="mb-4">
            <label class="form-label" for="password">Password <span class="text-danger">*</span></label>
            <div class="input-group">
              <input type="password" id="password" class="form-control" placeholder="Enter password"/>
              <button class="btn btn-outline-secondary" type="button">
                <i class="bi bi-eye"></i>
              </button>
            </div>
            <div class="form-text">
              Your password must be 8-20 characters long.
            </div>
          </div>

          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-danger">Signup</button>
            <a href="login" class="btn btn-secondary">Already have an account? Login</a>
          </div>

        </div>

      </form>

    </div>
  )
}

export default SignupPage
