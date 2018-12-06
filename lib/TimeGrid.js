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

var _classnames = require('classnames')

var _classnames2 = _interopRequireDefault(_classnames)

var _requestAnimationFrame = require('dom-helpers/util/requestAnimationFrame')

var _requestAnimationFrame2 = _interopRequireDefault(_requestAnimationFrame)

var _position = require('dom-helpers/query/position')

var _position2 = _interopRequireDefault(_position)

var _react = require('react')

var _react2 = _interopRequireDefault(_react)

var _reactDom = require('react-dom')

var _debounce = require('lodash/debounce')

var _debounce2 = _interopRequireDefault(_debounce)

var _propTypes3 = require('./utils/propTypes')

var _dates = require('./utils/dates')

var _dates2 = _interopRequireDefault(_dates)

var _DayColumn = require('./DayColumn')

var _DayColumn2 = _interopRequireDefault(_DayColumn)

var _TimeGutter = require('./TimeGutter')

var _TimeGutter2 = _interopRequireDefault(_TimeGutter)

var _width = require('dom-helpers/query/width')

var _width2 = _interopRequireDefault(_width)

var _TimeGridHeader = require('./TimeGridHeader')

var _TimeGridHeader2 = _interopRequireDefault(_TimeGridHeader)

var _DetailView = require('./DetailView')

var _DetailView2 = _interopRequireDefault(_DetailView)

var _Position = require('./Position')

var _Position2 = _interopRequireDefault(_Position)

var _Overlay = require('react-overlays/lib/Overlay')

var _Overlay2 = _interopRequireDefault(_Overlay)

var _helpers = require('./utils/helpers')

var _eventLevels = require('./utils/eventLevels')

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

var TimeGrid = (function(_Component) {
  _inherits(TimeGrid, _Component)

  function TimeGrid(props) {
    _classCallCheck(this, TimeGrid)

    var _this = _possibleConstructorReturn(this, _Component.call(this, props))

    _this.handleResize = function() {
      _requestAnimationFrame2.default.cancel(_this.rafHandle)
      _this.rafHandle = (0, _requestAnimationFrame2.default)(
        _this.checkOverflow
      )

      if (_this.state.detail) {
        _this.setState(function(prevState) {
          return {
            detail: _extends({}, prevState.detail, {
              position: (0, _position2.default)(
                _this.previousCell,
                (0, _reactDom.findDOMNode)(_this.previousContainer)
              ),
            }),
          }
        })
      }
    }

    _this.gutterRef = function(ref) {
      _this.gutter = ref && (0, _reactDom.findDOMNode)(ref)
    }

    _this.handleSelectAlldayEvent = function() {
      for (
        var _len = arguments.length, args = Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key]
      }

      //cancel any pending selections so only the event click goes through.
      _this.clearSelection()
      ;(0, _helpers.notify)(_this.props.onSelectEvent, args)
    }

    _this.handleSelectAllDaySlot = function(slots, slotInfo) {
      var onSelectSlot = _this.props.onSelectSlot

      ;(0, _helpers.notify)(onSelectSlot, {
        slots: slots,
        start: slots[0],
        end: slots[slots.length - 1],
        action: slotInfo.action,
      })
    }

    _this.clearSelection = function() {
      clearTimeout(_this._selectTimer)
      _this._pendingSelection = []
    }

    _this.checkOverflow = function() {
      if (_this._updatingOverflow) return

      var isOverflowing =
        _this.refs.content.scrollHeight > _this.refs.content.clientHeight

      if (_this.state.isOverflowing !== isOverflowing) {
        _this._updatingOverflow = true
        _this.setState(
          { isOverflowing: isOverflowing },
          function() {
            _this._updatingOverflow = false
          },
          function() {
            if (_this.props.onResize) {
              _this.props.onResize()
            }
          }
        )
      }
    }

    _this.handleDetailEvent = function(container) {
      return function(event, cell) {
        var _this$props = _this.props,
          components = _this$props.components,
          onClick = _this$props.onClick

        if (components.detailView) {
          _this.previousContainer = container
          _this.previousCell = cell
          _this.clearSelection()
          _this.setState(function() {
            return {
              detail: {
                event: event,
                position: (0, _position2.default)(
                  cell,
                  (0, _reactDom.findDOMNode)(container)
                ),
              },
            }
          })
        }
        ;(0, _helpers.notify)(onClick, [event])
      }
    }

    _this.hide = function(what) {
      return function() {
        return _this.setState(function() {
          var _ref

          return (_ref = {}), (_ref[what] = null), _ref
        })
      }
    }

    _this.renderDetailView = function(container) {
      var _ref2 = (_this.state && _this.state.detail) || {},
        event = _ref2.event,
        position = _ref2.position

      var View = _this.props.components.detailView
      var isAllday = event && _this.props.accessors.allDay(event)
      var _this$props2 = _this.props,
        accessors = _this$props2.accessors,
        localizer = _this$props2.localizer,
        getters = _this$props2.getters,
        detailOffset = _this$props2.detailOffset,
        getNow = _this$props2.getNow

      return _react2.default.createElement(
        _Overlay2.default,
        {
          container: container,
          show: !!position,
          rootClose: true,
          placement: 'bottom',
          onHide: _this.hide('detail'),
        },
        _react2.default.createElement(
          _Position2.default,
          {
            disable: isAllday ? 'top' : false,
            container: container,
            position: position,
            offset: detailOffset,
          },
          _react2.default.createElement(_DetailView2.default, {
            accessors: accessors,
            getters: getters,
            View: View,
            localizer: localizer,
            hide: _this.hide('detail'),
            event: event,
            getNow: getNow,
          })
        )
      )
    }

    _this.state = {
      gutterWidth: undefined,
      isOverflowing: null,
      currentTime: '',
    }

    _this.renderDetailView = _this.renderDetailView.bind(_this)
    _this.handleResizeDebounced = (0, _debounce2.default)(
      _this.handleResize,
      100
    )
    return _this
  }

  TimeGrid.prototype.componentWillMount = function componentWillMount() {
    this.calculateScroll()
  }

  TimeGrid.prototype.componentDidMount = function componentDidMount() {
    this.checkOverflow()

    if (this.props.width == null) {
      this.measureGutter()
    }

    this.applyScroll()

    this.updateCurrentTime()
    this.positionTimeIndicator()
    this.triggerTimeIndicatorUpdate()

    window.addEventListener('resize', this.handleResizeDebounced)
  }

  TimeGrid.prototype.componentWillUnmount = function componentWillUnmount() {
    window.clearTimeout(this._timeIndicatorTimeout)
    window.removeEventListener('resize', this.handleResizeDebounced)

    _requestAnimationFrame2.default.cancel(this.rafHandle)
  }

  TimeGrid.prototype.componentDidUpdate = function componentDidUpdate() {
    if (this.props.width == null) {
      this.measureGutter()
    }

    this.applyScroll()
    this.positionTimeIndicator()
    //this.checkOverflow()
  }

  TimeGrid.prototype.componentWillReceiveProps = function componentWillReceiveProps(
    nextProps
  ) {
    var _props = this.props,
      range = _props.range,
      scrollToTime = _props.scrollToTime
    // When paginating, reset scroll

    if (
      !_dates2.default.eq(nextProps.range[0], range[0], 'minute') ||
      !_dates2.default.eq(nextProps.scrollToTime, scrollToTime, 'minute')
    ) {
      this.calculateScroll(nextProps)
    }
  }

  TimeGrid.prototype.renderEvents = function renderEvents(
    range,
    events,
    today,
    resources
  ) {
    var _this2 = this

    var _props2 = this.props,
      min = _props2.min,
      max = _props2.max,
      components = _props2.components,
      accessors = _props2.accessors,
      localizer = _props2.localizer,
      smallEventBoundary = _props2.smallEventBoundary,
      isExpandable = _props2.isExpandable

    return range.map(function(date, idx) {
      var daysEvents = events.filter(function(event) {
        return _dates2.default.inRange(
          date,
          accessors.start(event),
          accessors.end(event),
          'day'
        )
      })

      return resources.map(function(resource, id) {
        var resourceId = accessors.resourceId(resource)
        var eventsToDisplay = !resource
          ? daysEvents
          : daysEvents.filter(function(event) {
              return accessors.resource(event) === resourceId
            })

        return _react2.default.createElement(
          _DayColumn2.default,
          _extends({}, _this2.props, {
            localizer: localizer,
            min: _dates2.default.merge(date, min),
            max: _dates2.default.merge(date, max),
            resource: resourceId,
            smallEventBoundary: smallEventBoundary,
            parentSelector: '.rbc-time-content',
            components: components,
            onClick: _this2.handleDetailEvent(_this2.refs.content),
            isExpandable: isExpandable,
            className: (0, _classnames2.default)({
              'rbc-now': _dates2.default.eq(date, today, 'day'),
            }),
            key: idx + '-' + id,
            date: date,
            events: eventsToDisplay,
          })
        )
      })
    })
  }

  TimeGrid.prototype.render = function render() {
    var _props3 = this.props,
      events = _props3.events,
      range = _props3.range,
      width = _props3.width,
      selected = _props3.selected,
      getNow = _props3.getNow,
      resources = _props3.resources,
      components = _props3.components,
      accessors = _props3.accessors,
      getters = _props3.getters,
      localizer = _props3.localizer,
      popupOffset = _props3.popupOffset,
      min = _props3.min,
      max = _props3.max,
      maxAllDayEvents = _props3.maxAllDayEvents,
      showMultiDayTimes = _props3.showMultiDayTimes,
      longPressThreshold = _props3.longPressThreshold

    var _ref3 = this.state.detail || {},
      event = _ref3.event

    var isAllday = event && accessors.allDay(event)

    width = width || this.state.gutterWidth

    var start = range[0],
      end = range[range.length - 1]

    this.slots = range.length

    var allDayEvents = [],
      rangeEvents = []

    events.forEach(function(event) {
      if ((0, _eventLevels.inRange)(event, start, end, accessors)) {
        var eStart = accessors.start(event),
          eEnd = accessors.end(event)
        var daysHours = 24

        if (
          accessors.allDay(event) ||
          (_dates2.default.isJustDate(eStart) &&
            _dates2.default.isJustDate(eEnd)) ||
          (!showMultiDayTimes &&
            _dates2.default.diff(eStart, eEnd, 'hours') >= daysHours)
        ) {
          allDayEvents.push(event)
        } else {
          rangeEvents.push(event)
        }
      }
    })

    allDayEvents.sort(function(a, b) {
      return (0, _eventLevels.sortEvents)(a, b, accessors)
    })

    return _react2.default.createElement(
      'div',
      {
        className: (0, _classnames2.default)('rbc-time-view', {
          'rbc-week-view': range.length > 1 && range.length <= 7,
        }),
      },
      _react2.default.createElement(_TimeGridHeader2.default, {
        range: range,
        events: allDayEvents,
        width: width,
        getNow: getNow,
        localizer: localizer,
        resources: resources,
        selected: selected,
        selectable: this.props.selectable,
        accessors: accessors,
        getters: getters,
        components: components,
        maxAllDayEvents: maxAllDayEvents,
        isOverflowing: this.state.isOverflowing,
        longPressThreshold: longPressThreshold,
        popupOffset: popupOffset,
        onSelectSlot: this.handleSelectAllDaySlot,
        onSelectEvent: this.handleSelectAlldayEvent,
        clearSelection: this.clearSelection,
        onDoubleClickEvent: this.props.onDoubleClickEvent,
        onDrillDown: this.props.onDrillDown,
        detailOffset: this.props.detailOffset,
        renderDetailView: isAllday && this.renderDetailView,
        handleDetailEvent: this.handleDetailEvent,
        getDrilldownView: this.props.getDrilldownView,
      }),
      _react2.default.createElement(
        'div',
        { ref: 'content', className: 'rbc-time-content' },
        _react2.default.createElement(_TimeGutter2.default, {
          date: start,
          ref: this.gutterRef,
          localizer: localizer,
          min: _dates2.default.merge(start, min),
          max: _dates2.default.merge(start, max),
          step: this.props.step,
          getNow: this.props.getNow,
          timeslots: this.props.timeslots,
          components: components,
          className: 'rbc-time-gutter',
        }),
        this.renderEvents(range, rangeEvents, getNow(), resources || [null]),
        components.detailView &&
          !isAllday &&
          this.renderDetailView(this.refs.content),
        _react2.default.createElement('div', {
          ref: 'timeIndicator',
          className: 'rbc-current-time-indicator',
          'data-time': this.state.currentTime,
        })
      )
    )
  }

  TimeGrid.prototype.measureGutter = function measureGutter() {
    var width = (0, _width2.default)(this.gutter)

    if (width && this.state.gutterWidth !== width) {
      this.setState({ gutterWidth: width })
    }
  }

  TimeGrid.prototype.applyScroll = function applyScroll() {
    if (this._scrollRatio) {
      var content = this.refs.content

      content.scrollTop = content.scrollHeight * this._scrollRatio
      // Only do this once
      this._scrollRatio = null
    }
  }

  TimeGrid.prototype.calculateScroll = function calculateScroll() {
    var props =
      arguments.length > 0 && arguments[0] !== undefined
        ? arguments[0]
        : this.props
    var min = props.min,
      max = props.max,
      scrollToTime = props.scrollToTime

    var diffMillis = scrollToTime - _dates2.default.startOf(scrollToTime, 'day')
    var totalMillis = _dates2.default.diff(max, min)

    this._scrollRatio = diffMillis / totalMillis
  }

  TimeGrid.prototype.positionTimeIndicator = function positionTimeIndicator() {
    var _props4 = this.props,
      rtl = _props4.rtl,
      min = _props4.min,
      max = _props4.max,
      getNow = _props4.getNow,
      range = _props4.range

    var current = getNow()
    var startDay = new Date(current.getTime()).setHours(0, 0, 0, 0)

    var secondsGrid = _dates2.default.diff(max, min, 'seconds')
    var secondsPassed = _dates2.default.diff(current, startDay, 'seconds')

    var timeIndicator = this.refs.timeIndicator
    var factor = secondsPassed / secondsGrid
    var timeGutter = this.gutter

    var content = this.refs.content

    if (timeGutter) {
      var pixelHeight = timeGutter.offsetHeight
      var dayPixelWidth =
        (content.offsetWidth - timeGutter.offsetWidth) / this.slots
      var dayOffset =
        range.findIndex(function(d) {
          return _dates2.default.eq(d, _dates2.default.today(), 'day')
        }) * dayPixelWidth
      var offset = Math.floor(factor * pixelHeight)

      timeIndicator.style.display = dayOffset >= 0 ? 'block' : 'none'
      timeIndicator.style[rtl ? 'left' : 'right'] = 0
      timeIndicator.style[rtl ? 'right' : 'left'] =
        timeGutter.offsetWidth + dayOffset + 'px'
      timeIndicator.style.top = offset + 'px'
      timeIndicator.style.width = dayPixelWidth + 'px'
    } else {
      timeIndicator.style.display = 'none'
    }
  }

  TimeGrid.prototype.updateCurrentTime = function updateCurrentTime() {
    var _props5 = this.props,
      localizer = _props5.localizer,
      getNow = _props5.getNow

    this.setState({
      currentTime: localizer.format(getNow(), 'currentTimeIndicatorFormat'),
    })
  }

  TimeGrid.prototype.triggerTimeIndicatorUpdate = function triggerTimeIndicatorUpdate() {
    var _this3 = this

    // Update the position of the time indicator every minute
    this._timeIndicatorTimeout = window.setTimeout(function() {
      _this3.updateCurrentTime()

      _this3.positionTimeIndicator()

      _this3.triggerTimeIndicatorUpdate()
    }, 60000)
  }

  return TimeGrid
})(_react.Component)

TimeGrid.propTypes = {
  events: _propTypes2.default.array.isRequired,
  resources: _propTypes2.default.array,

  step: _propTypes2.default.number,
  timeslots: _propTypes2.default.number,
  range: _propTypes2.default.arrayOf(_propTypes2.default.instanceOf(Date)),
  min: _propTypes2.default.instanceOf(Date),
  max: _propTypes2.default.instanceOf(Date),
  getNow: _propTypes2.default.func.isRequired,
  maxAllDayEvents: _propTypes2.default.number,
  popupOffset: _propTypes3.popupOffsetShape,
  detailOffset: _propTypes3.popupOffsetShape,
  isExpandable: _propTypes2.default.oneOfType([
    _propTypes2.default.bool,
    _propTypes2.default.shape({
      x: _propTypes2.default.number,
      y: _propTypes2.default.number,
    }),
  ]),
  smallEventBoundary: _propTypes2.default.oneOfType([
    _propTypes2.default.bool,
    _propTypes2.default.number,
  ]),

  scrollToTime: _propTypes2.default.instanceOf(Date),
  showMultiDayTimes: _propTypes2.default.bool,

  rtl: _propTypes2.default.bool,
  width: _propTypes2.default.number,

  accessors: _propTypes2.default.object.isRequired,
  components: _propTypes2.default.object.isRequired,
  getters: _propTypes2.default.object.isRequired,
  localizer: _propTypes2.default.object.isRequired,

  selected: _propTypes2.default.object,
  selectable: _propTypes2.default.oneOf([true, false, 'ignoreEvents']),
  longPressThreshold: _propTypes2.default.number,

  onClick: _propTypes2.default.func,
  onNavigate: _propTypes2.default.func,
  onSelectSlot: _propTypes2.default.func,
  onSelectEnd: _propTypes2.default.func,
  onSelectStart: _propTypes2.default.func,
  onSelectEvent: _propTypes2.default.func,
  onResize: _propTypes2.default.func,
  onDoubleClickEvent: _propTypes2.default.func,
  onDrillDown: _propTypes2.default.func,
  getDrilldownView: _propTypes2.default.func.isRequired,
}
TimeGrid.defaultProps = {
  step: 30,
  timeslots: 2,
  min: _dates2.default.startOf(new Date(), 'day'),
  max: _dates2.default.endOf(new Date(), 'day'),
  scrollToTime: _dates2.default.startOf(new Date(), 'day'),
}
exports.default = TimeGrid
module.exports = exports['default']
