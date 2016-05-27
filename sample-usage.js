function solve(){ 
	function isValidDescription (des) {
		return (typeof(des) === 'string' && des != '');
	}

	function isValidValue (value, valueType, minSize, maxSize) {
		return (typeof(value) === valueType && value.length >= minSize && value.length <= maxSize);
	}

	function isvalidIsbn (isbn) {
		var result = true;

		if (typeof(isbn) != 'string' && (isbn.length != 10 && isbn.length != 13)) {
			result = false;
		}

		isbn = +isbn;

		if (isNaN(isbn)) {
			result = false;
		}

		return result;
	}

	var item = (function(){
		var itemId = 0,
			item = Object.defineProperties({}, {
				init: {
					value: function(name, description) {
						this.id = (itemId += 1);
						this.description = description;
						this.name = name;

						return this;
					}
				}
			});

		return item;
	}());

	var book = (function(parent){
		var bookId = 0,
			book = Object.create(parent);

		Object.defineProperty(book, 'init', {
			value: function (name, isbn, genre, description) {
				parent.init.call(this, name, description);

				this.isbn = isbn;
				this.description = description;

				return this;
			}
		});

		Object.defineProperties(book, {
			name: {
				get: function () {
					return this._name;
				}, 
				set: function (value) {
					if (!isValidValue(value, 'string', 2, 40)) {
						throw {
							name: 'BookNameError',
							message: 'Name must be string with length between 2 and 40 inclusive!'
						};
					}

					return this._name = value;
				}
			},
			description: {
				get: function () {
					return this._description;
				},
				set: function (value) {
					if (!isValidDescription(value)) {
						throw {
							name: 'BookDescriptionError',
							message: 'Description must be a non-empty string!'
						};
					}
				}
			},
			isbn: {
				get: function () {
					return this._isbn;
				},
				set: function (value) {
					if (!isvalidIsbn(value)) {
						throw {
							name: 'BookIsbnError',
							message: 'Isbn must be a string with length exactly 10 or 13 and contain digits only!'
						};
					}

					return this._isbn = value;
				}
			},
			genre: {
				get: function () {
					return this._genre;
				},
				set: function (value) {
					if (typeof(value) != 'string' || value.length < 2 || value.length > 20) {
						throw {
							name: 'BookGenreError',
							message: 'Genre must be a string with length between 2 and 20 inclusive!'
						};
					}

					return this._genre = value;
				}
			}
		});

		return book;
	}(item));

	var media = (function(parent){
		var media = Object.create(parent);

		Object.defineProperty(media, 'init' {
			value: function (name, rating, duration, description) {
				parent.init.call(this, name, description);

				this.rating = rating;
				this.duration = duration;

				return this;
			}
		});

		Object.defineProperties(media, {
			name: {
				get: function () {
					return this._name;
				}, 
				set: function (value) {
					if (!isValidValue(value)) {
						throw {
							name: 'BookNameError',
							message: 'Name must be string with length between 2 and 40 inclusive!'
						};
					}

					return this._name = value;
				}
			},
			description: {
				get: function () {
					return this._description;
				},
				set: function (value) {
					if (!isValidDescription(value, 'string', 2, 40)) {
						throw {
							name: 'BookDescriptionError',
							message: 'Description must be a non-empty string!'
						};
					}
				}
			},
			duration: {
				get: function () {
					return this._duration;
				},
				set: function (value) {
					value = +value;

					if (isNaN(value) || value <= 0) {
						throw {
							name: 'MediaDurationError',
							message: 'Duration must be a number greater than 0!'
						};
					}

					return this._duration = value;
				}
			},
			rating: {
				get: function () {
					return this._rating;
				},
				set: function (value) {
					if (!isValidValue(value, 'number', 1, 5)) {
						throw {
							name: 'MadiaRatingError',
							message: 'Rating must be a number between 1 and 5 inclusive!'
						};
					}

					return this._rating = value;
				}
			}
		});

		return media;
	}(item));

	return {
		getBook: function (name, isbn, genre, description) {
			//return a book instance
			return Object.create(book).init(name, isbn, genre, description);
		},
		getMedia: function (name, rating, duration, description) {
			//return a media instance
			return Object.create(media).init(name, rating, duration, description);
		}
		getBookCatalog: function (name) {
			//return a book catalog instance
			return Object.create(bookCatalog).init(name);
		},
		getMediaCatalog: function (name) {
			//return a media catalog instance
			return Object.create(mediaCatalog).init(name);
		}
	};
}

var module = solve();
var catalog = module.getBookCatalog('John\'s catalog');

var book1 = module.getBook('The secrets of the JavaScript Ninja', '1234567890', 'IT', 'A book about JavaScript');
var book2 = module.getBook('JavaScript: The Good Parts', '0123456789', 'IT', 'A good book about JS');
catalog.add(book1);
catalog.add(book2);

console.log(catalog.find(book1.id));
//returns book1

console.log(catalog.find({id: book2.id, genre: 'IT'}));
//returns book2

console.log(catalog.search('js')); 
// returns book2

console.log(catalog.search('javascript'));
//returns book1 and book2

console.log(catalog.search('Te sa zeleni'))
//returns []
