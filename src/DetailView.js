import PropTypes from 'prop-types'
import React from 'react'
import { elementType } from './utils/propTypes'

export default class DetailView extends React.Component {
  static propTypes = {
    View: elementType.isRequired,
    getNow: PropTypes.func.isRequired,
    event: PropTypes.object,
    accessors: PropTypes.object.isRequired,
    getters: PropTypes.object.isRequired,
    localizer: PropTypes.object.isRequired,
  }

  render() {
    let { event, getters, accessors, getNow, localizer, View } = this.props

    return (
      <View
        event={event}
        getters={getters}
        accessors={accessors}
        localizer={localizer}
        getNow={getNow}
      />
    )
  }
}
