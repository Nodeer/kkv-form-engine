'use strict';

angular.module('nnAdmin')

  .config(function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.when('/', '/edit');

    $stateProvider.state('edit', {
      url: '/edit',
      templateUrl: 'components/edit/edit.html',
      controller: 'EditCtrl',
      resolve: {
        ensureAuthenticated: function(AuthService) {
          return AuthService.ensureAuthenticated();
        }
      }
    });
  })

  .controller('EditCtrl', function($scope, $timeout, $log, DEBUG, FLOWCHART_URL, SlideService, ElementService, PreviewService) {

    var loadDelay = 1000;
    var saveDelay = 1000;

    $scope.currentIndex = 0;
    $scope.model = {};
    $scope.slideService = SlideService;
    $scope.elementService = ElementService;
    $scope.previewService = PreviewService;
    $scope.loadingText = '';
    $scope.flowchartUrl = '';
    $scope.adding = false;
    $scope.status = 'saved';
    $scope.debug = DEBUG;

    /**
     * Creates an element on the current slide.
     * @param type
     */
    function createElement(type) {
      ElementService.create($scope.model.elements, type);
      $scope.adding = false;
    }

    /**
     * Activates a specific slide.
     * @param {number} index
     */
    function activateSlide(index) {
      SlideService.set($scope.currentIndex, $scope.model);
      $scope.model = SlideService.get(index);
      $scope.currentIndex = index;
    }

    /**
     * Saves a specific slide through the slide service.
     */
    function saveSlide(slide) {
      var begin = +new Date();
      $scope.status = 'saving';
      SlideService.save(slide)
        .then(function(response) {
          var delay = loadDelay - (+new Date() - begin);
          $timeout(function() {
            $scope.status = 'saved';
          }, delay);
        }, function(response) {
          $scope.status = 'dirty';
        });
    }

    /**
     * Returns whether a given slide leads to the current slide.
     * @param {Object} slide
     * @returns {boolean}
     */
    function isSourceSlide(slide) {
      return SlideService.isNextSlide(slide, $scope.model.name);
    }

    /**
     * Returns whether the current slide leads to a specific slide.
     * @param {string} name
     * @returns {boolean}
     */
    function isDestinationSlide(name) {
      return SlideService.isNextSlide($scope.model, name);
    }

    /**
     * Loads all the available slides through the slide service.
     */
    function loadSlides() {
      var begin = +new Date();
      $scope.loading = true;
      SlideService.load()
        .then(function() {
          updateFlowchart();
          var delay = loadDelay - (+new Date() - begin);
          $timeout(function() {
            $scope.model = SlideService.get($scope.currentIndex);
            $scope.loading = false;
          }, delay);
        }, function() {
          $scope.loading = false;
        });
    }

    /**
     * Updates the flowchart URL.
     */
    function updateFlowchart() {
      var flowchart = FLOWCHART_URL;
      var label, l;
      angular.forEach(SlideService.slides, function(value, key) {
        label = value.label + (value.save_after ? ';SAVE{bg:limegreen}' : '');
        angular.forEach(SlideService.slides, function(v, k) {
          l = v.label + (v.save_after ? ';SAVE{bg:limegreen}' : '');
          if (SlideService.isNextSlide(value, v.name)) {
            flowchart += '[' + label + ']->[' + l + '],';
          }
        });
        if (value.summary_after) {
          flowchart += '[' + label + ']->[Yhteenveto],';
        }
      });
      $timeout(function() {
        $scope.flowchartUrl = flowchart;
      });
    }

    /**
     * Sets up a watcher for the model so that we can save it when it changes.
     */
    function watchModel() {
      var timeout;

      $scope.$watch('model', function(value, old) {
        if ($scope.loading || value.name !== old.name) {
          return;
        }
        if (timeout) {
          $timeout.cancel(timeout);
        }
        $scope.status = 'dirty';
        timeout = $timeout(function() {
          saveSlide(value);
          updateFlowchart();
        }, saveDelay);
      }, true);
    }

    $scope.createElement = createElement;
    $scope.activateSlide = activateSlide;
    $scope.isSourceSlide = isSourceSlide;
    $scope.isDestinationSlide = isDestinationSlide;
    $scope.saveSlide = saveSlide;

    loadSlides();
    watchModel();

  });
