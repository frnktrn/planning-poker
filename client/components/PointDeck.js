import React from 'react';
import { Card, Grid, Label } from 'semantic-ui-react';
import styles from './PointDeck.module.css';


const PointDeck = (props) => {
  const decks = props.pointData.map((item) => {
    const hasVoted = item.votes.filter(vote => vote.authorId === props.userAuthorId).length > 0;
    return (
      <Grid.Column key={item.id} verticalAlign="middle" width={2}>
        <Card
          className={(hasVoted ? styles.vote_casted : "")}
          onClick={(hasVoted ? null : () => {
            props.onVote(item.id);
          })}
          raised={true}
          style={{height: "80px", paddingTop: "12px"}}
        >
          <Card.Content textAlign='center'>{item.title}</Card.Content>
        </Card>
        <Label>Votes: {item.votes.length}</Label>
      </Grid.Column>
    )
  })
  return (
    <Grid centered={true}>
      {decks}
    </Grid>
  )
}

export default PointDeck;
