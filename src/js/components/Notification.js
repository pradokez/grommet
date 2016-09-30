// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { FormattedDate } from 'react-intl';
import Intl from '../utils/Intl';
import Box from './Box';
import Value from './Value';
import Animate from './Animate';
import Meter from './Meter';
import Button from './Button';
import StatusIcon from './icons/Status';
import CloseIcon from './icons/base/Close';
import Props from '../utils/Props';
import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.NOTIFICATION;
const BACKGROUND_COLOR_INDEX = CSSClassnames.BACKGROUND_COLOR_INDEX;

export default class Notification extends Component {

  render () {
    let classes = classnames(
      CLASS_ROOT,
      `${CLASS_ROOT}--status-${this.props.status.toLowerCase()}`,
      `${BACKGROUND_COLOR_INDEX}-${this.props.status.toLowerCase()}`,
      this.props.className,
      {
        [`${CLASS_ROOT}--${this.props.size}`]: this.props.size,
        [`${CLASS_ROOT}--disabled`]: !this.props.onClick
      }
    );

    let status;
    if (this.props.status) {
      status = (
        <StatusIcon className={`${CLASS_ROOT}__status`}
          value={this.props.status} size={this.props.size} />
      );
    }

    let state;
    if (this.props.state) {
      state = (
        <div className={`${CLASS_ROOT}__state`}>{this.props.state}</div>
      );
    }

    let progress;
    if (this.props.percentComplete || 0 === this.props.percentComplete) {
      progress = (
        <span>
          <Meter
            series={[{
              value: this.props.percentComplete,
              colorIndex: 'light-1'
            }]}
          />
          <Value value={this.props.percentComplete} units="%" size="small"/>
        </span>
      );
    }

    let timestamp;
    if (this.props.timestamp) {
      let timestampFormatted = this.props.timestamp.toString();
      if (this.context.intl) {
        timestampFormatted = (
          <FormattedDate value={this.props.timestamp}
            weekday="long"
            day="numeric"
            month="long"
            year="numeric"
            hour="numeric"
            minute="numeric"
            second="numeric" />
        );
      }

      timestamp = (
        <div className={`${CLASS_ROOT}__timestamp`}>
          {timestampFormatted}
        </div>
      );
    }

    let closer;
    if (typeof this.props.closer === 'object') {
      closer = this.props.closer;
    } else if (this.props.onClose && this.props.closer) {
      closer = (
        <Button plain={true} onClick={this.props.onClose}
          icon={<CloseIcon className={`${CLASS_ROOT}__close`} />}
          a11yTitle={
            Intl.getMessage(this.context.intl, 'Close Notification')
          } />
      );
    }

    let boxProps = Props.pick(this.props, Object.keys(Box.propTypes));
    let fullBox =
      boxProps.hasOwnProperty('full') ? boxProps.full : 'horizontal';

    return (
      <Animate
        enter={{ animation: 'fade', duration: 1000 }}
        leave={{ animation: 'fade', duration: 1000 }}>
        <Box {...boxProps} className={classes} pad='small'
          direction="row" align="start" responsive={false}
          full={fullBox}>
          <Box pad='small'>
            {status}
          </Box>
          <Box flex={true} pad='small'>
            <span className={`${CLASS_ROOT}__message`}>
              {this.props.message}
            </span>
            {this.props.context}
            {timestamp}
            {state}
            {progress}
            {this.props.children}
          </Box>
          {closer}
        </Box>
      </Animate>
    );
  }
};

Notification.propTypes = {
  closer: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.bool
  ]),
  context: PropTypes.node,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  percentComplete: PropTypes.number,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  state: PropTypes.string,
  status: PropTypes.string,
  timestamp: PropTypes.object, // Date
  ...Box.propTypes
};

Notification.contextTypes = {
  intl: PropTypes.object
};

Notification.defaultProps = {
  closer: false,
  flush: true,
  status: 'unknown',
  pad: 'medium'
};
