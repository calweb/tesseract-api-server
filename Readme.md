# Tesseract API Server

This probably should be a separate repo, but keeping it in here for now, may segregate down the road.


## Functionality

This server will be the go-to source for any Tesseract client and provide the authentication/authorizations for users as well as saving any of their deck and stat information.

We will be using a publically available mtg card api, but will store the decks on the Tesseract side of things.

* Todo

- Data model for different entities in our system (or at least a basic idea how their connected), namely:
  - decks
  - games
  - stats
  - users
  - is there a card entity/model?
