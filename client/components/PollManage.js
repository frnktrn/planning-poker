import React from 'react';
import { Divider } from 'semantic-ui-react';

import PollCreate from './PollCreate';
import PollList from './PollList';

const PollManage = (props) => {
  const { userAuthorId } = props;

  return (
    <div>
      <PollCreate userAuthorId={userAuthorId}/>
      <Divider />
      <PollList userAuthorId={userAuthorId}/>
    </div>
  )
}

export default PollManage;
