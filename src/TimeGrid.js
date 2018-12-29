import PropTypes from 'prop-types'
import cn from 'classnames'
import raf from 'dom-helpers/util/requestAnimationFrame'
import getPosition from 'dom-helpers/query/position'
import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import debounce from 'lodash/debounce'

import { popupOffsetShape } from './utils/propTypes'
import dates from './utils/dates'
import DayColumn from './DayColumn'
import TimeGutter from './TimeGutter'

import getWidth from 'dom-helpers/query/width'
import TimeGridHeader from './TimeGridHeader'
import DetailView from './DetailView'
import Position from './Position'
import Overlay from 'react-overlays/lib/Overlay'
import { notify } from './utils/helpers'
import { inRange, sortEvents } from './utils/eventLevels'

export default class TimeGrid extends Component {
  static propTypes = {
    events: PropTypes.array.isRequired,
    resources: PropTypes.array,

    step: PropTypes.number,
    timeslots: PropTypes.number,
    range: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    min: PropTypes.instanceOf(Date),
    max: PropTypes.instanceOf(Date),
    getNow: PropTypes.func.isRequired,
    maxAllDayEvents: PropTypes.number,
    popupOffset: popupOffsetShape,
    detailOffset: popupOffsetShape,
    isExpandable: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
      }),
    ]),

    scrollToTime: PropTypes.instanceOf(Date),
    showMultiDayTimes: PropTypes.bool,

    rtl: PropTypes.bool,
    width: PropTypes.number,

    accessors: PropTypes.object.isRequired,
    components: PropTypes.object.isRequired,
    getters: PropTypes.object.isRequired,
    localizer: PropTypes.object.isRequired,

    selected: PropTypes.object,
    selectable: PropTypes.oneOf([true, false, 'ignoreEvents']),
    longPressThreshold: PropTypes.number,

    onClick: PropTypes.func,
    onNavigate: PropTypes.func,
    onSelectSlot: PropTypes.func,
    onSelectEnd: PropTypes.func,
    onSelectStart: PropTypes.func,
    onSelectEvent: PropTypes.func,
    onResize: PropTypes.func,
    onDoubleClickEvent: PropTypes.func,
    onDrillDown: PropTypes.func,
    getDrilldownView: PropTypes.func.isRequired,
  }

  static defaultProps = {
    step: 30,
    timeslots: 2,
    min: dates.startOf(new Date(), 'day'),
    max: dates.endOf(new Date(), 'day'),
    scrollToTime: dates.startOf(new Date(), 'day'),
  }

  constructor(props) {
    super(props)

    this.state = {
      gutterWidth: undefined,
      isOverflowing: null,
      currentTime: '',
    }

    this.renderDetailView = this.renderDetailView.bind(this)
    this.handleResizeDebounced = debounce(this.handleResize, 100)
  }

  componentWillMount() {
    this.calculateScroll()
  }

  componentDidMount() {
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

  handleResize = () => {
    raf.cancel(this.rafHandle)
    this.rafHandle = raf(this.checkOverflow)

    if (this.state.detail) {
      this.setState(prevState => ({
        detail: {
          ...prevState.detail,
          position: getPosition(
            this.previousCell,
            findDOMNode(this.previousContainer)
          ),
        },
      }))
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this._timeIndicatorTimeout)
    window.removeEventListener('resize', this.handleResizeDebounced)

    raf.cancel(this.rafHandle)
  }

  componentDidUpdate() {
    if (this.props.width == null) {
      this.measureGutter()
    }

    this.applyScroll()
    this.positionTimeIndicator()
    //this.checkOverflow()
  }

  componentWillReceiveProps(nextProps) {
    const { range, scrollToTime } = this.props
    // When paginating, reset scroll
    if (
      !dates.eq(nextProps.range[0], range[0], 'minute') ||
      !dates.eq(nextProps.scrollToTime, scrollToTime, 'minute')
    ) {
      this.calculateScroll(nextProps)
    }
  }

  gutterRef = ref => {
    this.gutter = ref && findDOMNode(ref)
  }

  handleSelectAlldayEvent = (...args) => {
    //cancel any pending selections so only the event click goes through.
    this.clearSelection()
    notify(this.props.onSelectEvent, args)
  }

  handleSelectAllDaySlot = (slots, slotInfo) => {
    const { onSelectSlot } = this.props
    notify(onSelectSlot, {
      slots,
      start: slots[0],
      end: slots[slots.length - 1],
      action: slotInfo.action,
    })
  }

  renderEvents(range, events, today, resources) {
    let {
      min,
      max,
      components,
      accessors,
      localizer,
      isExpandable,
    } = this.props

    return range.map((date, idx) => {
      let daysEvents = events.filter(event =>
        dates.inRange(date, accessors.start(event), accessors.end(event), 'day')
      )

      return resources.map((resource, id) => {
        const resourceId = accessors.resourceId(resource)
        let eventsToDisplay = !resource
          ? daysEvents
          : daysEvents.filter(event => accessors.resource(event) === resourceId)

        return (
          <DayColumn
            {...this.props}
            localizer={localizer}
            min={dates.merge(date, min)}
            max={dates.merge(date, max)}
            resource={resourceId}
            parentSelector=".rbc-time-content"
            components={components}
            onClick={this.handleDetailEvent(this.refs.content)}
            isExpandable={isExpandable}
            className={cn({ 'rbc-now': dates.eq(date, today, 'day') })}
            key={idx + '-' + id}
            date={date}
            events={eventsToDisplay}
          />
        )
      })
    })
  }

  render() {
    let {
      events,
      range,
      width,
      selected,
      getNow,
      resources,
      components,
      accessors,
      getters,
      localizer,
      popupOffset,
      min,
      max,
      maxAllDayEvents,
      showMultiDayTimes,
      longPressThreshold,
    } = this.props

    let { event } = this.state.detail || {}
    let isAllday = event && accessors.allDay(event)

    width = width || this.state.gutterWidth

    let start = range[0],
      end = range[range.length - 1]

    this.slots = range.length

    let allDayEvents = [],
      rangeEvents = []

    events.forEach(event => {
      if (inRange(event, start, end, accessors)) {
        let eStart = accessors.start(event),
          eEnd = accessors.end(event)
        const daysMinutes = 1440

        if (
          accessors.allDay(event) ||
          (dates.isJustDate(eStart) && dates.isJustDate(eEnd)) ||
          (!showMultiDayTimes &&
            dates.diff(eStart, eEnd, 'minutes') >= daysMinutes)
        ) {
          allDayEvents.push(event)
        } else {
          rangeEvents.push(event)
        }
      }
    })

    allDayEvents.sort((a, b) => sortEvents(a, b, accessors))

    return (
      <div
        className={cn('rbc-time-view', {
          'rbc-week-view': range.length > 1 && range.length <= 7,
        })}
      >
        <TimeGridHeader
          range={range}
          events={allDayEvents}
          width={width}
          getNow={getNow}
          localizer={localizer}
          resources={resources}
          selected={selected}
          selectable={this.props.selectable}
          accessors={accessors}
          getters={getters}
          components={components}
          maxAllDayEvents={maxAllDayEvents}
          isOverflowing={this.state.isOverflowing}
          longPressThreshold={longPressThreshold}
          popupOffset={popupOffset}
          onSelectSlot={this.handleSelectAllDaySlot}
          onSelectEvent={this.handleSelectAlldayEvent}
          clearSelection={this.clearSelection}
          onDoubleClickEvent={this.props.onDoubleClickEvent}
          onDrillDown={this.props.onDrillDown}
          detailOffset={this.props.detailOffset}
          renderDetailView={isAllday && this.renderDetailView}
          handleDetailEvent={this.handleDetailEvent}
          getDrilldownView={this.props.getDrilldownView}
        />
        <div ref="content" className="rbc-time-content">
          <TimeGutter
            date={start}
            ref={this.gutterRef}
            localizer={localizer}
            min={dates.merge(start, min)}
            max={dates.merge(start, max)}
            step={this.props.step}
            getNow={this.props.getNow}
            timeslots={this.props.timeslots}
            components={components}
            className="rbc-time-gutter"
          />
          {this.renderEvents(range, rangeEvents, getNow(), resources || [null])}
          {components.detailView &&
            !isAllday &&
            this.renderDetailView(this.refs.content)}
          <div
            ref="timeIndicator"
            className="rbc-current-time-indicator"
            data-time={this.state.currentTime}
          />
        </div>
      </div>
    )
  }

  clearSelection = () => {
    clearTimeout(this._selectTimer)
    this._pendingSelection = []
  }

  measureGutter() {
    const width = getWidth(this.gutter)

    if (width && this.state.gutterWidth !== width) {
      this.setState({ gutterWidth: width })
    }
  }

  applyScroll() {
    if (this._scrollRatio) {
      const { content } = this.refs
      content.scrollTop = content.scrollHeight * this._scrollRatio
      // Only do this once
      this._scrollRatio = null
    }
  }

  calculateScroll(props = this.props) {
    const { min, max, scrollToTime } = props

    const diffMillis = scrollToTime - dates.startOf(scrollToTime, 'day')
    const totalMillis = dates.diff(max, min)

    this._scrollRatio = diffMillis / totalMillis
  }

  checkOverflow = () => {
    if (this._updatingOverflow) return

    let isOverflowing =
      this.refs.content.scrollHeight > this.refs.content.clientHeight

    if (this.state.isOverflowing !== isOverflowing) {
      this._updatingOverflow = true
      this.setState(
        { isOverflowing },
        () => {
          this._updatingOverflow = false
        },
        () => {
          if (this.props.onResize) {
            this.props.onResize()
          }
        }
      )
    }
  }

  positionTimeIndicator() {
    const { rtl, min, max, getNow, range } = this.props
    const current = getNow()
    const startDay = new Date(current.getTime()).setHours(0, 0, 0, 0)

    const secondsGrid = dates.diff(max, min, 'seconds')
    const secondsPassed = dates.diff(current, startDay, 'seconds')

    const timeIndicator = this.refs.timeIndicator
    const factor = secondsPassed / secondsGrid
    const timeGutter = this.gutter

    const content = this.refs.content

    if (timeGutter) {
      const pixelHeight = timeGutter.offsetHeight
      const dayPixelWidth =
        (content.offsetWidth - timeGutter.offsetWidth) / this.slots
      const dayOffset =
        range.findIndex(d => dates.eq(d, dates.today(), 'day')) * dayPixelWidth
      const offset = Math.floor(factor * pixelHeight)

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

  updateCurrentTime() {
    const { localizer, getNow } = this.props

    this.setState({
      currentTime: localizer.format(getNow(), 'currentTimeIndicatorFormat'),
    })
  }

  triggerTimeIndicatorUpdate() {
    // Update the position of the time indicator every minute
    this._timeIndicatorTimeout = window.setTimeout(() => {
      this.updateCurrentTime()

      this.positionTimeIndicator()

      this.triggerTimeIndicatorUpdate()
    }, 60000)
  }

  handleDetailEvent = container => (event, cell) => {
    const { components, onClick } = this.props
    if (components.detailView && cell) {
      this.previousContainer = container
      this.previousCell = cell
      this.clearSelection()
      this.setState(() => ({
        detail: {
          event: event,
          position: getPosition(cell, findDOMNode(container)),
        },
      }))
    }
    notify(onClick, [event])
  }

  hide = what => () => this.setState(() => ({ [what]: null }))

  renderDetailView = container => {
    const { event, position } = (this.state && this.state.detail) || {}
    const View = this.props.components.detailView
    let isAllday = event && this.props.accessors.allDay(event)
    let { accessors, localizer, getters, detailOffset, getNow } = this.props

    return (
      <Overlay
        container={container}
        show={!!position}
        rootClose
        placement="bottom"
        onHide={this.hide('detail')}
      >
        <Position
          disable={isAllday ? 'top' : false}
          container={container}
          position={position}
          offset={detailOffset}
        >
          <DetailView
            accessors={accessors}
            getters={getters}
            View={View}
            localizer={localizer}
            hide={this.hide('detail')}
            event={event}
            getNow={getNow}
          />
        </Position>
      </Overlay>
    )
  }
}
