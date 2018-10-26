import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Snackbar from '@material-ui/core/Snackbar'

import { endpoints } from './endpoints'
import { Endpoint, CloseIconButton } from '../../components'
import {
  copiedCodeSnippet,
  closeCopiedMessage,
  changeExampleLang
} from './actions'
import { getSelectedLang, isCopiedMessageOpen } from './selectors'

const styles = {
  toolBar: {
    backgroundColor: '#F5F5F5'
  },
  tabBar: {
    maxWidth: 800,
    margin: '0 auto'
  }
}

function Docs({
  classes,
  copiedMessageOpen,
  selectedLang,
  changeLang,
  onSnippetCopy,
  onClose
}) {
  return (
    <div>
      <div className={classes.toolBar}>
        <div className={classes.tabBar}>
          <Tabs
            value={selectedLang}
            onChange={(_, value) => changeLang(value)}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab label="Curl" value="bash" />
            <Tab label="Javascript" value="javascript" />
            <Tab label="Go" value="go" />
            <Tab label="PHP" value="php" />
          </Tabs>
        </div>
      </div>
      {endpoints.map((ep, key) => (
        <Endpoint
          key={key}
          endpoint={ep.endpoint}
          method={ep.method}
          description={ep.description}
          request={ep[selectedLang]}
          requestLanguage={selectedLang}
          response={ep.exampleResponse}
          tryMeUrl={ep.tryMeUrl}
          onSnippetCopy={onSnippetCopy}
        />
      ))}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={copiedMessageOpen}
        ContentProps={{
          'aria-describedby': 'message-id'
        }}
        message={<span id="message-id">Copied response to clipboard</span>}
        action={<CloseIconButton onClick={onClose} />}
      />
    </div>
  )
}

Docs.propTypes = {
  classes: PropTypes.object,
  selectedLang: PropTypes.string.isRequired,
  changeLang: PropTypes.func.isRequired,
  copiedMessageOpen: PropTypes.bool.isRequired,
  onSnippetCopy: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  selectedLang: getSelectedLang(state),
  copiedMessageOpen: isCopiedMessageOpen(state)
})

const mapDispatchToProps = dispatch => ({
  changeLang: language => {
    dispatch(changeExampleLang(language))
  },
  onSnippetCopy: () => {
    dispatch(copiedCodeSnippet())
  },
  onClose: () => {
    dispatch(closeCopiedMessage())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Docs))
