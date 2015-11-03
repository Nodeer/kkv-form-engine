'use strict';

angular.module('nnAdmin')

    // Service that handles all logic related to slides.
    .service('SlideService', function ($log, $rootScope, $modal, $timeout, DEBUG, ApiService) {
        this.slides = [];
        this.slideOptions = [];

        var self = this;

        /**
         *
         * @param {Object} slide
         * @returns {Object}
         */
        function normalize(slide) {
            if (DEBUG) {
                $log.debug('Normalizing slide', slide);
            }
            if (angular.isObject(slide.style)) {
                slide.style = styleObjectToCollection(slide.style);
            }
            if (!angular.isArray(slide.style)) {
                slide.style = [];
            }
            if (!angular.isArray(slide.elements)) {
                slide.elements = [];
            }
            slide.elements = slide.elements || [];
            angular.forEach(slide.elements, function (value) {
                normalizeElement(value);
            });
            slide.order_number = parseInt(slide.order_number);
            slide.save_after = slide.save_after === '1';
            slide.summary_after = slide.summary_after === '1';
            slide.exclude_from_summary = slide.exclude_from_summary === '1';
            delete slide.self;
            return slide;
        }

        /**
         *
         * @param element
         */
        function normalizeElement(element) {
            if (angular.isUndefined(element.id)) {
                element.id = chance.guid();
            }
            if (angular.isDefined(element.style)) {
                element.style = styleObjectToCollection(element.style);
            }
            if (angular.isDefined(element.items)) {
                angular.forEach(element.items, function (value, key) {
                    normalizeElement(value);
                });
            }
        }

        /**
         *
         * @param {Object} slide
         * @returns {Object}
         */
        function serialize(slide) {
            if (DEBUG) {
                $log.debug('Serializing slide', slide);
            }
            angular.forEach(slide.elements, function (value) {
                serializeElement(value);
            });
            if (angular.isArray(slide.style)) {
                slide.style = styleCollectionToObject(slide.style);
            }
            slide.label = slide.label ? slide.label : '';
            slide.summary_label = slide.summary_label ? slide.summary_label : '';
            slide.save_after = slide.save_after ? '1' : '0';
            slide.summary_after = slide.summary_after ? '1' : '0';
            slide.exclude_from_summary = slide.exclude_from_summary ? '1' : '0';
            return slide;
        }

        /**
         *
         * @param {Object} element
         */
        function serializeElement(element) {
            if (angular.isDefined(element.style)) {
                element.style = styleCollectionToObject(element.style);
            }
            if (angular.isDefined(element.items)) {
                angular.forEach(element.items, function (value, key) {
                    serializeElement(value);
                });
            }
        }

        /**
         *
         * @param {Object} style
         * @returns {Array}
         */
        function styleObjectToCollection(style) {
            var collection = [];
            angular.forEach(style, function (value, key) {
                collection.push({property: key, value: value});
            });
            return collection;
        }

        /**
         *
         * @param {Array} style
         * @returns {Object}
         */
        function styleCollectionToObject(style) {
            var object = {};
            angular.forEach(style, function (value) {
                object[value.property] = value.value;
            });
            return object;
        }

        /**
         *
         * @param {Number} index
         * @returns {Object}
         */
        function get(index) {
            return angular.isDefined(self.slides[index]) ? self.slides[index] : null;
        }

        /**
         *
         * @param {Number} index
         * @param {Object} slide
         */
        function set(index, slide) {
            self.slides[index] = slide;
        }

        /**
         *
         * @param {Object} slide
         */
        function save(slide) {
            var id = slide.id;
            var copy = angular.copy(slide);
            copy = serialize(copy);
            copy.elements = angular.toJson(copy.elements);
            copy.style = angular.toJson(copy.style);
            delete copy.id;
            return ApiService.saveSlide(id, copy)
                .then(function (response) {
                    $log.debug('Saved slide', copy);
                }, function (response) {
                    $log.error('Failed to save slide', copy);
                });
        }

        /**
         *
         * @param {object} slide
         * @param {string} name
         * @returns {boolean}
         */
        function isNextSlide(slide, name) {
            var found = false;
            angular.forEach(slide.elements, function (value, key) {
                if (angular.isDefined(value.next_slide) && value.next_slide === name) {
                    found = true;
                }
                found = findSlideIdInElement(value, name) || found;
            });
            return found;
        }

        /**
         *
         * @param {object} element
         * @param {string} name
         * @returns {boolean}
         */
        function findSlideIdInElement(element, name) {
            var found = false;
            if (angular.isDefined(element.next_slide) && element.next_slide === name) {
                found = true;
            }
            if (angular.isDefined(element.items)) {
                angular.forEach(element.items, function (value, key) {
                    if (angular.isObject(value)) {
                        found = findSlideIdInElement(value, name) || found;
                    }
                });
            }
            return found;
        }

        /**
         *
         * @returns {promise}
         */
        function load() {
            return ApiService.getSlides()
                .then(function (response) {
                    if (response.data.data.length) {
                        self.slides = [];
                        angular.forEach(response.data.data, function (value, key) {
                            self.slides.push(normalize(value));
                            self.slideOptions.push({name: value.name, label: value.label});
                        });
                    }
                }, function (response) {
                    $log.error('Failed to load slides.');
                });
        }

        /**
         *
         * @param to
         * @returns {boolean}
         */
        function canMove(to) {
            return to >= 0 && to <= (self.slides.length - 1);
        }

        /**
         *
         * @param from
         * @param to
         */
        function move(from, to) {
            if (!canMove(to)) {
                return;
            }
            var tmp = angular.copy(self.slides);
            var removed = tmp.splice(from, 1);
            if (!removed.length) {
                return;
            }
            tmp.splice(to, 0, removed[0]);
            self.slides = tmp;
            saveOrder();
        }

        /**
         *
         */
        function saveOrder() {
            var data = {};
            angular.forEach(self.slides, function (slide, index) {
                data[slide.id] = index;
            });
            ApiService.saveSlideOrder(data)
                .then(function (response) {
                    $log.debug('Saved slide order', data);
                    load();
                }, function (response) {
                    $log.error('Failed to save slide order.');
                });
        }

        /**
         *
         * @param {object} data
         */
        function updateOrder(data) {
            angular.forEach(self.slides, function (slide) {
                if (angular.isDefined(data[slide.id])) {
                    slide.order_number = data[slide.id];
                }
            });
        }

        /**
         *
         */
        function add() {
            var slide = {
                label: '',
                name: '',
                order_number: self.slides.length + 1
            };

            ApiService.createSlide(slide)
                .then(function (response) {
                    $log.debug('Slide created', response.data.data[0]);
                    self.slides.push(normalize(response.data.data[0]));
                }, function (response) {
                    $log.error('Failed to create slide.');
                });
        }

        /**
         *
         * @param {number} id
         * @param {number} index
         */
        function remove(id, index) {
            ApiService.removeSlide(id)
                .then(function (response) {
                    $log.debug('Slide removed', id);
                    self.slides.splice(index, 1);
                }, function (response) {
                    $log.error('Failed to remove slide.');
                });
        }

        /**
         * @param {object} slide
         * @param {array} slides
         * @returns {number}
         */
        function getIndex(slide, slides) {
            if (angular.isUndefined(slides)) {
                slides = self.slides;
            }

            return slides.indexOf(slide);
        }

        this.get = get;
        this.set = set;
        this.save = save;
        this.isNextSlide = isNextSlide;
        this.load = load;
        this.canMove = canMove;
        this.move = move;
        this.add = add;
        this.remove = remove;
        this.getIndex = getIndex;
    });
