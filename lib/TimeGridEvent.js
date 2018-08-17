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

var _classnames = require('classnames')

var _classnames2 = _interopRequireDefault(_classnames)

var _react = require('react')

var _react2 = _interopRequireDefault(_react)

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

/* eslint-disable react/prop-types */
var TimeGridEvent = (function(_React$Component) {
  _inherits(TimeGridEvent, _React$Component)

  function TimeGridEvent() {
    _classCallCheck(this, TimeGridEvent)

    return _possibleConstructorReturn(
      this,
      _React$Component.apply(this, arguments)
    )
  }

  TimeGridEvent.prototype.render = function render() {
    var _extends2

    var _props = this.props,
      style = _props.style,
      className = _props.className,
      event = _props.event,
      accessors = _props.accessors,
      isRtl = _props.isRtl,
      selected = _props.selected,
      label = _props.label,
      localizer = _props.localizer,
      continuesEarlier = _props.continuesEarlier,
      continuesLater = _props.continuesLater,
      getters = _props.getters,
      _props$components = _props.components,
      Event = _props$components.event,
      EventWrapper = _props$components.eventWrapper

    var title = accessors.title(event)
    var tooltip = accessors.tooltip(event)
    var end = accessors.end(event)
    var start = accessors.start(event)
    var status = accessors.status(event)

    var userProps = getters.eventProp(event, start, end, selected)

    var height = style.height,
      top = style.top,
      width = style.width,
      xOffset = style.xOffset

    var additionalClassNames = {
      'rbc-selected': selected,
      'rbc-event-continues-earlier': continuesEarlier,
      'rbc-event-continues-later': continuesLater,
    }

    if (status && status.length) {
      additionalClassNames['rbc-event-status-' + status.toLowerCase()] = status
    }

    return _react2.default.createElement(
      EventWrapper,
      _extends({ type: 'time' }, this.props),
      _react2.default.createElement(
        'div',
        {
          style: _extends(
            {},
            userProps.style,
            ((_extends2 = {
              top: top + '%',
              height: height + '%',
            }),
            (_extends2[isRtl ? 'right' : 'left'] = Math.max(0, xOffset) + '%'),
            (_extends2.width = width + '%'),
            _extends2)
          ),
          ref: 'root',
          className: (0, _classnames2.default)(
            'rbc-event',
            className,
            userProps.className,
            additionalClassNames
          ),
        },
        Event
          ? _react2.default.createElement(Event, {
              event: event,
              label: label,
              title: title,
              tooltip: tooltip,
              style: style,
              selected: selected,
              localizer: localizer,
            })
          : title
      )
    )
  }

  TimeGridEvent.prototype.componentDidMount = function componentDidMount() {
    if (this.refs.root) {
      var _props2 = this.props,
        isExpandable = _props2.isExpandable,
        parentSelector = _props2.parentSelector,
        smallEventBoundary = _props2.smallEventBoundary

      if (this.props.parentSelector && this.props.isExpandable) {
        var _refs$root$getBoundin = this.refs.root.getBoundingClientRect(),
          top = _refs$root$getBoundin.top,
          left = _refs$root$getBoundin.left

        var parent = document.querySelector(parentSelector)
        var parentHeight = parent.scrollHeight
        var parentWidth = parent.scrollWidth
        var isOpensOverVert = top + isExpandable.y > parentHeight
        var isOpensOverHor = left + isExpandable.x > parentWidth

        if (isOpensOverVert) {
          this.refs.root.classList.add('pos-bottom')
        } else {
          this.refs.root.classList.remove('pos-bottom')
        }

        if (isOpensOverHor) {
          this.refs.root.classList.add('pos-right')
        } else {
          this.refs.root.classList.remove('pos-right')
        }
      }

      if (smallEventBoundary) {
        if (this.refs.root.clientWidth < smallEventBoundary) {
          this.refs.root.classList.add('size-small')
        } else {
          this.refs.root.classList.remove('size-small')
        }
      }
    }
  }

  return TimeGridEvent
})(_react2.default.Component)

exports.default = TimeGridEvent
module.exports = exports['default']
