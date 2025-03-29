import React from "react";
import PropTypes from "prop-types";
import { ApiTask } from "/imports/definitions/data";

export const Task = ({ task }: { task: ApiTask }) => {
  return <li>{task.text}</li>;
};

Task.propTypes = {
  task: PropTypes.shape({
    text: PropTypes.string.isRequired,
  })
};
