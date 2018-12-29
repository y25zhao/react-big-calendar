import cn from 'classnames'
import React from 'react'
import debounce from 'lodash/debounce'

/* eslint-disable react/prop-types */
class TimeGridEvent extends React.Component {
  handleClick = e => {
    e.persist()
    const target = e.target
    if (!this._delayedClick) {
      this._delayedClick = debounce(() => {
        this.clickedOnce = undefined
        this.props.onClick(e)
      }, 450)
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
    const {
      style,
      className,
      event,
      accessors,
      isRtl,
      selected,
      label,
      onClick,
      localizer,
      continuesEarlier,
      continuesLater,
      getters,
      components: { event: Event, eventWrapper: EventWrapper },
    } = this.props

    let title = accessors.title(event)
    let tooltip = accessors.tooltip(event)
    let end = accessors.end(event)
    let start = accessors.start(event)
    let status = accessors.status(event)

    let userProps = getters.eventProp(event, start, end, selected)

    let { height, top, width, xOffset } = style

    let additionalClassNames = {
      'rbc-selected': selected,
      'rbc-event-continues-earlier': continuesEarlier,
      'rbc-event-continues-later': continuesLater,
    }

    if (status && status.length) {
      additionalClassNames[`rbc-event-status-${status.toLowerCase()}`] = status
    }

    return (
      <EventWrapper type="time" {...this.props}>
        <div
          style={{
            ...userProps.style,
            top: `${top}%`,
            height: `${height}%`,
            [isRtl ? 'right' : 'left']: `${Math.max(0, xOffset)}%`,
            width: `${width}%`,
          }}
          ref="root"
          onClick={this.handleClick}
          className={cn(
            'rbc-event',
            className,
            userProps.className,
            additionalClassNames
          )}
        >
          {Event ? (
            <Event
              event={event}
              label={label}
              title={title}
              tooltip={tooltip}
              onClick={onClick}
              style={style}
              selected={selected}
              localizer={localizer}
            />
          ) : (
            title
          )}
        </div>
      </EventWrapper>
    )
  }
}

export default TimeGridEvent
