'use strict'

exports.__esModule = true

var _propTypes = require('prop-types')

var _propTypes2 = _interopRequireDefault(_propTypes)

var _react = require('react')

var _react2 = _interopRequireDefault(_react)

var _classnames = require('classnames')

var _classnames2 = _interopRequireDefault(_classnames)

var _offset = require('dom-helpers/query/offset')

var _offset2 = _interopRequireDefault(_offset)

var _scrollTop = require('dom-helpers/query/scrollTop')

var _scrollTop2 = _interopRequireDefault(_scrollTop)

var _scrollLeft = require('dom-helpers/query/scrollLeft')

var _scrollLeft2 = _interopRequireDefault(_scrollLeft)

var _dates = require('./utils/dates')

var _dates2 = _interopRequireDefault(_dates)

var _Header = require('./Header')

var _Header2 = _interopRequireDefault(_Header)

var _EventCell = require('./EventCell')

var _EventCell2 = _interopRequireDefault(_EventCell)

var _selection = require('./utils/selection')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function _objectWithoutProperties(obj, keys) {
  var target = {}
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
    target[i] = obj[i]
  }
  return target
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

var propTypes = {
  position: _propTypes2.default.object,
  getNow: _propTypes2.default.func.isRequired,
  popupOffset: _propTypes2.default.oneOfType([
    _propTypes2.default.number,
    _propTypes2.default.shape({
      x: _propTypes2.default.number,
      y: _propTypes2.default.number,
      maxWidth: _propTypes2.default.number,
    }),
  ]),
  events: _propTypes2.default.array,
  selected: _propTypes2.default.object,
  maxWidth: _propTypes2.default.number,

  accessors: _propTypes2.default.object.isRequired,
  components: _propTypes2.default.object.isRequired,
  getters: _propTypes2.default.object.isRequired,
  localizer: _propTypes2.default.object.isRequired,
  onSelect: _propTypes2.default.func,
  onDoubleClick: _propTypes2.default.func,
  slotStart: _propTypes2.default.instanceOf(Date),
  slotEnd: _propTypes2.default.instanceOf(Date),
}

var Popup = (function(_React$Component) {
  _inherits(Popup, _React$Component)

  function Popup() {
    _classCallCheck(this, Popup)

    return _possibleConstructorReturn(
      this,
      _React$Component.apply(this, arguments)
    )
  }

  Popup.prototype.componentDidMount = function componentDidMount() {
    var _props$popupOffset = this.props.popupOffset,
      popupOffset = _props$popupOffset === undefined ? 5 : _props$popupOffset,
      _getOffset = (0, _offset2.default)(this.refs.root),
      top = _getOffset.top,
      left = _getOffset.left,
      width = _getOffset.width,
      height = _getOffset.height,
      viewBottom = window.innerHeight + (0, _scrollTop2.default)(window),
      viewRight = window.innerWidth + (0, _scrollLeft2.default)(window),
      bottom = top + height,
      right = left + width

    if (bottom > viewBottom || right > viewRight) {
      var topOffset = void 0,
        leftOffset = void 0

      if (bottom > viewBottom)
        topOffset = bottom - viewBottom + (popupOffset.y || +popupOffset || 0)
      if (right > viewRight)
        leftOffset = right - viewRight + (popupOffset.x || +popupOffset || 0)

      this.setState({ topOffset: topOffset, leftOffset: leftOffset }) //eslint-disable-line
    }
  }

  Popup.prototype.render = function render() {
    var _props = this.props,
      events = _props.events,
      selected = _props.selected,
      getters = _props.getters,
      accessors = _props.accessors,
      components = _props.components,
      onSelect = _props.onSelect,
      onDoubleClick = _props.onDoubleClick,
      slotStart = _props.slotStart,
      getNow = _props.getNow,
      slotEnd = _props.slotEnd,
      _props$popupOffset2 = _props.popupOffset,
      popupOffset =
        _props$popupOffset2 === undefined ? {} : _props$popupOffset2,
      localizer = _props.localizer
    var _props$position = this.props.position,
      left = _props$position.left,
      width = _props$position.width,
      top = _props$position.top,
      topOffset = (this.state || {}).topOffset || 0,
      leftOffset = (this.state || {}).leftOffset || 0

    var style = {
      top: Math.max(0, top - topOffset),
      left: left - leftOffset,
      minWidth: Math.min(popupOffset.maxWidth || Infinity, width + width / 2),
      maxWidth: popupOffset.maxWidth || 'auto',
    }

    var popupHeader = components.popupHeader,
      eventComponents = _objectWithoutProperties(components, ['popupHeader'])

    var HeaderComponent = popupHeader || _Header2.default

    var today = getNow()

    var header = _react2.default.createElement(HeaderComponent, {
      date: slotStart,
      label: localizer.format(slotStart, 'dayHeaderFormat'),
      localizer: localizer,
    })

    return _react2.default.createElement(
      'div',
      { ref: 'root', style: style, className: 'rbc-overlay' },
      _react2.default.createElement(
        'div',
        {
          className: (0, _classnames2.default)('rbc-overlay-header', {
            'rbc-today': _dates2.default.eq(slotStart, today, 'day'),
          }),
        },
        header
      ),
      _react2.default.createElement(
        'div',
        { className: 'rbc-overlay-content' },
        events.map(function(event, idx) {
          return _react2.default.createElement(_EventCell2.default, {
            key: idx,
            type: 'popup',
            event: event,
            getters: getters,
            onSelect: onSelect,
            accessors: accessors,
            components: eventComponents,
            localizer: localizer,
            onDoubleClick: onDoubleClick,
            continuesPrior: _dates2.default.lt(
              accessors.end(event),
              slotStart,
              'day'
            ),
            continuesAfter: _dates2.default.gte(
              accessors.start(event),
              slotEnd,
              'day'
            ),
            selected: (0, _selection.isSelected)(event, selected),
          })
        })
      )
    )
  }

  return Popup
})(_react2.default.Component)

Popup.propTypes = propTypes

exports.default = Popup
module.exports = exports['default']
