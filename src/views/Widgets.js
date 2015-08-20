import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {transitionTo} from 'redux-react-router';
import DocumentMeta from 'react-document-meta';
import {isLoaded} from '../reducers/widgets';
import {connect} from 'react-redux';
import * as widgetActions from '../actions/widgetActions';
import {load as loadWidgets} from '../actions/widgetActions';

@connect(
  state => ({
    widgets: state.widgets.data,
    error: state.widgets.error,
    loading: state.widgets.loading,
    query: state.router.query && state.router.query.q
  }),
  dispatch => bindActionCreators({
    ...widgetActions,
    transitionTo
  }, dispatch)
)
export default
class Widgets extends Component {
  static propTypes = {
    widgets: PropTypes.array,
    error: PropTypes.string,
    loading: PropTypes.bool,
    load: PropTypes.func.isRequired,
    transitionTo: PropTypes.func.isRequired,
    query: PropTypes.string
  }

  state = {
    search: this.props.query
  }

  handleSearchChange(event) {
    this.setState({search: event.target.value});
  }

  handleSearch(event) {
    event.preventDefault();
    this.props.transitionTo('/widgets', {q: this.state.search});
  }

  render() {
    const {widgets, error, loading, load} = this.props;
    const {search} = this.state;
    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }
    const styles = require('./Widgets.scss');
    return (
      <div className={styles.widgets + ' container'}>
        <h1>
          Widgets
          <button className={styles.refreshBtn + ' btn btn-success'} onClick={load}><i
            className={refreshClassName}/> {' '} Reload Widgets
          </button>
        </h1>
        <DocumentMeta title="React Redux Example: Widgets"/>
        <p>
          This data was loaded from the server before this route was rendered. If you hit refresh on your browser, the
          data loading will take place on the server before the page is returned. If you navigated here from another
          page, the data was fetched from the client.
        </p>
        <form className={styles.search} onSubmit={::this.handleSearch}>
          <input type="text" value={search} className="form-control" onChange={::this.handleSearchChange}/>
        </form>
        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          {' '}
          {error}
        </div>}
        {widgets && widgets.length &&
        <table className="table table-striped">
          <thead>
          <tr>
            <th>ID</th>
            <th>Color</th>
            <th>Sprockets</th>
            <th>Owner</th>
          </tr>
          </thead>
          <tbody>
          {
            widgets.map((widget) => <tr key={widget.id}>
              <td>{widget.id}</td>
              <td>{widget.color}</td>
              <td>{widget.sprocketCount}</td>
              <td>{widget.owner}</td>
            </tr>)
          }
          </tbody>
        </table>}
      </div>
    );
  }

  static fetchData(store) {
    const state = store.getState();
    if (!isLoaded(state)) {
      const query = state.router && state.router.query && state.router.query.q || null;
      console.info('query', query);
      return store.dispatch(loadWidgets(query));
    }
  }
}

