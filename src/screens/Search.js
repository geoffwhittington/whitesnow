import React, {useEffect, useState} from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import SearchIcon from '@material-ui/icons/Search';
import Link from '@material-ui/icons/Link';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import ScrollDialog from "./dialog";

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

  const [searchText, setSearchText] = useState("");
  const [feedbackToken, setFeedbackToken] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [serverName, setServerName] = useState("");
  const [trainingResults, setTrainingResults] = useState([]);
  const [taskResults, setTaskResults] = useState([]);
  const [howToResults, setHowToResults] = useState([]);
  const [dialogText, setDialogText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");

  const handleOnSubmit = (e) => {
      setSearchText(searchText.trim())
      e.preventDefault();
      if(searchText)
         searchContent();
  }

  const onServerChange = (e) => {
      setServerName(e.target.value);
  }

  const onSearchChange = (e) => {
      setSearchText(e.target.value)
  }

  const onApiTokenChange = (e) => {
      setApiToken(e.target.value);
  }

  const onFeedbackTokenChange = (e) => {
      setFeedbackToken(e.target.value);
  }

  function saveThumb(feedback, search, title, link) {
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
  const ThumbUp = ((props) => {
      return (
          <IconButton 
          onClick={() => {
              saveThumb('up', props.search, props.title, props.url)
          }}>
          <ThumbUpIcon/>
          </IconButton>
      )
  });

  const ThumbDown = ((props) => {
      return (
          <IconButton
          onClick={() => {
               saveThumb('down', props.search, props.title, props.url)
          }}>
          <ThumbDownIcon/>
          </IconButton>
      )
  });

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
       setTrainingResults(data.results.training);
       setTaskResults(data.results.tasks);
       setHowToResults(data.results.howtos);
    })
    .catch(function(error) {
       console.log(error);
    });
  }
    return (
	    <div className={classes.root}>
	    <ScrollDialog title={dialogTitle} text={dialogText} open={dialogOpen} handleClose={handleClose}/>
            <Grid container spacing={3}>
            <Grid item xs={12}>
                <TextField label={"https://sde.example.com"} onChange={onServerChange} value={serverName} />
                <TextField label={"Feedback token"} onChange={onFeedbackTokenChange} value={feedbackToken} />
                <TextField label={"API token"} onChange={onApiTokenChange} value={apiToken} />
            </Grid>

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
                  <ListItem>
                    <ListItemAvatar>
                        <PlayCircleOutlineIcon />
                    </ListItemAvatar>
                    <ListItemText primary={<a href={`${item.url}`}>{item.title}</a>} />
                    { feedbackToken && (
                        <>
                        <ThumbUp search={searchText} title={item.title} url={item.url}/>
                        <ThumbDown search={searchText} title={item.title} url={item.url}/>
                        </>
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
                  <ListItem style={{cursor: 'pointer'}} onClick={() => {setDialogOpen(true); setDialogText(item.text); setDialogTitle(item.title)}}>
                    <ListItemAvatar>
                        <FormatAlignJustifyIcon />
                    </ListItemAvatar>
                    <ListItemText primary={item.title}/>
                    { feedbackToken && (
                        <>
                        <ThumbUp search={searchText} title={item.title} url={item.url}/>
                        <ThumbDown search={searchText} title={item.title} url={item.url}/>
                        </>
                    )}
                  </ListItem>
                ))}
                </List>
                )}
            </div>
    )
}
