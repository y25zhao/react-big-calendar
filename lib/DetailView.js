'use strict'

exports.__esModule = true

var _propTypes = require('prop-types')

var _propTypes2 = _interopRequireDefault(_propTypes)

var _react = require('react')

var _react2 = _interopRequireDefault(_react)

var _propTypes3 = require('./utils/propTypes')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    )
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass
    )
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  })
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass)
}

var DetailView = (function(_React$Component) {
  _inherits(DetailView, _React$Component)

  function DetailView() {
    _classCallCheck(this, DetailView)

    return _possibleConstructorReturn(
      this,
      _React$Component.apply(this, arguments)
    )
  }

  DetailView.prototype.render = function render() {
    var _props = this.props,
      event = _props.event,
      getters = _props.getters,
      accessors = _props.accessors,
      getNow = _props.getNow,
      localizer = _props.localizer,
      View = _props.View

    return _react2.default.createElement(View, {
      event: event,
      getters: getters,
      accessors: accessors,
      localizer: localizer,
      getNow: getNow,
    })
  }

  return DetailView
})(_react2.default.Component)

DetailView.propTypes = {
  View: _propTypes3.elementType.isRequired,
  getNow: _propTypes2.default.func.isRequired,
  event: _propTypes2.default.object,
  accessors: _propTypes2.default.object.isRequired,
  getters: _propTypes2.default.object.isRequired,
  localizer: _propTypes2.default.object.isRequired,
}
exports.default = DetailView
module.exports = exports['default']
