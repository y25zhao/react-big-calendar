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

var _reactDom = require('react-dom')

var _scrollbarSize = require('dom-helpers/util/scrollbarSize')

var _scrollbarSize2 = _interopRequireDefault(_scrollbarSize)

var _position = require('dom-helpers/query/position')

var _position2 = _interopRequireDefault(_position)

var _react = require('react')

var _react2 = _interopRequireDefault(_react)

var _Overlay = require('react-overlays/lib/Overlay')

var _Overlay2 = _interopRequireDefault(_Overlay)

var _debounce = require('lodash/debounce')

var _debounce2 = _interopRequireDefault(_debounce)

var _propTypes3 = require('./utils/propTypes')

var _dates = require('./utils/dates')

var _dates2 = _interopRequireDefault(_dates)

var _DateContentRow = require('./DateContentRow')

var _DateContentRow2 = _interopRequireDefault(_DateContentRow)

var _Popup = require('./Popup')

var _Popup2 = _interopRequireDefault(_Popup)

var _Position = require('./Position')

var _Position2 = _interopRequireDefault(_Position)

var _Header = require('./Header')

var _Header2 = _interopRequireDefault(_Header)

var _helpers = require('./utils/helpers')

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
} // eslint-disable-line

var TimeGridHeader = (function(_React$Component) {
  _inherits(TimeGridHeader, _React$Component)

  function TimeGridHeader(props) {
    _classCallCheck(this, TimeGridHeader)

    var _this = _possibleConstructorReturn(
      this,
      _React$Component.call(this, props)
    )

    _this.state = {
      overlay: null,
    }

    _this.handleResize = function() {
      if (_this.state.overlay) {
        _this.setState(function(prevState) {
          return {
            overlay: _extends({}, prevState.overlay, {
              position: (0, _position2.default)(
                _this.previousCell,
                (0, _reactDom.findDOMNode)(_this)
              ),
            }),
          }
        })
      }
    }

    _this.handleHeaderClick = function(date, view, e) {
      e.preventDefault()
      ;(0, _helpers.notify)(_this.props.onDrillDown, [date, view])
    }

    _this.renderRow = function(resource) {
      var _this$props = _this.props,
        events = _this$props.events,
        rtl = _this$props.rtl,
        selectable = _this$props.selectable,
        getNow = _this$props.getNow,
        range = _this$props.range,
        getters = _this$props.getters,
        localizer = _this$props.localizer,
        accessors = _this$props.accessors,
        components = _this$props.components,
        maxAllDayEvents = _this$props.maxAllDayEvents

      var resourceId = accessors.resourceId(resource)
      var eventsToDisplay = resource
        ? events.filter(function(event) {
            return accessors.resource(event) === resourceId
          })
        : events

      var allDayEventComponents = _extends({}, components, {
        event: components.allDayEvent,
      })

      return _react2.default.createElement(_DateContentRow2.default, {
        isAllDay: true,
        rtl: rtl,
        getNow: getNow,
        minRows: 0,
        range: range,
        events: eventsToDisplay,
        resourceId: resourceId,
        maxRows: maxAllDayEvents,
        className: 'rbc-allday-cell',
        selectable: selectable,
        selected: _this.props.selected,
        components: allDayEventComponents,
        accessors: accessors,
        getters: getters,
        localizer: localizer,
        onClick: _this.props.handleDetailEvent(_this.refs.headerCell),
        onSelect: _this.props.onSelectEvent,
        onShowMore: _this.handleShowMore,
        onDoubleClick: _this.props.onDoubleClickEvent,
        onSelectSlot: _this.props.onSelectSlot,
        longPressThreshold: _this.props.longPressThreshold,
      })
    }

    _this.handleShowMore = function(events, date, cell, slot) {
      var _this$props2 = _this.props,
        onShowMore = _this$props2.onShowMore,
        clearSelection = _this$props2.clearSelection
      //cancel any pending selections so only the event click goes through.

      clearSelection()
      _this.previousCell = cell
      var position = (0, _position2.default)(
        cell,
        (0, _reactDom.findDOMNode)(_this)
      )

      _this.setState({
        overlay: { date: date, events: events, position: position },
      })

      ;(0, _helpers.notify)(onShowMore, [events, date, slot])
    }

    _this.handleResizeBounced = (0, _debounce2.default)(_this.handleResize, 100)
    return _this
  }

  TimeGridHeader.prototype.componentDidMount = function componentDidMount() {
    window.addEventListener('resize', this.handleResizeBounced)
  }

  TimeGridHeader.prototype.componentWillUnmount = function componentWillUnmount() {
    window.removeEventListener('resize', this.handleResizeBounced)
  }

  TimeGridHeader.prototype.renderHeaderResources = function renderHeaderResources(
    range,
    resources
  ) {
    var _props = this.props,
      accessors = _props.accessors,
      getNow = _props.getNow

    var today = getNow()

    return range.map(function(date, i) {
      return resources.map(function(resource, j) {
        return _react2.default.createElement(
          'div',
          {
            key: i + '-' + j,
            className: (0, _classnames2.default)(
              'rbc-header',
              _dates2.default.eq(date, today, 'day') && 'rbc-today'
            ),
          },
          accessors.resourceTitle(resource)
        )
      })
    })
  }

  TimeGridHeader.prototype.renderHeaderCells = function renderHeaderCells(
    range
  ) {
    var _this2 = this

    var _props2 = this.props,
      localizer = _props2.localizer,
      getDrilldownView = _props2.getDrilldownView,
      getNow = _props2.getNow,
      dayProp = _props2.getters.dayProp,
      _props2$components$he = _props2.components.header,
      HeaderComponent =
        _props2$components$he === undefined
          ? _Header2.default
          : _props2$components$he

    var today = getNow()

    return range.map(function(date, i) {
      var drilldownView = getDrilldownView(date)
      var label = localizer.format(date, 'dayFormat')

      var _dayProp = dayProp(date),
        className = _dayProp.className,
        style = _dayProp.style

      var header = _react2.default.createElement(HeaderComponent, {
        date: date,
        label: label,
        localizer: localizer,
      })

      return _react2.default.createElement(
        'div',
        {
          key: i,
          style: style,
          className: (0, _classnames2.default)(
            'rbc-header',
            className,
            _dates2.default.eq(date, today, 'day') && 'rbc-today'
          ),
        },
        drilldownView
          ? _react2.default.createElement(
              'a',
              {
                href: '#',
                onClick: function onClick(e) {
                  return _this2.handleHeaderClick(date, drilldownView, e)
                },
              },
              header
            )
          : _react2.default.createElement('span', null, header)
      )
    })
  }

  TimeGridHeader.prototype.renderOverlay = function renderOverlay() {
    var _this3 = this

    var overlay = (this.state && this.state.overlay) || {}
    var _props3 = this.props,
      accessors = _props3.accessors,
      localizer = _props3.localizer,
      components = _props3.components,
      getters = _props3.getters,
      getNow = _props3.getNow,
      selected = _props3.selected,
      popupOffset = _props3.popupOffset

    var allDayEventComponents = _extends({}, components, {
      event: components.allDayEvent,
    })

    return _react2.default.createElement(
      _Overlay2.default,
      {
        rootClose: true,
        placement: 'bottom',
        container: this,
        show: !!overlay.position,
        onHide: function onHide() {
          return _this3.setState({ overlay: null })
        },
      },
      _react2.default.createElement(
        _Position2.default,
        {
          position: overlay.position,
          container: this.refs.headerCell,
          offset: popupOffset,
          disable: 'top',
        },
        _react2.default.createElement(_Popup2.default, {
          accessors: accessors,
          getters: getters,
          selected: selected,
          components: allDayEventComponents,
          localizer: localizer,
          events: overlay.events,
          getNow: getNow,
          onClick: this.props.handleDetailEvent,
          slotStart: overlay.date,
          slotEnd: overlay.end,
          onSelect: this.handleSelectEvent,
          onDoubleClick: this.handleDoubleClickEvent,
        })
      )
    )
  }

  TimeGridHeader.prototype.render = function render() {
    var _this4 = this

    var _props4 = this.props,
      width = _props4.width,
      resources = _props4.resources,
      range = _props4.range,
      renderDetailView = _props4.renderDetailView,
      isOverflowing = _props4.isOverflowing,
      localizer = _props4.localizer,
      TimeGutterHeader = _props4.components.timeGutterHeader

    var gutterDate = range.length ? range[0] : this.props.getNow()

    var style = {}

    return _react2.default.createElement(
      'div',
      {
        ref: 'headerCell',
        style: style,
        className: (0, _classnames2.default)(
          'rbc-time-header',
          isOverflowing && 'rbc-overflowing'
        ),
      },
      _react2.default.createElement(
        'div',
        { className: 'rbc-time-header-gutter', style: { width: width } },
        TimeGutterHeader &&
          _react2.default.createElement(TimeGutterHeader, {
            date: gutterDate,
            localizer: localizer,
            label: localizer.format(gutterDate, 'timeGutterHeaderFormat'),
          })
      ),
      _react2.default.createElement(
        'div',
        { className: 'rbc-time-header-content' },
        _react2.default.createElement(
          'div',
          { className: 'rbc-row rbc-time-header-cell' },
          this.renderHeaderCells(range)
        ),
        resources &&
          _react2.default.createElement(
            'div',
            { className: 'rbc-row rbc-row-resource' },
            this.renderHeaderResources(range, resources)
          ),
        resources
          ? _react2.default.createElement(
              'div',
              { className: 'rbc-row rbc-row-resource' },
              resources.map(function(resource) {
                return _this4.renderRow(resource)
              })
            )
          : this.renderRow()
      ),
      renderDetailView && renderDetailView(this.refs.headerCell),
      this.renderOverlay()
    )
  }

  return TimeGridHeader
})(_react2.default.Component)

TimeGridHeader.propTypes = {
  range: _propTypes2.default.array.isRequired,
  events: _propTypes2.default.array.isRequired,
  resources: _propTypes2.default.array,
  getNow: _propTypes2.default.func.isRequired,
  isOverflowing: _propTypes2.default.bool,
  maxAllDayEvents: _propTypes2.default.number,
  popupOffset: _propTypes3.popupOffsetShape,
  detailOffset: _propTypes3.popupOffsetShape,

  rtl: _propTypes2.default.bool,
  width: _propTypes2.default.number,
  renderDetailView: _propTypes2.default.oneOfType([
    _propTypes2.default.bool,
    _propTypes2.default.func,
  ]),

  localizer: _propTypes2.default.object.isRequired,
  accessors: _propTypes2.default.object.isRequired,
  components: _propTypes2.default.object.isRequired,
  getters: _propTypes2.default.object.isRequired,

  selected: _propTypes2.default.object,
  selectable: _propTypes2.default.oneOf([true, false, 'ignoreEvents']),
  longPressThreshold: _propTypes2.default.number,

  onClick: _propTypes2.default.func,
  handleDetailEvent: _propTypes2.default.func,
  onSelectSlot: _propTypes2.default.func,
  onSelectEvent: _propTypes2.default.func,
  onDoubleClickEvent: _propTypes2.default.func,
  clearSelection: _propTypes2.default.func,
  onDrillDown: _propTypes2.default.func,
  onShowMore: _propTypes2.default.func,
  getDrilldownView: _propTypes2.default.func.isRequired,
}
exports.default = TimeGridHeader
module.exports = exports['default']
