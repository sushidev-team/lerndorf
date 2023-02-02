import { withRouter, Link } from 'react-router-dom';
import { Component, useState } from 'react';
import PropTypes from 'prop-types';
import { hasCapability } from '@utils/user';
import Show from '@components/forum/Show';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItem from '@material-ui/core/ListItem';
import EditIcon from '@material-ui/icons/Edit';
import List from '@material-ui/core/List';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { PlayArrow, Assignment, Add, HourglassEmptySharp } from '@material-ui/icons/index';
import { Grid } from '@material-ui/core/index';
import DeleteCourse from '@components/courses/DeleteCourse';
import AddCourseToCourselist from '@components/courses/AddCourseToCourselist';

const styles = () => ({
  languageList: {
    flex: 1,
  },
});

class CourseList extends Component {
  componentDidMount() {
    const { actions, match } = this.props;
    this.fetchData();
  }

  componentDidUpdate() {
    const { actions, match } = this.props;
  }

  fetchData() {
    const { actions, history } = this.props;
    actions.coursesFetchAll();
    actions.courseListsFetch().catch((err) => {
      if (err.cause === 403) {
        history.push('/errors/403');
      } else if (err.cause === 401) {
        history.push('/errors/401');
      }
    });
  }

  render() {
    const { user, courselists, courses, actions } = this.props;

    let courseItems = [];
    if (courselists.items?.length > 0) {
      courseItems = courselists.items.map((row) => (
        <TableRow
          key={`list-row-${row.id}`}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            <Link to={`/courses/lists/${row.id}`}>
              {row.shortTitle && row.shortTitle.length > 0 ? row.shortTitle : row.title}
            </Link>
          </TableCell>
          <TableCell align="right">
            {row?.playButtonState?.state === 'active' && (
              <IconButton
                aria-label="Start"
                onClick={() => {
                  // eslint-disable-next-line
                  alert('TBD: Unknown behavior');
                }}
              >
                <PlayArrow />
              </IconButton>
            )}
            {row?.playButtonState?.state === 'inactive' && (
              <IconButton aria-label="Start" title={row?.playButtonState?.msg}>
                <HourglassEmptySharp />
              </IconButton>
            )}
            {hasCapability(user.capabilities, ['manage_course_lists']) &&
              row.currentUserIsTrainerOrTutor === true && (
                <IconButton aria-label="Edit" component={Link} to={`/courses/lists/${row.id}/edit`}>
                  <EditIcon />
                </IconButton>
              )}
            {(hasCapability(user.roles, ['admin']) ||
              (hasCapability(user.capabilities, ['manage_course_lists']) &&
                user.user.id === row.trainerId)) && (
              <AddCourseToCourselist
                user={user.user}
                actions={actions}
                courses={courses}
                initialValues={row}
                itemId={row.id}
                itemName={row.title}
                itemList={row.items.map((ele) => ele.courseId)}
                handleSubmit={(details) => {
                  actions
                    .courseListUpdate(row.id, {
                      title: details.title,
                      list: details.list,
                    })
                    .them((result) => {
                      this.fetchData();
                    });
                }}
              />
            )}
          </TableCell>
        </TableRow>
      ));
    }

    return (
      <>
        <Typography variant="h1">All course lists</Typography>
        <TableContainer>
          <Table aria-label="My courses">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Title</strong>
                </TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>{courseItems}</TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2}>
          <Grid item xs={12} spacing={2} align="right">
            {hasCapability(user.capabilities, ['manage_course_lists']) && (
              <AddCourseToCourselist
                user={user.user}
                actions={actions}
                courses={courses}
                initialValues={{ title: '' }}
                itemName=""
                handleSubmit={(details) => {
                  actions.courseListAdd(details).then(() => {
                    this.fetchData();
                  });
                }}
              />
            )}
          </Grid>
        </Grid>
      </>
    );
  }
}

CourseList.propTypes = {
  actions: PropTypes.shape({
    coursesFetchMy: PropTypes.func.isRequired,
    coursesFetchMyPossible: PropTypes.func.isRequired,
  }).isRequired,
  user: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const CourseListWithRouter = withRouter(CourseList);

export default CourseListWithRouter;
