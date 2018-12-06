import PropTypes from 'prop-types'
import React from 'react'
import { findDOMNode } from 'react-dom'
import cn from 'classnames'

import dates from './utils/dates'
import chunk from 'lodash/chunk'

import { navigate, views } from './utils/constants'
import { notify } from './utils/helpers'
import getPosition from 'dom-helpers/query/position'
import { popupOffsetShape } from './utils/propTypes'
import raf from 'dom-helpers/util/requestAnimationFrame'

import Popup from './Popup'
import DetailView from './DetailView'
import Overlay from 'react-overlays/lib/Overlay'
import Position from './Position'
import DateContentRow from './DateContentRow'
import Header from './Header'
import DateHeader from './DateHeader'

import { inRange, sortEvents } from './utils/eventLevels'

let eventsForWeek = (evts, start, end, accessors) =>
  evts.filter(e => inRange(e, start, end, accessors))

let propTypes = {
  events: PropTypes.array.isRequired,
  date: PropTypes.instanceOf(Date),

  min: PropTypes.instanceOf(Date),
  max: PropTypes.instanceOf(Date),

  step: PropTypes.number,
  getNow: PropTypes.func.isRequired,

  scrollToTime: PropTypes.instanceOf(Date),
  rtl: PropTypes.bool,
  width: PropTypes.number,

  accessors: PropTypes.object.isRequired,
  components: PropTypes.object.isRequired,
  getters: PropTypes.object.isRequired,
  localizer: PropTypes.object.isRequired,

  selected: PropTypes.object,
  selectable: PropTypes.oneOf([true, false, 'ignoreEvents']),
  longPressThreshold: PropTypes.number,

  onNavigate: PropTypes.func,
  onClick: PropTypes.func,
  onSelectSlot: PropTypes.func,
  onSelectEvent: PropTypes.func,
  onDoubleClickEvent: PropTypes.func,
  onShowMore: PropTypes.func,
  onDrillDown: PropTypes.func,
  onResize: PropTypes.func,
  getDrilldownView: PropTypes.func.isRequired,

  popup: PropTypes.bool,

  overlayOffset: popupOffsetShape,
  detailOffset: popupOffsetShape,
}

class MonthView extends React.Component {
  static displayName = 'MonthView'
  static propTypes = propTypes

  constructor(...args) {
    super(...args)

    this._bgRows = []
    this._pendingSelection = []
    this.state = {
      rowLimit: 5,
      needLimitMeasure: true,
    }
  }

  hide = what => () => this.setState(() => ({ [what]: null }))

  componentWillReceiveProps({ date }) {
    this.setState({
      needLimitMeasure: !dates.eq(date, this.props.date),
    })
  }

  componentDidMount() {
    let running

    if (this.state.needLimitMeasure) this.measureRowLimit(this.props)

    window.addEventListener(
      'resize',
      (this._resizeListener = () => {
        if (!running) {
          raf(() => {
            running = false
            this.setState({ needLimitMeasure: true }, () => {
              if (this.props.onResize) {
                this.props.onResize()
              }
            })
          })
        }

        this.updateStateOnResize('overlay', this.previousShowMoreCell)
        this.updateStateOnResize('detail', this.previousDetailCell)
      }),
      false
    )
  }

  getNewElement = (stateKey, element) => {
    const { id } = element.dataset

    if (stateKey === 'detail' && this.state.overlay) {
      return document.querySelector(`.rbc-popup [data-id="${id}"]`)
    } else {
      return document.querySelector(`[data-id="${id}"]`)
    }
  }

  updateStateOnResize(stateKey, element) {
    if (this.state[stateKey]) {
      const newElement = this.getNewElement(stateKey, element)
      const position = getPosition(newElement, findDOMNode(this))

      this.setState(prevState => ({
        [stateKey]: { ...prevState[stateKey], position },
      }))
    }
  }

  componentDidUpdate() {
    if (this.state.needLimitMeasure) this.measureRowLimit(this.props)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resizeListener, false)
  }

  getContainer = () => {
    return findDOMNode(this)
  }

  render() {
    let { date, localizer, className } = this.props,
      month = dates.visibleDays(date, localizer),
      weeks = chunk(month, 7)

    this._weekCount = weeks.length

    return (
      <div ref="content" className={cn('rbc-month-view', className)}>
        <div className="rbc-row rbc-month-header">
          {this.renderHeaders(weeks[0])}
        </div>
        {weeks.map(this.renderWeek)}
        {this.props.popup && this.renderOverlay()}
        {this.props.components.detailView && this.renderDetailView()}
      </div>
    )
  }

  renderWeek = (week, weekIdx) => {
    let {
      events,
      components,
      selectable,
      getNow,
      selected,
      date,
      localizer,
      longPressThreshold,
      accessors,
      getters,
    } = this.props

    const { needLimitMeasure, rowLimit } = this.state

    events = eventsForWeek(events, week[0], week[week.length - 1], accessors)

    events.sort((a, b) => sortEvents(a, b, accessors))

    return (
      <DateContentRow
        key={weekIdx}
        ref={weekIdx === 0 ? 'slotRow' : undefined}
        container={this.getContainer}
        className="rbc-month-row"
        getNow={getNow}
        date={date}
        range={week}
        events={events}
        maxRows={rowLimit}
        selected={selected}
        selectable={selectable}
        components={components}
        accessors={accessors}
        getters={getters}
        localizer={localizer}
        renderHeader={this.readerDateHeading}
        renderForMeasure={needLimitMeasure}
        onShowMore={this.handleShowMore}
        onSelect={this.handleSelectEvent}
        onClick={this.handleDetailEvent}
        onDoubleClick={this.handleDoubleClickEvent}
        onSelectSlot={this.handleSelectSlot}
        longPressThreshold={longPressThreshold}
        rtl={this.props.rtl}
      />
    )
  }

  readerDateHeading = ({ date, className, ...props }) => {
    let { date: currentDate, getDrilldownView, localizer } = this.props

    let isOffRange = dates.month(date) !== dates.month(currentDate)
    let isCurrent = dates.eq(date, currentDate, 'day')
    let drilldownView = getDrilldownView(date)
    let label = localizer.format(date, 'dateFormat')
    let DateHeaderComponent = this.props.components.dateHeader || DateHeader

    return (
      <div
        {...props}
        className={cn(
          className,
          isOffRange && 'rbc-off-range',
          isCurrent && 'rbc-current'
        )}
      >
        <DateHeaderComponent
          label={label}
          date={date}
          drilldownView={drilldownView}
          isOffRange={isOffRange}
          onDrillDown={e => this.handleHeadingClick(date, drilldownView, e)}
        />
      </div>
    )
  }

  renderHeaders(row) {
    let { localizer, components } = this.props
    let first = row[0]
    let last = row[row.length - 1]
    let HeaderComponent = components.header || Header

    return dates.range(first, last, 'day').map((day, idx) => (
      <div key={'header_' + idx} className="rbc-header">
        <HeaderComponent
          date={day}
          localizer={localizer}
          label={localizer.format(day, 'weekdayFormat')}
        />
      </div>
    ))
  }

  renderOverlay() {
    let { position, events, date, end } =
      (this.state && this.state.overlay) || {}
    let {
      accessors,
      localizer,
      components,
      overlayOffset,
      getters,
      selected,
      getNow,
    } = this.props

    return (
      <Overlay
        container={this}
        show={!!position}
        rootClose
        placement="bottom"
        onHide={this.hide('overlay')}
      >
        <Position
          container={this.refs.content}
          offset={overlayOffset}
          position={position}
        >
          <Popup
            accessors={accessors}
            getters={getters}
            selected={selected}
            components={components}
            localizer={localizer}
            events={events}
            slotStart={date}
            slotEnd={end}
            getNow={getNow}
            onSelect={this.handleSelectEvent}
            onClick={this.handleDetailEvent}
            onDoubleClick={this.handleDoubleClickEvent}
            rtl={this.props.rtl}
          />
        </Position>
      </Overlay>
    )
  }

  renderDetailView() {
    const { event, position } = (this.state && this.state.detail) || {}
    const View = this.props.components.detailView
    let { accessors, localizer, getters, detailOffset, getNow } = this.props

    return (
      <Overlay
        container={this}
        show={!!position}
        rootClose
        placement="bottom"
        onHide={this.hide('detail')}
      >
        <Position
          container={this.refs.content}
          offset={detailOffset}
          position={position}
        >
          <DetailView
            accessors={accessors}
            getters={getters}
            View={View}
            localizer={localizer}
            event={event}
            hide={this.hide('detail')}
            getNow={getNow}
          />
        </Position>
      </Overlay>
    )
  }

  measureRowLimit() {
    this.setState({
      needLimitMeasure: false,
      rowLimit: this.refs.slotRow.getRowLimit(),
    })
  }

  handleSelectSlot = (range, slotInfo) => {
    this._pendingSelection = this._pendingSelection.concat(range)

    clearTimeout(this._selectTimer)
    this._selectTimer = setTimeout(() => this.selectDates(slotInfo))
  }

  handleHeadingClick = (date, view, e) => {
    e.preventDefault()
    this.clearSelection()
    notify(this.props.onDrillDown, [date, view])
  }

  handleSelectEvent = (...args) => {
    this.clearSelection()
    notify(this.props.onSelectEvent, args)
  }

  handleDoubleClickEvent = (...args) => {
    this.clearSelection()
    notify(this.props.onDoubleClickEvent, args)
  }

  handleShowMore = (events, date, cell, slot) => {
    const { popup, onDrillDown, onShowMore, getDrilldownView } = this.props
    //cancel any pending selections so only the event click goes through.
    this.clearSelection()

    if (popup) {
      let position = getPosition(cell, findDOMNode(this))
      let end = dates.add(date, 1, 'day')
      this.previousShowMoreCell = cell

      this.setState(() => ({
        overlay: { date, end, events, position },
      }))
    } else {
      notify(onDrillDown, [date, getDrilldownView(date) || views.DAY])
    }

    notify(onShowMore, [events, date, slot])
  }

  handleDetailEvent = (event, cell) => {
    const { components, onClick } = this.props
    if (components.detailView) {
      this.previousDetailCell = cell
      this.clearSelection()
      this.setState(() => ({
        detail: {
          event: event,
          position: getPosition(cell, findDOMNode(this)),
        },
      }))
    }
    notify(onClick, [event])
  }

  selectDates(slotInfo) {
    let slots = this._pendingSelection.slice()

    this._pendingSelection = []

    slots.sort((a, b) => +a - +b)

    notify(this.props.onSelectSlot, {
      slots,
      start: slots[0],
      end: slots[slots.length - 1],
      action: slotInfo.action,
    })
  }

  clearSelection() {
    clearTimeout(this._selectTimer)
    this._pendingSelection = []
  }
}

MonthView.range = (date, { culture }) => {
  let start = dates.firstVisibleDay(date, culture)
  let end = dates.lastVisibleDay(date, culture)
  return { start, end }
}

MonthView.navigate = (date, action) => {
  switch (action) {
    case navigate.PREVIOUS:
      return dates.add(date, -1, 'month')

    case navigate.NEXT:
      return dates.add(date, 1, 'month')

    default:
      return date
  }
}

MonthView.title = (date, { localizer }) =>
  localizer.format(date, 'monthHeaderFormat')

export default MonthView
