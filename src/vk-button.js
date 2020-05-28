import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/vk.scss';

class vkLogin extends React.Component {

  static propTypes = {
    disabled: PropTypes.bool,
    callback: PropTypes.func.isRequired,
    apiId: PropTypes.string.isRequired,
    containerStyle: PropTypes.object,
  };

  state = {
    isSdkLoaded: false,
    isProcessing: false,
  };

  componentDidMount() {
    if (document.getElementById('vk-jssdk')) {
      this.sdkLoaded();
      return;
    }
    this.setFbAsyncInit();
    this.loadSdkAsynchronously();
  }

  setFbAsyncInit() {
    const { apiId } = this.props;
    window.vkAsyncInit = () => {
      window.VK.init({ apiId });
      this.setState({ isSdkLoaded: true });
    };
  }

  sdkLoaded() {
    this.setState({ isSdkLoaded: true });
  }

  loadSdkAsynchronously() {
    const el = document.createElement('script');
    el.type = 'text/javascript';
    el.src = 'https://vk.com/js/api/openapi.js?139';
    el.async = true;
    el.id = 'vk-jssdk';
    document.getElementsByTagName('head')[0].appendChild(el);
  }

  checkLoginState = (response) => {
    this.setState({ isProcessing: false });

    if (this.props.callback) {
      this.props.callback(response);
    }
  };

  click = () => {
    if (!this.state.isSdkLoaded || this.state.isProcessing || this.props.disabled) {
      return;
    }
    this.setState({ isProcessing: true });
    window.VK.Auth.login(this.checkLoginState);
  };

  style() {
    return <style dangerouslySetInnerHTML={{ __html: styles }}/>;
  }

  // [AdGo] 20.11.2016 - coult not get container class to work
  containerStyle() {
    const style = { transition: 'opacity 0.5s' };
    if (this.state.isProcessing || !this.state.isSdkLoaded || this.props.disabled) {
      style.opacity = 0.6;
    }
    return Object.assign(style, this.props.containerStyle);
  }

  render() {
    const { disabled, callback, apiId, ...buttonProps } = this.props;
    return (
      <span style={ this.containerStyle() }>
        <button
          {...buttonProps}
          onClick={this.click}
        />
        {this.style()}
      </span>
    );
  }
}

export default vkLogin;
