'use strict'

const express = require('express')
const knex = require('../knex')
// eslint-disable-next-line new-cap
const router = express.Router()

router.get('/books', (req, res, next) => {
  return knex('books')
    .orderBy('title')
    .select(
      'id',
      'title',
      'author',
      'genre',
      'description',
      'cover_url AS coverUrl',
      'created_at AS createdAt',
      'updated_at AS updatedAt'
    )
    .then(books => {
      res.status(200).send(books)
    })
})

router.get('/books/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .first()
    .select(
      'id',
      'title',
      'author',
      'genre',
      'description',
      'cover_url AS coverUrl',
      'created_at AS createdAt',
      'updated_at AS updatedAt'
    )
    .then(book => {
      res.status(200).send(book)
    })
})
router.post('/books', (req, res, next) => {
  knex('books')
    .insert(
      {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        description: req.body.description,
        cover_url: req.body.coverUrl
      },
      '*'
    )
    .then(book => {
      const data = {
        id: book[0].id,
        title: book[0].title,
        author: book[0].author,
        genre: book[0].genre,
        description: book[0].description,
        coverUrl: book[0].cover_url
      }
      res.send(data)
    })
    .done()
})

router.patch('/books/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .update(
      {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        description: req.body.description,
        cover_url: req.body.coverUrl
      },
      '*'
    )
    .then(data => {
      data[0]['coverUrl'] = data[0]['cover_url']
      delete data[0]['cover_url']
      delete data[0]['created_at']
      delete data[0]['updated_at']
      res.status(200).send(data[0])
    })
})
router.delete('/books/:id', (req, res, next) => {
knex('books')
.where('id', req.params.id)
.then((book) => {
  let data = {
    title: book[0].title,
    author: book[0].author,
    genre: book[0].genre,
    description: book[0].description,
    coverUrl: book[0].cover_url
  }
res.send(data)
}).then(() => {
knex('books').where('id', req.params.id).del()
})
})

router.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({ error: err })
})

router.use((req, res, next) => {
 res.status(404).json({error:{ message: 'Not Found'}})
})

module.exports = router
