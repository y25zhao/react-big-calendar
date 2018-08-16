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
      label,
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
          className={cn('rbc-event', className, userProps.className, {
            'rbc-selected': selected,
            'rbc-event-continues-earlier': continuesEarlier,
            'rbc-event-continues-later': continuesLater,
            [`rbc-event-status-${status.toLowerCase()}`]: status,
          })}
        >
          {Event ? (
            <Event
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
  componentDidMount() {
    if (this.refs.root) {
      const { isExpandable, parentSelector, smallEventBoundary } = this.props
      if (this.props.parentSelector && this.props.isExpandable) {
        const { top, left } = this.refs.root.getBoundingClientRect()
        const parent = document.querySelector(parentSelector)
        let parentHeight = parent.scrollHeight
        let parentWidth = parent.scrollWidth
        let isOpensOverVert = top + isExpandable.y > parentHeight
        let isOpensOverHor = left + isExpandable.x > parentWidth

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
}

export default TimeGridEvent
