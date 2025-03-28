import React from "react";
import PropTypes from "prop-types";

export const Task = ({ task }) => {
  return <li>{task.text}</li>;
};

Task.propTypes = {
  task: PropTypes.shape({
    text: PropTypes.string.isRequired,
  })
};
