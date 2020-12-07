import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

const labels = {
  1: 'Unreviewed',
  2: 'Irrelevant',
  3: '50% solution',
  4: '80% solution',
  5: '100% solution!',
};

const useStyles = makeStyles({
  root: {
    width: 200,
    display: 'flex',
    alignItems: 'center',
  },
});

export default function HoverRating(props) {
  const [value, setValue] = React.useState(1);
  const [hover, setHover] = React.useState(-1);
  const [search,setSearch] = React.useState(props.search);
  const [url,setUrl] = React.useState(props.url);
  const [title,setTitle] = React.useState(props.title);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Rating
        name="hover-feedback"
        value={value}
        precision={1}
        onChange={(event, newValue) => {
          setValue(newValue);
          props.onRating(newValue, search, title, url);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
      />
      {value !== null && <Box ml={2}>{labels[hover !== -1 ? hover : value]}</Box>}
    </div>
  );
}
