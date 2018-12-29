import PropTypes from 'prop-types'
import React from 'react'
import cn from 'classnames'
import debounce from 'lodash/debounce'
import dates from './utils/dates'

let propTypes = {
  event: PropTypes.object.isRequired,
  slotStart: PropTypes.instanceOf(Date),
  slotEnd: PropTypes.instanceOf(Date),

  selected: PropTypes.bool,
  isAllDay: PropTypes.bool,
  continuesPrior: PropTypes.bool,
  continuesAfter: PropTypes.bool,

  accessors: PropTypes.object.isRequired,
  components: PropTypes.object.isRequired,
  getters: PropTypes.object.isRequired,
  localizer: PropTypes.object.isRequired,

  onSelect: PropTypes.func,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
}

class EventCell extends React.Component {
  handleClick = e => {
    e.persist()
    const target = e.target
    if (!this._delayedClick) {
      this._delayedClick = debounce(() => {
        this.clickedOnce = undefined
        this.props.onClick(this.props.event, target)
      }, 250)
    }
    if (this.clickedOnce) {
      this._delayedClick.cancel()
      this.clickedOnce = false
      if (this.props.onDoubleClick) {
        this.props.onDoubleClick(this.props.event, target)
      }
    } else {
      this._delayedClick(e)
      this.clickedOnce = true
    }
  }

  render() {
    let {
      style,
      className,
      event,
      selected,
      isAllDay,
      localizer,
      onClick,
      continuesPrior,
      continuesAfter,
      accessors,
      getters,
      components: { event: Event, eventWrapper: EventWrapper },
      ...props
    } = this.props

    let title = accessors.title(event)
    let tooltip = accessors.tooltip(event)
    let end = accessors.end(event)
    let start = accessors.start(event)
    let allDay = accessors.allDay(event)
    let status = accessors.status(event)

    let showAsAllDay =
      isAllDay || allDay || dates.diff(start, dates.ceil(end, 'day'), 'day') > 1

    let userProps = getters.eventProp(event, start, end, selected)

    let additionalClassNames = {
      'rbc-selected': selected,
      'rbc-event-allday': showAsAllDay,
      'rbc-event-continues-prior': continuesPrior,
      'rbc-event-continues-after': continuesAfter,
    }

    if (status && status.length) {
      additionalClassNames[`rbc-event-status-${status.toLowerCase()}`] = status
    }

    return (
      <EventWrapper {...this.props} type="date">
        <div
          {...props}
          ref="cell"
          style={{ ...userProps.style, ...style }}
          className={cn(
            'rbc-event',
            className,
            userProps.className,
            additionalClassNames
          )}
          // onClick={e => {
          //   onSelect && onSelect(event, e)
          //   // onClick && onClick(event, e.target)
          // }}
          onClick={this.handleClick}
        >
          {Event ? (
            <Event
              eventData={event}
              title={title}
              isAllDay={allDay}
              localizer={localizer}
              tooltip={tooltip}
              onClick={onClick}
              selected={selected}
              style={style}
            />
          ) : (
            title
          )}
        </div>
      </EventWrapper>
    )
  }
}

EventCell.propTypes = propTypes

export default EventCell
