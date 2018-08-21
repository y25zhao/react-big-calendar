import PropTypes from 'prop-types'
import React from 'react'
import { popupOffsetShape } from './utils/propTypes'
import getPosition from 'dom-helpers/query/position'
import getScrollTop from 'dom-helpers/query/scrollTop'
import getScrollLeft from 'dom-helpers/query/scrollLeft'

export default class Position extends React.Component {
  static propTypes = {
    disable: PropTypes.oneOf([true, false, 'top', 'left']),
    offset: popupOffsetShape,
    position: PropTypes.object,
    container: PropTypes.object,
    zIndex: PropTypes.number,
  }

  static defaultProps = {
    vertOffsetGetter: 'clientHeight',
    zIndex: 5,
    disable: false,
    container: window,
  }

  componentDidMount() {
    const { container, disable, offset = {} } = this.props
    const el = this.refs.root

    const { top, left, width, height } = getPosition(el, container)
    const bottom = top + height
    const right = left + width
    const vertGap = container.clientHeight + getScrollTop(container)
    const horGap = container.clientWidth + getScrollLeft(container)

    if (disable !== true && (bottom >= vertGap || right >= horGap)) {
      if (bottom > vertGap && disable !== 'top') {
        el.style.top = `${top - (bottom - vertGap) - (offset.y || 0)}px`
      }
      if (right > horGap && disable !== 'left') {
        el.style.left = `${left - (right - horGap) - (offset.x || 0)}px`
      }
    }
  }

  render() {
    let { offset = {}, children, position = {}, zIndex } = this.props
    let { left, width, top } = position

    let style = {
      position: 'absolute',
      top: Math.max(0, top) + (offset.y || 0),
      left: Math.max(0, left) + (offset.x || 0),
      zIndex: zIndex,
      width: offset.width || width + width / 2,
    }

    return (
      <div ref="root" style={style}>
        {children}
      </div>
    )
  }
}
