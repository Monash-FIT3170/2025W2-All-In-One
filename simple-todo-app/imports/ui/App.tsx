import React from 'react';
import { Task } from './Task.tsx';

type Task = {
  _id: number;
  text: string;
}

const tasks: Array<Task> = [
  {_id: 1, text: 'First Task'},
  {_id: 2, text: 'Second Task'},
  {_id: 3, text: 'Third Task'},
];

export const App = () => (
  <div>
    <h1>Welcome to Meteor!</h1>
    <ul>
      { tasks.map((task) => <Task key={task._id} task={task} />) }
    </ul>
  </div>
);
