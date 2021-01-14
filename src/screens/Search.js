import React, {useState} from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import ScrollDialog from "./dialog";
import HoverRating from "./rating";
import Drawer from '@material-ui/core/Drawer';
import SettingsIcon from '@material-ui/icons/Settings';

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
  const classes = useStyles();
  let { q } = useParams();

  const [searchText, setSearchText] = useState(q);
  const [feedbackToken, setFeedbackToken] = useState(window.localStorage.getItem('feedbackToken') || "");
  const [apiToken, setApiToken] = useState(window.sessionStorage.getItem('at') || "");
  const [serverName, setServerName] = useState(window.localStorage.getItem('serverName') || "");
  const [trainingServer, setTrainingServer] = useState(window.localStorage.getItem('trainingServer') || 'https://cd.sdelements.com');
  const [trainingResults, setTrainingResults] = useState([]);
  const [taskResults, setTaskResults] = useState([]);
  const [howToResults, setHowToResults] = useState([]);
  const [dialogText, setDialogText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOnSubmit = (e) => {
      setSearchText(searchText.trim())
      e.preventDefault();
      if(searchText)
         searchContent();
  }

  const onServerChange = (e) => {
      setServerName(e.target.value);
      window.localStorage.setItem('serverName', e.target.value);
  }

  const onSearchChange = (e) => {
      setSearchText(e.target.value)
  }

  const onApiTokenChange = (e) => {
      setApiToken(e.target.value);
      window.sessionStorage.setItem('at', e.target.value);
  }

  const onTrainingServerChange = (e) => {
      setTrainingServer(e.target.value);
      window.localStorage('trainingServer', e.target.value);
  }

  const onFeedbackTokenChange = (e) => {
      setFeedbackToken(e.target.value);
      window.localStorage('feedbackToken', e.target.value);
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

  const handleClose = () => { 
      setDialogOpen(false);
  }

  function searchContent() {
    fetch(
      `${serverName}/api/v2/kb/?max_items_each=8&search=${searchText}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Authorization": `Token ${apiToken}`,
        },
      }
    ).then(response => response.json())
     .then(data => {
       var training = [];
       var i = 0;

       for (i=0; i<data.results.training.length; i++){
	   var t = data.results.training[i];

	   let m = t.url.match('(http|https)://([^/]+)(/.+)$')
	   if (m){
	       t.url = trainingServer + m[3]
               training.push(t);
	   }
       }
       setTrainingResults(training);
       setTaskResults(data.results.tasks);
       setHowToResults(data.results.howtos);
    })
    .catch(function(error) {
       console.log(error);
    });
  }
    const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerOpen(open);
   };

    return (
	    <div className={classes.root}>

	    <ScrollDialog title={dialogTitle} text={dialogText} open={dialogOpen} handleClose={handleClose}/>
            <div style={{float:"right"}}>
                <IconButton aria-label="configure" onClick={toggleDrawer(true)} component="span">
                    <SettingsIcon />
                </IconButton>
            </div>
	    <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
	       <TextField label={"https://sde.example.com"} onChange={onServerChange} value={serverName} />
               <TextField label={"Feedback token"} onChange={onFeedbackTokenChange} value={feedbackToken} />
	       <TextField label={"API token"} onChange={onApiTokenChange} value={apiToken} />
	       <TextField label={"Training Server"} onChange={onTrainingServerChange} value={trainingServer} />
	    </Drawer>
            <Grid container spacing={3}>

            <Grid item xs={12}>
                <form id="myform" onSubmit = {handleOnSubmit} >
                <TextField
                 fullWidth
                 value={searchText}
                 onChange={onSearchChange}
                 id="input-with-icon-textfield"
                 InputProps={{
                     startAdornment: (
                         <InputAdornment position="start">
                             <Button type="submit">
                             <SearchIcon />
                             </Button>
                         </InputAdornment>
                     ),
                 }}
                />
                </form>
            </Grid>
            </Grid>
                {trainingResults && (
                <List
                 subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                    Videos
                    </ListSubheader>
                 }
                 >
                {trainingResults.map((item) => (
                  <ListItem key={`trainingItem${item.id}`}>
                    <ListItemAvatar>
                        <PlayCircleOutlineIcon />
                    </ListItemAvatar>
                    <ListItemText primary={<a target="_training" href={`${item.url}`}>{item.title}</a>} />
                    { feedbackToken && (
			<HoverRating key={`tr${item.id}`} id={`tr${item.id}`} search={searchText} title={item.title} url={item.url} onRating={onRating}/>
                    )}
                  </ListItem>                
                ))}
                </List>
                )}
                {howToResults && (
                <List
                 subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                    How Tos
                    </ListSubheader>
                 }
                 >
                {howToResults.map((item) => (
                  <ListItem key={`howtoItem${item.id}`} style={{cursor: 'pointer'}}>
                    <ListItemAvatar>
                        <FormatAlignJustifyIcon />
                    </ListItemAvatar>
                    <ListItemText primary={item.title} onClick={() => {setDialogOpen(true); setDialogText(item.text); setDialogTitle(item.title)}} />
                    { feedbackToken && (
			<HoverRating id={`howtoRating${item.id}`} search={searchText} title={item.title} url={item.url} onRating={onRating}/>
                    )}
                  </ListItem>
                ))}
                </List>
                )}
            </div>
    )
}
