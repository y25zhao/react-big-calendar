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

var _reactDom = require('react-dom')

var _classnames = require('classnames')

var _classnames2 = _interopRequireDefault(_classnames)

var _dates = require('./utils/dates')

var _dates2 = _interopRequireDefault(_dates)

var _chunk = require('lodash/chunk')

var _chunk2 = _interopRequireDefault(_chunk)

var _constants = require('./utils/constants')

var _helpers = require('./utils/helpers')

var _position = require('dom-helpers/query/position')

var _position2 = _interopRequireDefault(_position)

var _propTypes3 = require('./utils/propTypes')

var _requestAnimationFrame = require('dom-helpers/util/requestAnimationFrame')

var _requestAnimationFrame2 = _interopRequireDefault(_requestAnimationFrame)

var _Popup = require('./Popup')

var _Popup2 = _interopRequireDefault(_Popup)

var _DetailView = require('./DetailView')

var _DetailView2 = _interopRequireDefault(_DetailView)

var _Overlay = require('react-overlays/lib/Overlay')

var _Overlay2 = _interopRequireDefault(_Overlay)

var _Position = require('./Position')

var _Position2 = _interopRequireDefault(_Position)

var _DateContentRow = require('./DateContentRow')

var _DateContentRow2 = _interopRequireDefault(_DateContentRow)

var _Header = require('./Header')

var _Header2 = _interopRequireDefault(_Header)

var _DateHeader = require('./DateHeader')

var _DateHeader2 = _interopRequireDefault(_DateHeader)

var _eventLevels = require('./utils/eventLevels')

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

var eventsForWeek = function eventsForWeek(evts, start, end, accessors) {
  return evts.filter(function(e) {
    return (0, _eventLevels.inRange)(e, start, end, accessors)
  })
}

var propTypes = {
  events: _propTypes2.default.array.isRequired,
  date: _propTypes2.default.instanceOf(Date),

  min: _propTypes2.default.instanceOf(Date),
  max: _propTypes2.default.instanceOf(Date),

  step: _propTypes2.default.number,
  getNow: _propTypes2.default.func.isRequired,

  scrollToTime: _propTypes2.default.instanceOf(Date),
  rtl: _propTypes2.default.bool,
  width: _propTypes2.default.number,

  accessors: _propTypes2.default.object.isRequired,
  components: _propTypes2.default.object.isRequired,
  getters: _propTypes2.default.object.isRequired,
  localizer: _propTypes2.default.object.isRequired,

  selected: _propTypes2.default.object,
  selectable: _propTypes2.default.oneOf([true, false, 'ignoreEvents']),
  longPressThreshold: _propTypes2.default.number,

  onNavigate: _propTypes2.default.func,
  onClick: _propTypes2.default.func,
  onSelectSlot: _propTypes2.default.func,
  onSelectEvent: _propTypes2.default.func,
  onDoubleClickEvent: _propTypes2.default.func,
  onShowMore: _propTypes2.default.func,
  onDrillDown: _propTypes2.default.func,
  onResize: _propTypes2.default.func,
  getDrilldownView: _propTypes2.default.func.isRequired,

  popup: _propTypes2.default.bool,

  overlayOffset: _propTypes3.popupOffsetShape,
  detailOffset: _propTypes3.popupOffsetShape,
}

var MonthView = (function(_React$Component) {
  _inherits(MonthView, _React$Component)

  function MonthView() {
    _classCallCheck(this, MonthView)

    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key]
    }

    var _this = _possibleConstructorReturn(
      this,
      _React$Component.call.apply(_React$Component, [this].concat(args))
    )

    _initialiseProps.call(_this)

    _this._bgRows = []
    _this._pendingSelection = []
    _this.state = {
      rowLimit: 5,
      needLimitMeasure: true,
    }
    return _this
  }

  MonthView.prototype.componentWillReceiveProps = function componentWillReceiveProps(
    _ref
  ) {
    var date = _ref.date

    this.setState({
      needLimitMeasure: !_dates2.default.eq(date, this.props.date),
    })
  }

  MonthView.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this

    var running = void 0

    if (this.state.needLimitMeasure) this.measureRowLimit(this.props)

    window.addEventListener(
      'resize',
      (this._resizeListener = function() {
        if (!running) {
          ;(0, _requestAnimationFrame2.default)(function() {
            running = false
            _this2.setState({ needLimitMeasure: true }, function() {
              if (_this2.props.onResize) {
                _this2.props.onResize()
              }
            })
          })
        }

        _this2.updateStateOnResize('overlay', _this2.previousShowMoreCell)
        _this2.updateStateOnResize('detail', _this2.previousDetailCell)
      }),
      false
    )
  }

  MonthView.prototype.updateStateOnResize = function updateStateOnResize(
    stateKey,
    element
  ) {
    if (this.state[stateKey]) {
      var newElement = this.getNewElement(stateKey, element)
      var position = (0, _position2.default)(
        newElement,
        (0, _reactDom.findDOMNode)(this)
      )

      this.setState(function(prevState) {
        var _ref2

        return (
          (_ref2 = {}),
          (_ref2[stateKey] = _extends({}, prevState[stateKey], {
            position: position,
          })),
          _ref2
        )
      })
    }
  }

  MonthView.prototype.componentDidUpdate = function componentDidUpdate() {
    if (this.state.needLimitMeasure) this.measureRowLimit(this.props)
  }

  MonthView.prototype.componentWillUnmount = function componentWillUnmount() {
    window.removeEventListener('resize', this._resizeListener, false)
  }

  MonthView.prototype.render = function render() {
    var _props = this.props,
      date = _props.date,
      localizer = _props.localizer,
      className = _props.className,
      month = _dates2.default.visibleDays(date, localizer),
      weeks = (0, _chunk2.default)(month, 7)

    this._weekCount = weeks.length

    return _react2.default.createElement(
      'div',
      {
        ref: 'content',
        className: (0, _classnames2.default)('rbc-month-view', className),
      },
      _react2.default.createElement(
        'div',
        { className: 'rbc-row rbc-month-header' },
        this.renderHeaders(weeks[0])
      ),
      weeks.map(this.renderWeek),
      this.props.popup && this.renderOverlay(),
      this.props.components.detailView && this.renderDetailView()
    )
  }

  MonthView.prototype.renderHeaders = function renderHeaders(row) {
    var _props2 = this.props,
      localizer = _props2.localizer,
      components = _props2.components

    var first = row[0]
    var last = row[row.length - 1]
    var HeaderComponent = components.header || _Header2.default

    return _dates2.default.range(first, last, 'day').map(function(day, idx) {
      return _react2.default.createElement(
        'div',
        { key: 'header_' + idx, className: 'rbc-header' },
        _react2.default.createElement(HeaderComponent, {
          date: day,
          localizer: localizer,
          label: localizer.format(day, 'weekdayFormat'),
        })
      )
    })
  }

  MonthView.prototype.renderOverlay = function renderOverlay() {
    var _ref3 = (this.state && this.state.overlay) || {},
      position = _ref3.position,
      events = _ref3.events,
      date = _ref3.date,
      end = _ref3.end

    var _props3 = this.props,
      accessors = _props3.accessors,
      localizer = _props3.localizer,
      components = _props3.components,
      overlayOffset = _props3.overlayOffset,
      getters = _props3.getters,
      selected = _props3.selected,
      getNow = _props3.getNow

    return _react2.default.createElement(
      _Overlay2.default,
      {
        container: this,
        show: !!position,
        rootClose: true,
        placement: 'bottom',
        onHide: this.hide('overlay'),
      },
      _react2.default.createElement(
        _Position2.default,
        {
          container: this.refs.content,
          offset: overlayOffset,
          position: position,
        },
        _react2.default.createElement(_Popup2.default, {
          accessors: accessors,
          getters: getters,
          selected: selected,
          components: components,
          localizer: localizer,
          events: events,
          slotStart: date,
          slotEnd: end,
          getNow: getNow,
          onSelect: this.handleSelectEvent,
          onClick: this.handleDetailEvent,
          onDoubleClick: this.handleDoubleClickEvent,
          rtl: this.props.rtl,
        })
      )
    )
  }

  MonthView.prototype.renderDetailView = function renderDetailView() {
    var _ref4 = (this.state && this.state.detail) || {},
      event = _ref4.event,
      position = _ref4.position

    var View = this.props.components.detailView
    var _props4 = this.props,
      accessors = _props4.accessors,
      localizer = _props4.localizer,
      getters = _props4.getters,
      detailOffset = _props4.detailOffset,
      getNow = _props4.getNow

    return _react2.default.createElement(
      _Overlay2.default,
      {
        container: this,
        show: !!position,
        rootClose: true,
        placement: 'bottom',
        onHide: this.hide('detail'),
      },
      _react2.default.createElement(
        _Position2.default,
        {
          container: this.refs.content,
          offset: detailOffset,
          position: position,
        },
        _react2.default.createElement(_DetailView2.default, {
          accessors: accessors,
          getters: getters,
          View: View,
          localizer: localizer,
          event: event,
          hide: this.hide('detail'),
          getNow: getNow,
        })
      )
    )
  }

  MonthView.prototype.measureRowLimit = function measureRowLimit() {
    this.setState({
      needLimitMeasure: false,
      rowLimit: this.refs.slotRow.getRowLimit(),
    })
  }

  MonthView.prototype.selectDates = function selectDates(slotInfo) {
    var slots = this._pendingSelection.slice()

    this._pendingSelection = []

    slots.sort(function(a, b) {
      return +a - +b
    })

    ;(0, _helpers.notify)(this.props.onSelectSlot, {
      slots: slots,
      start: slots[0],
      end: slots[slots.length - 1],
      action: slotInfo.action,
    })
  }

  MonthView.prototype.clearSelection = function clearSelection() {
    clearTimeout(this._selectTimer)
    this._pendingSelection = []
  }

  return MonthView
})(_react2.default.Component)

MonthView.displayName = 'MonthView'
MonthView.propTypes = propTypes

var _initialiseProps = function _initialiseProps() {
  var _this3 = this

  this.hide = function(what) {
    return function() {
      return _this3.setState(function() {
        var _ref7

        return (_ref7 = {}), (_ref7[what] = null), _ref7
      })
    }
  }

  this.getNewElement = function(stateKey, element) {
    var id = element.dataset.id

    if (stateKey === 'detail' && _this3.state.overlay) {
      return document.querySelector('.rbc-popup [data-id="' + id + '"]')
    } else {
      return document.querySelector('[data-id="' + id + '"]')
    }
  }

  this.getContainer = function() {
    return (0, _reactDom.findDOMNode)(_this3)
  }

  this.renderWeek = function(week, weekIdx) {
    var _props5 = _this3.props,
      events = _props5.events,
      components = _props5.components,
      selectable = _props5.selectable,
      getNow = _props5.getNow,
      selected = _props5.selected,
      date = _props5.date,
      localizer = _props5.localizer,
      longPressThreshold = _props5.longPressThreshold,
      accessors = _props5.accessors,
      getters = _props5.getters
    var _state = _this3.state,
      needLimitMeasure = _state.needLimitMeasure,
      rowLimit = _state.rowLimit

    events = eventsForWeek(events, week[0], week[week.length - 1], accessors)

    events.sort(function(a, b) {
      return (0, _eventLevels.sortEvents)(a, b, accessors)
    })

    return _react2.default.createElement(_DateContentRow2.default, {
      key: weekIdx,
      ref: weekIdx === 0 ? 'slotRow' : undefined,
      container: _this3.getContainer,
      className: 'rbc-month-row',
      getNow: getNow,
      date: date,
      range: week,
      events: events,
      maxRows: rowLimit,
      selected: selected,
      selectable: selectable,
      components: components,
      accessors: accessors,
      getters: getters,
      localizer: localizer,
      renderHeader: _this3.readerDateHeading,
      renderForMeasure: needLimitMeasure,
      onShowMore: _this3.handleShowMore,
      onSelect: _this3.handleSelectEvent,
      onClick: _this3.handleDetailEvent,
      onDoubleClick: _this3.handleDoubleClickEvent,
      onSelectSlot: _this3.handleSelectSlot,
      longPressThreshold: longPressThreshold,
      rtl: _this3.props.rtl,
    })
  }

  this.readerDateHeading = function(_ref8) {
    var date = _ref8.date,
      className = _ref8.className,
      props = _objectWithoutProperties(_ref8, ['date', 'className'])

    var _props6 = _this3.props,
      currentDate = _props6.date,
      getDrilldownView = _props6.getDrilldownView,
      localizer = _props6.localizer

    var isOffRange =
      _dates2.default.month(date) !== _dates2.default.month(currentDate)
    var isCurrent = _dates2.default.eq(date, currentDate, 'day')
    var drilldownView = getDrilldownView(date)
    var label = localizer.format(date, 'dateFormat')
    var DateHeaderComponent =
      _this3.props.components.dateHeader || _DateHeader2.default

    return _react2.default.createElement(
      'div',
      _extends({}, props, {
        className: (0, _classnames2.default)(
          className,
          isOffRange && 'rbc-off-range',
          isCurrent && 'rbc-current'
        ),
      }),
      _react2.default.createElement(DateHeaderComponent, {
        label: label,
        date: date,
        drilldownView: drilldownView,
        isOffRange: isOffRange,
        onDrillDown: function onDrillDown(e) {
          return _this3.handleHeadingClick(date, drilldownView, e)
        },
      })
    )
  }

  this.handleSelectSlot = function(range, slotInfo) {
    _this3._pendingSelection = _this3._pendingSelection.concat(range)

    clearTimeout(_this3._selectTimer)
    _this3._selectTimer = setTimeout(function() {
      return _this3.selectDates(slotInfo)
    })
  }

  this.handleHeadingClick = function(date, view, e) {
    e.preventDefault()
    _this3.clearSelection()
    ;(0, _helpers.notify)(_this3.props.onDrillDown, [date, view])
  }

  this.handleSelectEvent = function() {
    for (
      var _len2 = arguments.length, args = Array(_len2), _key2 = 0;
      _key2 < _len2;
      _key2++
    ) {
      args[_key2] = arguments[_key2]
    }

    _this3.clearSelection()
    ;(0, _helpers.notify)(_this3.props.onSelectEvent, args)
  }

  this.handleDoubleClickEvent = function() {
    for (
      var _len3 = arguments.length, args = Array(_len3), _key3 = 0;
      _key3 < _len3;
      _key3++
    ) {
      args[_key3] = arguments[_key3]
    }

    _this3.clearSelection()
    ;(0, _helpers.notify)(_this3.props.onDoubleClickEvent, args)
  }

  this.handleShowMore = function(events, date, cell, slot) {
    var _props7 = _this3.props,
      popup = _props7.popup,
      onDrillDown = _props7.onDrillDown,
      onShowMore = _props7.onShowMore,
      getDrilldownView = _props7.getDrilldownView
    //cancel any pending selections so only the event click goes through.

    _this3.clearSelection()

    if (popup) {
      var position = (0, _position2.default)(
        cell,
        (0, _reactDom.findDOMNode)(_this3)
      )
      var end = _dates2.default.add(date, 1, 'day')
      _this3.previousShowMoreCell = cell

      _this3.setState(function() {
        return {
          overlay: { date: date, end: end, events: events, position: position },
        }
      })
    } else {
      ;(0, _helpers.notify)(onDrillDown, [
        date,
        getDrilldownView(date) || _constants.views.DAY,
      ])
    }

    ;(0, _helpers.notify)(onShowMore, [events, date, slot])
  }

  this.handleDetailEvent = function(event, cell) {
    var _props8 = _this3.props,
      components = _props8.components,
      onClick = _props8.onClick

    if (components.detailView && cell) {
      _this3.previousDetailCell = cell
      _this3.clearSelection()
      _this3.setState(function() {
        return {
          detail: {
            event: event,
            position: (0, _position2.default)(
              cell,
              (0, _reactDom.findDOMNode)(_this3)
            ),
          },
        }
      })
    }
    ;(0, _helpers.notify)(onClick, [event])
  }
}

MonthView.range = function(date, _ref5) {
  var culture = _ref5.culture

  var start = _dates2.default.firstVisibleDay(date, culture)
  var end = _dates2.default.lastVisibleDay(date, culture)
  return { start: start, end: end }
}

MonthView.navigate = function(date, action) {
  switch (action) {
    case _constants.navigate.PREVIOUS:
      return _dates2.default.add(date, -1, 'month')

    case _constants.navigate.NEXT:
      return _dates2.default.add(date, 1, 'month')

    default:
      return date
  }
}

MonthView.title = function(date, _ref6) {
  var localizer = _ref6.localizer
  return localizer.format(date, 'monthHeaderFormat')
}

exports.default = MonthView
module.exports = exports['default']
