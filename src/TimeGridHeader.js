import PropTypes from 'prop-types'
import cn from 'classnames'
import { findDOMNode } from 'react-dom'
import scrollbarSize from 'dom-helpers/util/scrollbarSize' // eslint-disable-line
import getPosition from 'dom-helpers/query/position'
import React from 'react'
import Overlay from 'react-overlays/lib/Overlay'

import { popupOffsetShape } from './utils/propTypes'
import dates from './utils/dates'
import DateContentRow from './DateContentRow'
import Popup from './Popup'
import Position from './Position'
import Header from './Header'
import { notify } from './utils/helpers'

class TimeGridHeader extends React.Component {
  static propTypes = {
    range: PropTypes.array.isRequired,
    events: PropTypes.array.isRequired,
    resources: PropTypes.array,
    getNow: PropTypes.func.isRequired,
    isOverflowing: PropTypes.bool,
    maxAllDayEvents: PropTypes.number,
    popupOffset: popupOffsetShape,
    detailOffset: popupOffsetShape,

    rtl: PropTypes.bool,
    width: PropTypes.number,
    renderDetailView: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),

    localizer: PropTypes.object.isRequired,
    accessors: PropTypes.object.isRequired,
    components: PropTypes.object.isRequired,
    getters: PropTypes.object.isRequired,

    selected: PropTypes.object,
    selectable: PropTypes.oneOf([true, false, 'ignoreEvents']),
    longPressThreshold: PropTypes.number,

    onClick: PropTypes.func,
    handleDetailEvent: PropTypes.func,
    onSelectSlot: PropTypes.func,
    onSelectEvent: PropTypes.func,
    onDoubleClickEvent: PropTypes.func,
    clearSelection: PropTypes.func,
    onDrillDown: PropTypes.func,
    onShowMore: PropTypes.func,
    getDrilldownView: PropTypes.func.isRequired,
  }

  state = {
    overlay: null,
  }

  handleHeaderClick = (date, view, e) => {
    e.preventDefault()
    notify(this.props.onDrillDown, [date, view])
  }

  renderHeaderResources(range, resources) {
    const { accessors, getNow } = this.props
    const today = getNow()

    return range.map((date, i) => {
      return resources.map((resource, j) => {
        return (
          <div
            key={`${i}-${j}`}
            className={cn(
              'rbc-header',
              dates.eq(date, today, 'day') && 'rbc-today'
            )}
          >
            {accessors.resourceTitle(resource)}
          </div>
        )
      })
    })
  }

  renderHeaderCells(range) {
    let {
      localizer,
      getDrilldownView,
      getNow,
      getters: { dayProp },
      components: { header: HeaderComponent = Header },
    } = this.props

    const today = getNow()

    return range.map((date, i) => {
      let drilldownView = getDrilldownView(date)
      let label = localizer.format(date, 'dayFormat')

      const { className, style } = dayProp(date)

      let header = (
        <HeaderComponent date={date} label={label} localizer={localizer} />
      )

      return (
        <div
          key={i}
          style={style}
          className={cn(
            'rbc-header',
            className,
            dates.eq(date, today, 'day') && 'rbc-today'
          )}
        >
          {drilldownView ? (
            <a
              href="#"
              onClick={e => this.handleHeaderClick(date, drilldownView, e)}
            >
              {header}
            </a>
          ) : (
            <span>{header}</span>
          )}
        </div>
      )
    })
  }
  renderRow = resource => {
    let {
      events,
      rtl,
      selectable,
      getNow,
      range,
      getters,
      localizer,
      accessors,
      components,
      maxAllDayEvents,
    } = this.props

    const resourceId = accessors.resourceId(resource)
    let eventsToDisplay = resource
      ? events.filter(event => accessors.resource(event) === resourceId)
      : events

    let allDayEventComponents = {
      ...components,
      event: components.allDayEvent,
    }

    return (
      <DateContentRow
        isAllDay
        rtl={rtl}
        getNow={getNow}
        minRows={0}
        range={range}
        events={eventsToDisplay}
        resourceId={resourceId}
        maxRows={maxAllDayEvents}
        className="rbc-allday-cell"
        selectable={selectable}
        selected={this.props.selected}
        components={allDayEventComponents}
        accessors={accessors}
        getters={getters}
        localizer={localizer}
        onClick={this.props.handleDetailEvent(this.refs.headerCell)}
        onSelect={this.props.onSelectEvent}
        onShowMore={this.handleShowMore}
        onDoubleClick={this.props.onDoubleClickEvent}
        onSelectSlot={this.props.onSelectSlot}
        longPressThreshold={this.props.longPressThreshold}
      />
    )
  }

  renderOverlay() {
    let overlay = (this.state && this.state.overlay) || {}
    let {
      accessors,
      localizer,
      components,
      getters,
      getNow,
      selected,
      popupOffset,
    } = this.props

    let allDayEventComponents = {
      ...components,
      event: components.allDayEvent,
    }

    return (
      <Overlay
        rootClose
        placement="bottom"
        container={this}
        show={!!overlay.position}
        onHide={() => this.setState({ overlay: null })}
      >
        <Position
          position={overlay.position}
          container={this.refs.headerCell}
          offset={popupOffset}
          disable="top"
        >
          <Popup
            accessors={accessors}
            getters={getters}
            selected={selected}
            components={allDayEventComponents}
            localizer={localizer}
            events={overlay.events}
            getNow={getNow}
            onClick={this.props.handleDetailEvent(this.refs.headerCell)}
            slotStart={overlay.date}
            slotEnd={overlay.end}
            onSelect={this.handleSelectEvent}
            onDoubleClick={this.handleDoubleClickEvent}
          />
        </Position>
      </Overlay>
    )
  }

  render() {
    let {
      width,
      resources,
      range,
      renderDetailView,
      isOverflowing,
      localizer,
      components: { timeGutterHeader: TimeGutterHeader },
    } = this.props

    let gutterDate = range.length ? range[0] : this.props.getNow()

    let style = {}

    return (
      <div
        ref="headerCell"
        style={style}
        className={cn('rbc-time-header', isOverflowing && 'rbc-overflowing')}
      >
        <div className="rbc-time-header-gutter" style={{ width }}>
          {TimeGutterHeader && (
            <TimeGutterHeader
              date={gutterDate}
              localizer={localizer}
              label={localizer.format(gutterDate, 'timeGutterHeaderFormat')}
            />
          )}
        </div>

        <div className="rbc-time-header-content">
          <div className="rbc-row rbc-time-header-cell">
            {this.renderHeaderCells(range)}
          </div>
          {resources && (
            <div className="rbc-row rbc-row-resource">
              {this.renderHeaderResources(range, resources)}
            </div>
          )}

          {resources ? (
            <div className="rbc-row rbc-row-resource">
              {resources.map(resource => this.renderRow(resource))}
            </div>
          ) : (
            this.renderRow()
          )}
        </div>
        {renderDetailView && renderDetailView(this.refs.headerCell)}
        {this.renderOverlay()}
      </div>
    )
  }

  handleShowMore = (events, date, cell, slot) => {
    const { onShowMore, clearSelection } = this.props
    //cancel any pending selections so only the event click goes through.
    clearSelection()
    let position = getPosition(cell, findDOMNode(this))

    this.setState({
      overlay: { date, events, position },
    })

    notify(onShowMore, [events, date, slot])
  }
}

export default TimeGridHeader
