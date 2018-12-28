import cn from 'classnames'
import React from 'react'

/* eslint-disable react/prop-types */
class TimeGridEvent extends React.Component {
  render() {
    const {
      style,
      className,
      event,
      accessors,
      isRtl,
      selected,
      onSelect,
      label,
      onClick,
      onDoubleClick,
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
          onClick={e => {
            onSelect && onSelect(event, e)
            onClick && onClick(event, e.target)
          }}
          className={cn(
            'rbc-event',
            className,
            userProps.className,
            additionalClassNames
          )}
        >
          {Event ? (
            <Event
              onDoubleClick={
                onDoubleClick
                  ? e => {
                      e.preventDefault()
                      return onDoubleClick(event, e)
                    }
                  : null
              }
              event={event}
              label={label}
              title={title}
              tooltip={tooltip}
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
