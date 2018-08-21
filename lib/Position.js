'use strict'

exports.__esModule = true

var _propTypes = require('prop-types')

var _propTypes2 = _interopRequireDefault(_propTypes)

var _react = require('react')

var _react2 = _interopRequireDefault(_react)

var _propTypes3 = require('./utils/propTypes')

var _position = require('dom-helpers/query/position')

var _position2 = _interopRequireDefault(_position)

var _scrollTop = require('dom-helpers/query/scrollTop')

var _scrollTop2 = _interopRequireDefault(_scrollTop)

var _scrollLeft = require('dom-helpers/query/scrollLeft')

var _scrollLeft2 = _interopRequireDefault(_scrollLeft)

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

var Position = (function(_React$Component) {
  _inherits(Position, _React$Component)

  function Position() {
    _classCallCheck(this, Position)

    return _possibleConstructorReturn(
      this,
      _React$Component.apply(this, arguments)
    )
  }

  Position.prototype.componentDidMount = function componentDidMount() {
    var _props = this.props,
      container = _props.container,
      disable = _props.disable,
      _props$offset = _props.offset,
      offset = _props$offset === undefined ? {} : _props$offset

    var el = this.refs.root

    var _getPosition = (0, _position2.default)(el, container),
      top = _getPosition.top,
      left = _getPosition.left,
      width = _getPosition.width,
      height = _getPosition.height

    var bottom = top + height
    var right = left + width
    var vertGap = container.clientHeight + (0, _scrollTop2.default)(container)
    var horGap = container.clientWidth + (0, _scrollLeft2.default)(container)

    if (disable !== true && (bottom >= vertGap || right >= horGap)) {
      if (bottom > vertGap && disable !== 'top') {
        el.style.top = top - (bottom - vertGap) - (offset.y || 0) + 'px'
      }
      if (right > horGap && disable !== 'left') {
        el.style.left = left - (right - horGap) - (offset.x || 0) + 'px'
      }
    }
  }

  Position.prototype.render = function render() {
    var _props2 = this.props,
      _props2$offset = _props2.offset,
      offset = _props2$offset === undefined ? {} : _props2$offset,
      children = _props2.children,
      _props2$position = _props2.position,
      position = _props2$position === undefined ? {} : _props2$position,
      zIndex = _props2.zIndex
    var left = position.left,
      width = position.width,
      top = position.top

    var style = {
      position: 'absolute',
      top: Math.max(0, top) + (offset.y || 0),
      left: Math.max(0, left) + (offset.x || 0),
      zIndex: zIndex,
      width: offset.width || width + width / 2,
    }

    return _react2.default.createElement(
      'div',
      { ref: 'root', style: style },
      children
    )
  }

  return Position
})(_react2.default.Component)

Position.propTypes = {
  disable: _propTypes2.default.oneOf([true, false, 'top', 'left']),
  offset: _propTypes3.popupOffsetShape,
  position: _propTypes2.default.object,
  container: _propTypes2.default.object,
  zIndex: _propTypes2.default.number,
}
Position.defaultProps = {
  vertOffsetGetter: 'clientHeight',
  zIndex: 5,
  disable: false,
  container: window,
}
exports.default = Position
module.exports = exports['default']
