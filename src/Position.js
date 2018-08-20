import PropTypes from 'prop-types'
import React from 'react'
import { popupOffsetShape } from './utils/propTypes'
import getPosition from 'dom-helpers/query/position'
import getScrollTop from 'dom-helpers/query/scrollTop'
import getScrollLeft from 'dom-helpers/query/scrollLeft'

export default class Position extends React.Component {
  state = {
    topAdj: 0,
    leftAdj: 0,
  }

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
    const result = { topAdj: 0, leftAdj: 0 }
    const { container, disable } = this.props

    const { top, left, width, height } = getPosition(this.refs.root, container)
    const bottom = top + height
    const right = left + width
    const vertGap = container.clientHeight + getScrollTop(container)
    const horGap = container.clientWidth + getScrollLeft(container)

    if (disable !== true && (bottom >= vertGap || right >= horGap)) {
      if (bottom > vertGap && disable !== 'top')
        result.topAdj = bottom - vertGap
      if (right > horGap && disable !== 'left') result.leftAdj = right - horGap

      this.setState(() => result)
    }
  }

  render() {
    let { offset = {}, children, position = {}, zIndex } = this.props
    let { left, width, top } = position
    let { topAdj, leftAdj } = this.state

    let style = {
      position: 'absolute',
      top: Math.max(0, top - topAdj - (offset.y || 0)),
      left: Math.max(0, left - leftAdj - (offset.x || 0)),
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
