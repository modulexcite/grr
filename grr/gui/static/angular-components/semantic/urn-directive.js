'use strict';

goog.provide('grrUi.semantic.urnDirective.UrnController');
goog.provide('grrUi.semantic.urnDirective.UrnDirective');
goog.require('grrUi.core.fileDownloadUtils.vfsRoots');

goog.scope(function() {


/**
 * Controller for UrnDirective.
 *
 * @param {!angular.Scope} $scope
 * @param {!grrUi.routing.routingService.RoutingService} grrRoutingService
 * @constructor
 * @ngInject
 */
grrUi.semantic.urnDirective.UrnController = function(
    $scope, grrRoutingService) {

  /** @private {!angular.Scope} */
  this.scope_ = $scope;

  /** @private {!grrUi.routing.routingService.RoutingService} */
  this.grrRoutingService_ = grrRoutingService;

  /** @type {?string} */
  this.plainValue;

  /** @type {?string} */
  this.ref;

  /** @type {Object} */
  this.refParams;

  this.scope_.$watch('::value', this.onValueChange_.bind(this));
};
var UrnController = grrUi.semantic.urnDirective.UrnController;


/**
 * Regex that matches files inside the client.
 *
 * @const
 * @export
 */
grrUi.semantic.urnDirective.CLIENT_ID_RE = /^C\.[0-9a-fA-F]{16}$/;


/**
 * Handles value changes.
 *
 * @param {?string} newValue
 * @private
 */
UrnController.prototype.onValueChange_ = function(newValue) {
  if (angular.isObject(newValue)) {
    this.plainValue = newValue.value;
  } else if (angular.isString(newValue)) {
    this.plainValue = newValue;
  } else {
    return;
  }

  // Get the components without an "aff4" one.
  var components = this.plainValue.split('/').slice(1);
  if (grrUi.semantic.urnDirective.CLIENT_ID_RE.test(components[0])) {
    if (grrUi.core.fileDownloadUtils.vfsRoots.includes(components[1])) {
      this.refParams = {
        clientId: components[0],
        path: components.slice(1).join('/')
      };

      this.ref = this.grrRoutingService_.href('client.vfs', this.refParams);
    } else if (components[1] === 'flows' && components.length === 3) {
      this.refParams = {
        clientId: components[0],
        flowId: components[2]
      };

      this.ref = this.grrRoutingService_.href('client.flows', this.refParams);
    }
  } else if (components[0] === 'hunts' && components.length === 2) {
    this.refParams = {
      huntId: components[1]
    };

    this.ref = this.grrRoutingService_.href('hunts', this.refParams);
  }
};


/**
 * Handles clicks on the link.
 * @export
 */
UrnController.prototype.onClick = function() {
  this.grrRoutingService_.go('client.vfs', this.refParams);
};


/**
 * Directive that displays RDFURN values.
 *
 * @constructor
 * @ngInject
 * @export
 */
grrUi.semantic.urnDirective.UrnDirective = function() {
  return {
    scope: {
      value: '='
    },
    restrict: 'E',
    templateUrl: '/static/angular-components/semantic/urn.html',
    controller: UrnController,
    controllerAs: 'controller'
  };
};


/**
 * Directive's name in Angular.
 *
 * @const
 * @export
 */
grrUi.semantic.urnDirective.UrnDirective.directive_name =
    'grrUrn';

/**
 * Semantic type corresponding to this directive.
 *
 * @const
 * @export
 */
grrUi.semantic.urnDirective.UrnDirective.semantic_type =
    'RDFURN';


});  // goog.scope
