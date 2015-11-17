angular.module('nnAdmin')

  .config(function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.when('/', '/slides');

    $stateProvider.state('slides', {
      url: '/slides',
      templateUrl: 'components/slides/edit/edit.html',
      controller: 'EditSlideCtrl',
      resolve: {
        ensureAuthenticated: function(authService) {
          return authService.ensureAuthenticated();
        },
        querySlides: function(slideService) {
          return function() {
            return slideService.query();
          }
        }
      }
    });
  })

  .controller('EditSlideCtrl', function($scope, $log, $timeout, DEBUG, FLOWCHART_URL, querySlides, languageService, slideService, slideSerializer, SlideState, elementService, previewService) {

    var ready = false;
    var updateTimeout;
    var saveDelay = 3000;

    $scope.currentIndex = 0;
    $scope.slides = [];
    $scope.slideService = slideService;
    $scope.elementService = elementService;
    $scope.previewService = previewService;
    $scope.loadingText = '';
    $scope.flowchartUrl = '';
    $scope.status = SlideState.CLEAN;
    $scope.debug = DEBUG;
    $scope.adding = false;
    $scope.languages = [];

    /**
     * @returns {Promise}
     */
    function loadSlides() {
      $scope.loading = true;

      return querySlides()
        .then(function(response) {
          $scope.slides = response.data;

          activateSlide($scope.currentIndex);
        })
        .finally(function() {
          $scope.loading = false;
        });
    }

    /**
     * @returns {Promise}
     */
    function loadLanguages() {
      return languageService.getLanguages()
        .then(function(languages) {
          $scope.languages = languages;
        });
    }

    /**
     *
     * @param slide
     */
    function updateSlide(slide) {
      if (!ready) {
        return;
      }

      if ($scope.status !== SlideState.DIRTY) {
        return;
      }

      $scope.status = SlideState.SAVING;

      slideService.save(slide)
        .then(function(response) {
          $scope.status = SlideState.CLEAN;
        }, function() {
          $scope.status = SlideState.DIRTY;
        });
    }

    /**
     * Activates a specific slide.
     * @param {number} index
     */
    function activateSlide(index) {
      $scope.model = $scope.slides[index];

      angular.forEach(['label', 'summary_label'], function(prop) {
        if (angular.isString($scope.model[prop]) || angular.isArray($scope.model[prop])) {
          var value = angular.isString($scope.model[prop]) ? $scope.model[prop] : undefined;
          $scope.model[prop] = {fi: value};
        }
      });

      $scope.currentIndex = index;
    }

    /**
     * Updates the flowchart URL.
     */
    function updateFlowchart() {
      var url = FLOWCHART_URL;
      var label, l;

      angular.forEach($scope.slides, function(value, key) {
        label = value.label.fi + (value.save_after ? ';SAVE{bg:limegreen}' : '');
        angular.forEach($scope.slides, function(v, k) {
          l = v.label.fi + (v.save_after ? ';SAVE{bg:limegreen}' : '');
          if (isNextSlide(value, v.name)) {
            url += '[' + label + ']->[' + l + '],';
          }
        });
        if (value.summary_after) {
          url += '[' + label + ']->[Yhteenveto],';
        }
      });

      $scope.flowchartUrl = url;
    }

    /**
     *
     * @param {object} slide
     * @param {string} name
     * @returns {boolean}
     */
    function isNextSlide(slide, name) {
      var found = false;

      angular.forEach(slide.elements, function(element) {
        found = findSlideIdInElement(element, name) || found;
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

      if (angular.isArray(element.items)) {
        angular.forEach(element.items, function(item) {
          if (angular.isObject(item)) {
            found = findSlideIdInElement(item, name) || found;
          }
        });
      }

      return found;
    }

    $scope.activateSlide = activateSlide;

    /**
     * Creates an element on the current slide.
     * @param type
     */
    $scope.createElement = function(type) {
      elementService.create($scope.model.elements, type);
      $scope.adding = false;
    };

    /**
     * @param {object} slide
     * @returns {number}
     */
    $scope.getSlideIndex = function(slide) {
      return $scope.slides.indexOf(slide);
    };

    /**
     * Returns whether a given slide leads to the current slide.
     * @param {Object} slide
     * @returns {boolean}
     */
    $scope.isSourceSlide = function(slide) {
      return isNextSlide(slide, $scope.model.name);
    };

    /**
     * Returns whether the current slide leads to a specific slide.
     * @param {string} name
     * @returns {boolean}
     */
    $scope.isDestinationSlide = function(name) {
      return isNextSlide($scope.model, name);
    };

    $scope.$on('resource.slides.create', function() {
      $scope.currentIndex = $scope.slides.length;

      loadSlides();
    });

    $scope.$on('resource.slides.delete', loadSlides);

    function startWatcher() {
      $scope.$watch('model', function(value, old) {
        if (!value || (old && value.name !== old.name)) {
          return;
        }

        if (updateTimeout) {
          $timeout.cancel(updateTimeout);
        }

        if (ready) {
          $scope.status = SlideState.DIRTY;
        }

        updateTimeout = $timeout(function() {
          updateSlide(value);
          updateFlowchart();

          ready = true;
        }, saveDelay);
      }, true);
    }

    loadLanguages()
      .then(loadSlides)
      .then(startWatcher);
  });
