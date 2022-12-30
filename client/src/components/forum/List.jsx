import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItem from '@material-ui/core/ListItem';
import EditIcon from '@material-ui/icons/Edit';
import List from '@material-ui/core/List';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { formatDateWithTime } from '@utils/date';
import { hasCapability } from '@utils/user';
import users from '@reducers/users';

const styles = () => ({
  languageList: {
    flex: 1,
  },
});

const ForumList = ({ classes, user, posts, history }) => {
  let threads = null;
  console.warn(user);
  if (posts.length > 0) {
    threads = posts.map((item) => (
      <ListItem key={item.id} dense disableGutters divider>
        <ListItemText>
          <div>
            <a href={`/threads/${item.id}`}>{item.summary}</a>
          </div>
          <div>{formatDateWithTime(item.updatedAt)}</div>
        </ListItemText>
        <ListItemSecondaryAction>
          {hasCapability(user.capabilities, ['edit_threads']) && (
            <IconButton aria-label="Edit" component={Link} to={`/threads/${item.id}/edit`}>
              <EditIcon />
            </IconButton>
          )}
          {!hasCapability(user.capabilities, ['edit_threads']) &&
            hasCapability(user.capabilities, ['edit_own_threads']) &&
            user.user.id === item.userId && (
              <IconButton aria-label="Edit" component={Link} to={`/threads/${item.id}/edit`}>
                <EditIcon />
              </IconButton>
            )}
        </ListItemSecondaryAction>
      </ListItem>
    ));
  }

  return (
    <div>
      <Typography variant="h1" className={classes.subtitle}>
        Forum
      </Typography>
      <List dense={false}>{threads}</List>
    </div>
  );
};

ForumList.propTypes = {
  user: PropTypes.shape({}).isRequired,
  posts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(ForumList);
