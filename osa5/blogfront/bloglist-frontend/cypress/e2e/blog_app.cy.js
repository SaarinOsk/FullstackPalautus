describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST','http://localhost:3003/api/users/', {
      "username": "test",
      "password": "1234",
      "name": "tester"
    })
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Login in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('test')
      cy.get('#password').type('1234')
      cy.get('#login-button').click()
      cy.contains('Logged in as tester')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('NotCorrect')
      cy.get('#password').type('NotCorrectEither')
      cy.get('#login-button').click()
      cy.contains('wrong credentials')
      cy.contains('Login in to application')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('test')
      cy.get('#password').type('1234')
      cy.get('#login-button').click()      
    })

    it('A blog can be created', function() {
      cy.get('#show-toggle').click()
      cy.get('#title').type('Testing title')
      cy.get('#author').type('Testing author')
      cy.get('#url').type('test.com')
      cy.get('#submit-blog').click()
      cy.contains('New blog Testing title by Testing author added!')
      cy.contains('Testing title Testing author')
    })

    describe('After creating blog', function() {
      beforeEach(function() {
        cy.get('#show-toggle').click()
        cy.get('#title').type('Testing title')
        cy.get('#author').type('Testing author')
        cy.get('#url').type('test.com')
        cy.get('#submit-blog').click()     
      })

      it('A blog can be liked', function() {
        cy.get('.view-blog').click()
        cy.get('.like-blog').click()
        cy.contains('likes 1')
      })

      it('A blog can be removed', function() {
        cy.get('.view-blog').click()
        cy.get('.remove-blog').click()
        cy.contains('Blog removed')
        cy.contains('Testing title testing author').should('not.exist')
      })

      it('Only the blog adder can see the remove button for that blog', function() {
        cy.get('.view-blog').click()
        cy.get('#logout').click()
        cy.visit('http://localhost:3000')

        cy.request('POST','http://localhost:3003/api/users/', {
          "username": "test2",
          "password": "1234",
          "name": "tester2"
        })
        cy.get('#username').type('test2')
        cy.get('#password').type('1234')
        cy.get('#login-button').click()
        
        cy.get('.view-blog').click()
        cy.contains('test.com')
        cy.get('.remove-div').should('have.css', 'display', 'none')

      })

      it('The blogs are shown in sorted order based on likes', function() {
        cy.get('#show-toggle').click()
        cy.get('#title').type('Title2')
        cy.get('#author').type('Author2')
        cy.get('#url').type('url2.con')
        cy.get('#submit-blog').click()
        cy.contains('Title2 Author2')
        
        cy.get('.blog').eq(0).should('contain', 'Testing title Testing author')

        cy.get('.view-blog').eq(1).click()
        cy.get('.like-blog').eq(1).click()
        cy.get('.blog').eq(0).should('contain', 'Title2 Author2')

      })
    })
  })
})  