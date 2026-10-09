describe('Shipzy Driver', () => {
  it('logs in and lands on the home screen', () => {
    cy.visit('/login')
    cy.contains('button', 'Log In').click()
    cy.contains('ion-content', 'Active Delivery')
  })

  it('opens a booking from My Bookings', () => {
    cy.visit('/tabs/deliveries')
    cy.contains('View Details').first().click()
    cy.contains('Delivery reference')
  })
})
