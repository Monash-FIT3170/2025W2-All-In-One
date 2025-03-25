import React from 'react';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { db } from '../api/links';
import { Task } from './Task';
export const Info = () => {
  const isLoading = useSubscribe('task');
  const task = useTracker(() => db.find({}).fetch());
  if(isLoading()) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Learn Meteor!</h2>
      <ul>{task.map((task) => (
        <Task key={task._id} task ={task}/> ))}</ul>
    </div>
  );
};
