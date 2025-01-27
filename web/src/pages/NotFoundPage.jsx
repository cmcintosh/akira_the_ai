import React from 'react'

const NotFoundPage = () => {
  return (
    <div class="error-container">

      
      <div class="container">

      
        <div class="row justify-content-center">
          <div class="col-sm-6">
            <img src="assets/images/error.svg" class="img-fluid mb-5" alt="Bootstrap Gallery"/>
            <h2 class="fw-bold mb-4">
              We're sorry but it looks like the page doesn't exist anymore.
            </h2>
            <a href="index.html" class="btn btn-danger rounded-5 px-4 py-2 fs-5"><i
                class="bi bi-arrow-left lh-1 me-2"></i> Back to Home</a>
          </div>
        </div>
      

      </div>
      

    </div>
  )
}

export default NotFoundPage
