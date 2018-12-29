'use strict'

exports.__esModule = true

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i]
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }
    return target
  }

var _propTypes = require('prop-types')

var _propTypes2 = _interopRequireDefault(_propTypes)

var _react = require('react')

var _react2 = _interopRequireDefault(_react)

var _classnames = require('classnames')

var _classnames2 = _interopRequireDefault(_classnames)

var _debounce = require('lodash/debounce')

var _debounce2 = _interopRequireDefault(_debounce)

var _dates = require('./utils/dates')

var _dates2 = _interopRequireDefault(_dates)

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
  event: _propTypes2.default.object.isRequired,
  slotStart: _propTypes2.default.instanceOf(Date),
  slotEnd: _propTypes2.default.instanceOf(Date),

  selected: _propTypes2.default.bool,
  isAllDay: _propTypes2.default.bool,
  continuesPrior: _propTypes2.default.bool,
  continuesAfter: _propTypes2.default.bool,

  accessors: _propTypes2.default.object.isRequired,
  components: _propTypes2.default.object.isRequired,
  getters: _propTypes2.default.object.isRequired,
  localizer: _propTypes2.default.object.isRequired,

  onSelect: _propTypes2.default.func,
  onClick: _propTypes2.default.func,
  onDoubleClick: _propTypes2.default.func,
}

var EventCell = (function(_React$Component) {
  _inherits(EventCell, _React$Component)

  function EventCell() {
    var _temp, _this, _ret

    _classCallCheck(this, EventCell)

    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key]
    }

    return (
      (_ret = ((_temp = ((_this = _possibleConstructorReturn(
        this,
        _React$Component.call.apply(_React$Component, [this].concat(args))
      )),
      _this)),
      (_this.handleClick = function(e) {
        e.persist()
        var target = e.target
        if (!_this._delayedClick) {
          _this._delayedClick = (0, _debounce2.default)(function() {
            _this.clickedOnce = undefined
            _this.props.onClick(_this.props.event, target)
          }, 250)
        }
        if (_this.clickedOnce) {
          _this._delayedClick.cancel()
          _this.clickedOnce = false
          if (_this.props.onDoubleClick) {
            _this.props.onDoubleClick(_this.props.event, target)
          }
        } else {
          _this._delayedClick(e)
          _this.clickedOnce = true
        }
      }),
      _temp)),
      _possibleConstructorReturn(_this, _ret)
    )
  }

  EventCell.prototype.render = function render() {
    var _props = this.props,
      style = _props.style,
      className = _props.className,
      event = _props.event,
      selected = _props.selected,
      isAllDay = _props.isAllDay,
      localizer = _props.localizer,
      onClick = _props.onClick,
      continuesPrior = _props.continuesPrior,
      continuesAfter = _props.continuesAfter,
      accessors = _props.accessors,
      getters = _props.getters,
      _props$components = _props.components,
      Event = _props$components.event,
      EventWrapper = _props$components.eventWrapper,
      props = _objectWithoutProperties(_props, [
        'style',
        'className',
        'event',
        'selected',
        'isAllDay',
        'localizer',
        'onClick',
        'continuesPrior',
        'continuesAfter',
        'accessors',
        'getters',
        'components',
      ])

    var title = accessors.title(event)
    var tooltip = accessors.tooltip(event)
    var end = accessors.end(event)
    var start = accessors.start(event)
    var allDay = accessors.allDay(event)
    var status = accessors.status(event)

    var showAsAllDay =
      isAllDay ||
      allDay ||
      _dates2.default.diff(start, _dates2.default.ceil(end, 'day'), 'day') > 1

    var userProps = getters.eventProp(event, start, end, selected)

    var additionalClassNames = {
      'rbc-selected': selected,
      'rbc-event-allday': showAsAllDay,
      'rbc-event-continues-prior': continuesPrior,
      'rbc-event-continues-after': continuesAfter,
    }

    if (status && status.length) {
      additionalClassNames['rbc-event-status-' + status.toLowerCase()] = status
    }

    return _react2.default.createElement(
      EventWrapper,
      _extends({}, this.props, { type: 'date' }),
      _react2.default.createElement(
        'div',
        _extends({}, props, {
          ref: 'cell',
          style: _extends({}, userProps.style, style),
          className: (0, _classnames2.default)(
            'rbc-event',
            className,
            userProps.className,
            additionalClassNames
          ),
          // onClick={e => {
          //   onSelect && onSelect(event, e)
          //   // onClick && onClick(event, e.target)
          // }}
          onClick: this.handleClick,
        }),
        Event
          ? _react2.default.createElement(Event, {
              eventData: event,
              title: title,
              isAllDay: allDay,
              localizer: localizer,
              tooltip: tooltip,
              onClick: onClick,
              selected: selected,
              style: style,
            })
          : title
      )
    )
  }

  return EventCell
})(_react2.default.Component)

EventCell.propTypes = propTypes

exports.default = EventCell
module.exports = exports['default']
