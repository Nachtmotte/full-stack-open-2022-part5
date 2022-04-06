describe('Blog app', function () {
  const testUser = { username: 'testUser', name: 'testUser', password: 'testUser' }
  const testUser2 = { username: 'testUser2', name: 'testUser2', password: 'testUser2' }
  const testNote = { title: 'testTitle', author: 'testAuthor', url: 'https://www.testUrl.com' }
  const testNote2 = { title: 'testTitle2', author: 'testAuthor2', url: 'https://www.testUrl2.com'}
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', testUser)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
    cy.get('#username').should('exist')
    cy.get('#password').should('exist')
    cy.get('#button-login').should('exist')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type(testUser.username)
      cy.get('#password').type(testUser.password)
      cy.get('#button-login').click()
      cy.contains(`${testUser.username} logged in`)
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type(testUser.username)
      cy.get('#password').type(testUser2.password)
      cy.get('#button-login').click()
      cy.contains('Wrong credentials')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/users', testUser2)
      cy.get('#username').type(testUser2.username)
      cy.get('#password').type(testUser2.password)
      cy.get('#button-login').click()

      cy.contains('new blog').click()
      cy.get('#title').type(testNote.title)
      cy.get('#author').type(testNote.author)
      cy.get('#url').type(testNote.url)
      cy.get('#create-button').click()
    })

    it('A blog can be created', function() {
      cy.contains(testNote.title)
      cy.contains('view').click()
      cy.contains(testNote.author)
      cy.contains(testNote.url)
    })

    it('A blog can be liked', function() {
      cy.contains('view').click()
      cy.contains('likes: 0')
      cy.contains('like').click()
      cy.contains('likes: 1')
    })

    it('a blog can be deleted if it is ours', function() {
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.contains(testNote.url).should('not.exist')
    })

    it('a blog cant be deleted if it isnt ours', function() {
      cy.contains('logout').click()
      cy.get('#username').type(testUser.username)
      cy.get('#password').type(testUser.password)
      cy.get('#button-login').click()
      cy.contains('view').click()
      cy.contains('remove').should('not.exist')
    })

    it('blogs are sorted by likes', function() {
      cy.get('.blog > div').first().contains(testNote.title)

      cy.contains('new blog').click()
      cy.get('#title').type(testNote2.title)
      cy.get('#author').type(testNote2.author)
      cy.get('#url').type(testNote2.url)
      cy.get('#create-button').click()

      cy.wait(2000);
      cy.get('button:last').click()
      cy.contains('like').click()

      cy.wait(500);
      cy.get('.blog > div').first().contains(testNote2.title)
    })
  })
})
