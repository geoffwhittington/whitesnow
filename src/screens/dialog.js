import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReactMarkdown from 'react-markdown'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles({
  dialog: {
      '& DialogTitle': {
          borderBottom: 'solid',
	  borderWidth: 1
      }
  },
  markdown: {
    '& pre': {
       marginLeft: 12,
       fontSize: '0.8em',
       background: '#e0e0e0'
    },
    '& code': {
       background: '#e0e0e0',
       wordWrap: 'normal'
    },
    '& h2': {
       fontSize: '1em'
    },
    '& h3': {
       fontSize: '1em',
    },
    '& p': {
       fontSize: 14
    },
    '& li': {
       fontSize: 14
    }
  },
});

export default function ScrollDialog(props) {
  const classes = useStyles();

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (props.open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, []);

  const SubTitle = (props) => {
      let terms = [];

      if (props.terms){
          terms = props.terms.split(" ");
      }

      return (
          <>
	  {terms.map((term) => (
	      <Chip size="small" label={term}/>
	  ))}
	  </>
      )
  }

  return (
      <Dialog
        fullWidth={true}
	maxWidth={'md'} 
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
	className={classes.dialog}
      >
        <DialogTitle id="scroll-dialog-title">
	  <span style={{float:'left'}}>
	  {props.title}
	  <div style={{marginTop: 4, fontSize:12}}>
	  <strong>Read time</strong>: 5 mins
	  </div>
	  <div>
	  <SubTitle terms={props.terms}/>
          </div>
	  </span>
	  <span style={{float:'right'}}>
	  <IconButton onClick={props.handleClose}>
	    <CloseIcon />
	  </IconButton>
	  </span>
	</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <ReactMarkdown className={classes.markdown}>{props.text}</ReactMarkdown>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
  );
}

