import React from 'react';
import { Hello } from './Hello.jsx';
import { Info } from './Info.jsx';
import { TaskForm } from './TaskForm.jsx';
export const App = () => {

  return (
  <div>
    <h1>Welcome to Meteor!</h1>
    <Hello/>
    <TaskForm/>
    <Info/>
  </div>);
};
