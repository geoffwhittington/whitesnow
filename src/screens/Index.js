import React, {useEffect, useState} from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import HoverRating from "./rating";
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function Search(props){
  const [searchQuery, setSearchQuery] = useState("");
  const feedbackToken = 'igzLoDPGezxWNlsQl';
  const classes = useStyles();

  const onQueryChange = (e) => {
      setSearchQuery(e.target.value);
  }

  function onRating(feedback, search, title, link) {
    try {
        fetch(`https://v1.nocodeapi.com/cheezr/google_sheets/ItoBNEeneTgOWxgj/?api_key=${feedbackToken}&tabId=Sheet1`, {
            method: "post",
            body: JSON.stringify([[feedback,search,title,link]]),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
          .then(data => {
        })
    } catch (error) {
        console.error("Error:", error);
    }
  }

  return (
	    <div className={classes.root}>
	        <h1>Task 1</h1>
	        <Typography paragraph={true}>
	        Ultimate ascetic victorious faith derive philosophy salvation against ultimate. Abstract marvelous marvelous aversion god passion pious chaos suicide.

	  Salvation depths joy pious justice ultimate evil revaluation. Malelovent decieve pinnacle will aversion.

	  Dead enlightenment truth decrepit pinnacle. Marvelous philosophy moral morality noble victorious revaluation insofar endless right contradict holiest inexpedient free. Mountains strong play gains superiority grandeur ascetic superiority reason prejudice against war madness eternal-return. Decrepit zarathustra chaos right intentions burying faithful hatred. Free contradict against god zarathustra gains intentions pinnacle oneself victorious will. Battle dead mountains merciful pinnacle ascetic insofar society holiest.
	        </Typography>
	        <h2>Query</h2>
	         <TextField label={"Search query"} onChange={onQueryChange} value={searchQuery} />

	        <h2>Resources</h2>

                <Button variant="contained" target="_external1" href={`https://google.com/search?q=${searchQuery}`}>Option 1</Button>
	        <HoverRating search={searchQuery} title="option1" url={`https://google.com/search?q=${searchQuery}`} onRating={onRating}/>
<br/>
                 <Button variant="contained" target="_external2" href={`https://stackoverflow.com/search?q=${searchQuery}`}>Option 2</Button>
	        <HoverRating search={searchQuery} title="option2" url={`https://stackoverflow.com/search?q=${searchQuery}`} onRating={onRating}/>
<br/>

                <Button variant="contained" target="_external3" href={`/Search/${searchQuery}`}>Option 3</Button>
	        <HoverRating search={searchQuery} title="option3" url={`/Search?q=${searchQuery}`} onRating={onRating}/>
<br/>
            </div>
  )
}
