import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
import { InfoBar } from 'components';
import { createTransitionHook } from 'helpers/universalRouter';

const title = 'React Redux Example';
const description = 'All the modern best practices in one example.';
const image = 'https://react-redux.herokuapp.com/logo.jpg';

const meta = {
  title,
  description,
  meta: {
    charSet: 'utf-8',
    property: {
      'og:site_name': title,
      'og:image': image,
      'og:locale': 'en_US',
      'og:title': title,
      'og:description': description,
      'twitter:card': 'summary',
      'twitter:site': '@erikras',
      'twitter:creator': '@erikras',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image,
      'twitter:image:width': '200',
      'twitter:image:height': '200'
    }
  }
};

@connect(
    state => ({}),
    dispatch => bindActionCreators({}, dispatch))
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  };

  componentWillMount() {
    const {router, store} = this.context;
    this.transitionHook = createTransitionHook(store);
    router.addTransitionHook(this.transitionHook);
  }

  componentWillUnmount() {
    const {router} = this.context;
    router.removeTransitionHook(this.transitionHook);
  }

  static fetchData(store) {
    const promises = [];
    if (!isInfoLoaded(store.getState())) {
      promises.push(store.dispatch(loadInfo()));
    }
    return Promise.all(promises);
  }

  render() {
    const styles = require('./App.scss');
    return (
      <div className={styles.app}>
        <DocumentMeta {...meta}/>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <Link to="/" className="navbar-brand">
              <div className={styles.brand}/>
              React Redux Example
            </Link>

            <ul className="nav navbar-nav">
              <li><Link to="/about">About Us</Link></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a href="https://github.com/wework/react-redux-universal-hot-example"
                   target="_blank" title="View on Github"><i className="fa fa-github"/></a>
              </li>
            </ul>
          </div>
        </nav>
        <div className={styles.appContent}>
          {this.props.children}
        </div>
        <InfoBar/>

        <div className="well text-center">
          Have questions? Ask for help <a
          href="https://github.com/erikras/react-redux-universal-hot-example/issues"
          target="_blank">on Github</a> or in the <a
          href="http://www.reactiflux.com/" target="_blank">#react-redux-universal</a> Slack channel.
        </div>
      </div>
    );
  }
}
