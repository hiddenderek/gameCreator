import cypress from 'cypress'
import { css } from 'cypress/types/jquery'
import config from '../../src/config'

Cypress.Cookies.defaults({
  preserve: "secureCookie"
})

describe('spec.cy.ts', () => {
  before(() => {
    cy.exec(`psql -f cypress/e2e/reset-database.sql "dbname=gamecreator user=postgres password=D@c77357 host=${config.hostname} port=5434"`, {timeout: 5000})
    cy.clearCookies()
    cy.visit(`https://${config.hostname}:${config.port}/home`)
  })

  it('Home Screen', () => {
    cy.contains('TRENDING GAMES:')
    cy.get('[data-testid=game_icon]').should('not.exist')
  })

  it('Sign up', () => {
    cy.get('[data-testid=banner_sign_up]').should('exist')
    cy.get('[data-testid=banner_sign_up]').click()
    cy.get('[data-testid=user_input').should('exist')
    cy.get('[data-testid=pswd_input').should('exist')
    cy.get('[data-testid=c_pswd_input').should('exist')
    cy.get('[data-testid=dob_input]').should('exist')
    cy.get('[data-testid=signup_btn]').should('exist')
    cy.get('[data-testid=user_input').type('testUser')
    cy.get('[data-testid=pswd_input').type('asdf1234$')
    cy.get('[data-testid=c_pswd_input').type('asdf1234$')
    cy.get('[data-testid=dob_input').type('2020-05-01', { force: true })
    cy.get('[data-testid=signup_btn]').click()
    cy.wait(1000)
    cy.get('[data-testid=sign_up_log_in_nav]').should('exist')
    cy.get('[data-testid=sign_up_log_in_nav]').click()
  })

  it('Log In', () => {
    cy.wait(500)
    cy.get('[data-testid=user_login_input]').should('exist')
    cy.get('[data-testid=pswd_login_input]').should('exist')
    cy.get('[data-testid=log_in_button]').should('exist')
    cy.get('[data-testid=user_login_input]').type('testUser')
    cy.get('[data-testid=pswd_login_input]').type('asdf1234$')
    cy.get('[data-testid=log_in_button]').click()
  })

  it('Profile Navigate', () => {
    cy.wait(500)
    cy.get('[data-testid=banner_profile]').should('exist')
    cy.get('[data-testid=banner_profile]').click()
    cy.contains('User Profile')
  })

  it('Create Game', () => {
    cy.get('[data-testid=profile_create_game]').should('exist')
    cy.get('[data-testid=profile_create_game]').click()
  })

  it('Edit Game', () => {
    cy.wait(4000)
    cy.get('[data-testid=lava_element_btn]').should('exist')
    cy.get('[data-testid=lava_element_btn]').click()
    cy.get('[data-testid=game_element]').eq(327).click()
    cy.get('[data-testid=goal_element_btn]').should('exist')
    cy.get('[data-testid=goal_element_btn]').click()
    cy.get('[data-testid=game_element]').eq(332).click()
  })

  it('Save Game', () => {
    cy.get('[data-testid=game_save_btn]').should('exist')
    cy.get('[data-testid=game_save_btn]').click()
    cy.wait(1500)
    cy.contains('GAME NAME MUST EXIST.', {timeout: 8000})
    cy.get('[data-testid=game_title_input]').type('testGame1')
    cy.get('[data-testid=game_save_btn]').should('exist')
    cy.get('[data-testid=game_save_btn]').click()
    cy.wait(1500)
    cy.contains('GAME SAVED SUCCESSFULLY!', {timeout: 8000})
  })

  it('Log out', () => {
    cy.get('[data-testid=banner_log_out]').should('exist')
    cy.get('[data-testid=banner_log_out]').click()
  })

  it('Sign up another account', () => {
    cy.get('[data-testid=banner_sign_up]').should('exist')
    cy.get('[data-testid=banner_sign_up]').click()
    cy.get('[data-testid=user_input').should('exist')
    cy.get('[data-testid=pswd_input').should('exist')
    cy.get('[data-testid=c_pswd_input').should('exist')
    cy.get('[data-testid=dob_input]').should('exist')
    cy.get('[data-testid=signup_btn]').should('exist')
    cy.get('[data-testid=user_input').type('testUser2')
    cy.get('[data-testid=pswd_input').type('asdf1234$')
    cy.get('[data-testid=c_pswd_input').type('asdf1234$')
    cy.get('[data-testid=dob_input').type('2020-05-01', { force: true })
    cy.get('[data-testid=signup_btn]').click()
    cy.wait(1000)
    cy.get('[data-testid=sign_up_log_in_nav]').should('exist')
    cy.get('[data-testid=sign_up_log_in_nav]').click()
  })

  it('Log in', () => {
    cy.get('[data-testid=user_login_input]').should('exist')
    cy.get('[data-testid=pswd_login_input]').should('exist')
    cy.get('[data-testid=log_in_button]').should('exist')
    cy.get('[data-testid=user_login_input]').type('testUser2')
    cy.get('[data-testid=pswd_login_input]').type('asdf1234$')
    cy.get('[data-testid=log_in_button]').click()
  })

  it('Create another game', () => {
    cy.wait(500)
    cy.get('[data-testid=banner_profile]').should('exist')
    cy.get('[data-testid=banner_profile]').click()
    cy.contains('User Profile')
    cy.get('[data-testid=profile_create_game]').should('exist')
    cy.get('[data-testid=profile_create_game]').click()
    cy.get('[data-testid=game_title_input]').type('testGame2')
    cy.get('[data-testid=game_save_btn]').should('exist')
    cy.get('[data-testid=game_save_btn]').click()
    cy.wait(1500)
    cy.contains('GAME SAVED SUCCESSFULLY!', {timeout: 8000})
  })

  it('search games', () => {
    cy.get('[data-testid=sidebar_browse_btn]').should('exist')
    cy.get('[data-testid=sidebar_browse_btn]').click()
    cy.get('[data-testid=banner_search_bar_input]').should('exist')
    cy.get('[data-testid=banner_search_bar_input]').type('testGame1 ')
    cy.wait(2000)
    cy.get('[data-testid=game_icon]').eq(0).should('exist')
    cy.get('[data-testid=game_icon]').should('have.length', 1)
  })

  it('Play game', () => {
    cy.get('[data-testid=game_icon_navigate]').should('exist')
    cy.get('[data-testid=game_icon_navigate]').click()
    cy.wait(5000)
    Cypress._.times(90, () => {
      cy.get('.appContainer').trigger('keydown', {key: 'ArrowRight'})
    })

  })

  it('Win Game', () => {
    cy.contains('You Win!')
  })

  it('View individual game rankings', () => {
    cy.get('[data-testid=banner_rank_toggle]').should('exist')
    cy.get('[data-testid=banner_rank_toggle]').click()
    cy.get('.rankList').should('have.length.at.least', 1)
  })

  it('Like Game', () => {
    cy.get('[data-testid=banner_like_btn]').click()
    cy.get('[data-testid=sidebar_browse_btn]').click()
    cy.get('[data-testid=game_icon_likes]').should('exist')
    cy.get('[data-testid=game_icon_likes]').should('have.text', '01')
  })

  it('View trending', () => {
    cy.get('[data-testid=sidebar_home_btn]').click()
    cy.get('[data-testid=game_icon_name_0]').should('exist')
    cy.get('[data-testid=game_icon_name_1]').should('exist')
    cy.get('[data-testid=game_icon_name_0]').should('have.text', 'TESTGAME1')
    cy.get('[data-testid=game_icon_name_1]').should('have.text', 'TESTGAME2')
  })

  it('View site rankings', () => {
    cy.get('[data-testid=sidebar_ranks_btn]').click()
    cy.get('[data-testid=high_score_rank_0]').should('exist')
    cy.get('[data-testid=high_score_rank_0]').within(()=>{
      cy.contains('testUser2').should('exist')
    })
    cy.get('[data-testid=likes_rank_0]').within(()=>{
      cy.contains('testUser').should('exist')
      cy.contains('testUser2').should('not.exist')
    })
    cy.get('[data-testid=plays_rank_0]').within(()=>{
      cy.contains('testUser').should('exist')
      cy.contains('testUser2').should('not.exist')
    })

  })
  
  it('Navigate to other users profile', () => {
    cy.get('[data-testid=high_score_rank_0]').within(()=>{
      cy.contains('testUser2').click()
    })
    cy.contains('TESTUSER2')
    cy.contains('TESTGAME2')
  })

  it('Delete Game', () => {
    cy.get('[data-testid=banner_profile]').should('exist')
    cy.get('[data-testid=banner_profile]').click()
    cy.get('[data-testid=game_icon_delete_0]').should('exist')
    cy.get('[data-testid=game_icon_delete_0]').click()
    cy.get('[data-testid=game_icon_delete_0]').should('not.exist')
  })

  it('Log Out', () => {
    cy.get('[data-testid=banner_log_out]').should('exist')
    cy.get('[data-testid=banner_log_out]').click()
    cy.contains('TRENDING GAMES:')
    cy.get('[data-testid=game_icon]').eq(1).should('not.exist')
  })

})
