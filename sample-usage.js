function solve(){ 
	if (!Array.prototype.find) {
  		Array.prototype.find = function(predicate) {
		    if (this === null) {
		      throw new TypeError('Array.prototype.find called on null or undefined');
		    }
		    if (typeof predicate !== 'function') {
		      throw new TypeError('predicate must be a function');
		    }
		    var list = Object(this);
		    var length = list.length >>> 0;
		    var thisArg = arguments[1];
		    var value;

		    for (var i = 0; i < length; i++) {
		      value = list[i];
		      if (predicate.call(thisArg, value, i, list)) {
		        return value;
		      }
		    }
		    return undefined;
	  };
	}

	function isValidDescription (des) {
		return (typeof(des) === 'string' && des != '');
	}

	function isValidValue (value, valueType, minSize, maxSize) {
		return (typeof(value) === valueType && value.length >= minSize && value.length <= maxSize);
	}

	function isvalidIsbn (isbn) {
		var result = true;

		if (typeof(isbn) != 'string' || (isbn.length != 10 && isbn.length != 13)) {
			result = false;
		}

		isbn = +isbn;

		if (isNaN(isbn)) {
			result = false;
		}

		return result;
	}

	function isItem (value) {
		var itemLikeObj = (typeof(value.id) === 'number' && value.id > 0 && isValidDescription(value.description) && isValidValue(value.name, 'string', 2, 40));
		return (/*value.__proto__ === item || */itemLikeObj);
	}

	function isBook (value) {
		return (value.__proto__ === book || (isvalidIsbn(value.isbn) && isValidValue(value.genre, 'string', 2, 20)));
	}

	function isMedia (value) {
		return (value.__proto__ === media || (typeof(value.duration) === 'number' && value.duration > 0 && typeof(value.rating) === 'number' && value.rating >= 1 && value.rating <= 5));
	}

	function isInside (arr, val) {
		return arr.some(function(element) {
			return element === val;
		});
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

			Object.defineProperties(item, {
				'name': {
					get: function() {
						return this._name;
					},
					set: function(value) {
						if (!isValidValue(value, 'string', 2, 40)) {
							throw {
								name: 'BookNameError',
								message: 'Name must be string with length between 2 and 40 inclusive!'
							};
						}

						return this._name = value;
					}
				}, 
				'description': {
					get: function() {
						return this._description;
					},
					set: function(value) {
						if (!isValidDescription(value)) {
							throw {
								name: 'BookDescriptionError',
								message: 'Description must be a non-empty string!'
							};
						}

						this._description = value;
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
				this.genre = genre;

				return this;
			}
		});

		Object.defineProperties(book, {
			'isbn': {
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
			'genre': {
				get: function () {
					return this._genre;
				},
				set: function (value) {
					if (!isValidValue(value, 'string', 2, 20)) {
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

		Object.defineProperty(media, 'init', {
			value: function (name, rating, duration, description) {
				parent.init.call(this, name, description);

				this.rating = rating;
				this.duration = duration;

				return this;
			}
		});

		Object.defineProperties(media, {	
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
					if (typeof(value) != 'number' || value < 1 || value > 5) {
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

	var catalog = (function(){
		var catalogID = 0,
			catalog = Object.defineProperty({}, 'init', {
				value: function (name) {
					this.name = name;
					this.id = (catalogID += 1);
					this.items = [];

					return this;
				}
			});

			Object.defineProperties(catalog, {
				'name': {
					get: function () {
						return this._name;
					},
					set: function (value) {
						if (!isValidValue(value, 'string', 2, 40)) {
							throw {
								name: 'CatalogNameError',
								message: 'Name must be string with length between 2 and 40 inclusive!'
							}
						}
					}
				}, 
				'add': {
					value: function () {
						var args = [].slice.apply(arguments),
						result = [];

						if (!args.length) {
							throw {
								name: 'CatalogAddError',
								message: 'No items are passed to catalog.add()!'
							}
						}
				
						args.forEach(function (element) {
							if (Array.isArray(element)) {
								if (!element.length) {
									throw {
										name: 'CatalogAddError',
										message: 'An empty array was passed to catalog.add()!'
									}
								}
								
								element.forEach(function (member) {
									if (!isItem(member)) {
										throw {
											name: 'CatalogAddError',
											message: 'Invalid item was passed to catalog.add()'
										}
									}

									result.push(member);								
								});
							} else {
								if (!isItem(element)) {
									throw {
										name: 'CatalogAddError',
										message: 'Invalid item was passed to catalog.add()'
									}
								}

								result.push(element);
							}
						});

						if (result.length != 0) {
							this.items = (this.items).concat(result);
						}

						return this;
					}
				},
				'find': {
					value: function (val) {
						var result,
							self = this;
						
						if (typeof(val) === 'number') {

							result = this.items.find(function(element) {
								return element.id === val;
							});

							if (result === undefined) {
								return null;
							} else {
								return result;
							}
						} else {
							var props = Object.keys(val),
							    matchCriteria;

							result = self.items.filter(function (element) {
								matchCriteria = true;
								
								props.forEach(function (prop) {
									if (prop === 'name') {
										if (element[prop].toLowerCase() != val[prop].toLowerCase()) {
											matchCriteria = false;
										}
									} else {
										if (element[prop] != val[prop]) {
											matchCriteria = false;
										}
									}
								});

								return matchCriteria;			
							});

							return result;
						}
					}
				},
				'search': {
					value: function (pattern) {
						var result;

						if (typeof(pattern) != 'string' && pattern.length < 1) {
							throw {
								name: 'SearchError',
								message: 'Search pattern must be a string with length atleast 1!'
							};
						}

						pattern = pattern.toLowerCase();

						result = this.items.filter(function(element) {
							if ((element.name.toLowerCase()).indexOf(pattern) != -1 || (element.description.toLowerCase()).indexOf(pattern) != -1) {
								return element;
							}
						});

						return result;
					}
				}
			});

			return catalog;
	}());

	var bookCatalog = (function(parent){
		var bookCatalog = Object.create(parent);

		Object.defineProperty(bookCatalog, 'init', {
			value: function(name) {
				parent.init.call(this, name);

				this.items = [];

				return this;
			}
		});

		Object.defineProperties(bookCatalog, {
			'add':  {
				value: function () {
					/*var args = [].slice.apply(arguments);

					args.forEach(function(bookElement) {
						if (Array.isArray(bookElement)) {
							
							bookElement.forEach(function(member) {
								if (!isBook(member)) {
									throw {
										name: 'bookCatalogAddError',
										message: 'Item passed to bookCatalog.add must be Book instance or Book-like object'
									};
								}
							});
						} else {
							if (!isBook(bookElement)) {
								throw {
									name: 'bookCatalogAddError',
									message: 'Item passed to bookCatalog.add must be Book instance or Book-like object'
								};
							}
						}
					});*/

					parent.add.apply(this, arguments);

					return this;					
				}
			},
			'getGenres': {
				value: function() {
					var result = [],
						self = this;

					self.items.forEach(function(book) {	
						if (!isInside(result, book.genre)) {
							result.push((book.genre).toLowerCase());
						}
					});

					return result;
				}
			},
			'find': {
				value: function(options) {
					var result,
						self = this;
					if (typeof(options) === 'number') {
						result = self.items.find(function(element) {
							return element.id === options;
						});

						if (result === undefined) {
							return null;
						} else {
							return result;
						}
					} else {
						var props = Object.keys(options),
							matchCriteria;

						result = self.items.filter(function (element) {
							matchCriteria = true;
							
							props.forEach(function (prop) {
								if (prop === 'name' || prop === 'genre') {
									if (element[prop].toLowerCase() != options[prop].toLowerCase()) {
										matchCriteria = false;
									}
								} else {
									if (element[prop] != options[prop]) {
										matchCriteria = false;
									}
								}
							});

							return matchCriteria;			
						});

						return result;
					}
				}	
			} 
		});

		return bookCatalog;

	}(catalog));

	var mediaCatalog = (function(parent){
		var mediaCatalog = Object.create(parent);

		Object.defineProperty(mediaCatalog, 'init', {
			value: function(name) {
				parent.init.call(this, name);

				this.items = [];

				return this;
			}
		});

		Object.defineProperties(mediaCatalog, {
			'add': {
				value: function () {
					/*var args = [].slice.apply(arguments);

					args.forEach(function(mediaElement) {
						if (Array.isArray(mediaElement)) {
							
							mediaElement.forEach(function(member) {
								if (!isMedia(member)) {
									throw {
										name: 'mediaCatalogAddError',
										message: 'Item passed to mediaCatalog.add must be Media instance or Media-like object'
									};
								}
							});
						} else {
							if (!isMedia(mediaElement)) {
								throw {
									name: 'mediaCatalogAddError',
									message: 'Item passed to bookCatalog.add must be Media instance or Media-like object'
								};
							}
						}
					});*/

					parent.add.apply(this, arguments);

					return this;
				}
			},
			'getTop': {
				value: function(count) {
					if (typeof(count) != 'number' || count < 1) {
						throw {
							name: 'getTopError',
							message: 'Count must be a number equal or bigger than 1'
						};
					}

					var result = [];

					result = this.items.sort(function(a, b) {
									 	return b.rating - a.rating;
								     })
									 .filter(function(song, i, arr) {
									 	return i < count;
									 });

					return result;
				}
			},
			'getSortedByDuration': {
				value: function() {
					var self = this;

					return self.items.sort(function(a, b) {
										if (b.duration === a.duration) {
											return a.id - b.id;
										} else {
											return b.duration - a.duration;
										}
									 });

				}
			}
		});

		return mediaCatalog;

	}(catalog));

	return {
		getBook: function (name, isbn, genre, description) {
			//return a book instance
			return Object.create(book).init(name, isbn, genre, description);
		},
		getMedia: function (name, rating, duration, description) {
			//return a media instance
			return Object.create(media).init(name, rating, duration, description);
		},
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

//mediaCatalog_TEST
var module = solve();
var mediaCat = module.getMediaCatalog('Peter\'s catalog');

var song1 = module.getMedia('The Unforgiven', 5, 5, 'One of the best songs by Metallica');
var song2 = module.getMedia('Mama Said', 2, 4, 'Other song by Metallica');
var song3 = module.getMedia('Enter Sandman', 4, 6, 'Song from "Black Album"');
var song4 = module.getMedia('Pour Twisted Me', 1, 3, 'This one is from "Load"');
var song5 = module.getMedia('Until It Sleeps', 3, 4, 'This is from "Load" either');

mediaCat.add(song1);
mediaCat.add(song2);
mediaCat.add(song3);
mediaCat.add(song4);
mediaCat.add(song5);

console.log(mediaCat.getSortedByDuration());
console.log();
console.log();

console.log(mediaCat.getTop(3));

//--------------------------------------------------------------------------

//bookCatalog_TEST
var catalog = module.getBookCatalog('John\'s catalog');

var book1 = module.getBook('Just some book to test with', '1234567890', 'IT', 'Not so bad JavaScript Book');
var book2 = module.getBook('JavaScript: The Good Parts', '0123456789', 'IT', 'A good book about JS');
var bookMente = {
	id: 15,
	name: 'Am i the proper one',
	description: 'Some book to test',
	isbn: '1234567890',
	genre: 'Horror'
}
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

console.log(catalog.search('Te sa zeleni'));
//returns []
console.log(catalog.items);





































