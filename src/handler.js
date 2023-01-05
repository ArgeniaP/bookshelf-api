const { nanoid } = require('nanoid')
const books = require('./bookshelf')

const handler = {
  addNewBook: (request, h) => {
    // const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload
    const data = request.payload

    if (!data.name || data.readPage > data.pageCount) {
      const message = !data.name ? 'Mohon isi nama buku' : 'readPage tidak boleh lebih besar dari pageCount'
      const response = h.response({
        status: 'fail',
        message: `Gagal menambahkan buku. ${message}`
      })
      response.code(400)
      return response
    }

    const id = nanoid(16)
    const finished = data.pageCount === data.readPage
    const insertedAt = new Date().toDateString()
    const updatedAt = insertedAt

    const newBook = { id, ...data, finished, insertedAt, updatedAt }

    books.push(newBook)

    const isSuccess = books.filter((book) => book.id === id).length > 0

    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id
        }
      })
      response.code(201)
      return response
    }

    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan'
    })
    response.code(500)
    return response
  },

  getAllBooks: () => ({
    status: 'success',
    data: {
      books
    }
  }),

  getBookById: (request, h) => {
    const { id } = request.params

    const book = books.filter((n) => n.id === id)[0]

    if (book !== undefined) {
      const response = h.response({
        status: 'success',
        data: {
          book
        }
      })
      response.code(200)
      return response
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
  },

  editBookById: (request, h) => {
    const { id } = request.params

    const data = request.payload
    const updatedAt = new Date().toISOString()

    if (!data.name || data.readPage > data.pageCount) {
      const message = !data.name ? 'Mohon isi nama buku' : 'readPage tidak boleh lebih besar dari pageCount'
      const response = h.response({
        status: 'fail',
        message: `Gagal memperbarui buku. ${message}`
      })
      response.code(400)
      return response
    }

    const index = books.findIndex((book) => book.id === id)

    if (index !== -1) {
      books[index] = {
        ...books[index],
        ...data,
        updatedAt
      }

      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
      })
      response.code(200)
      return response
    }

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui Buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
  },

  deleteBookById: (request, h) => {
    const { id } = request.params

    const index = books.findIndex((book) => book.id === id)

    if (index !== -1) {
      books.splice(index, 1)

      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus'
      })
      response.code(200)
      return response
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
  }
}

module.exports = handler
