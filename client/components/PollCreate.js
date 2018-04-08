import React from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import styles from './PollCreate.module.css';

const ADD_POLL = gql`
  mutation addPoll($description: String!, $authorId: ID!) {
    addPoll(description: $description, authorId: $authorId) {
      description
    }
  }
`;

class PollCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, { name, value }) {
    this.setState({[name]: value});
  }

  render() {
    const { description } = this.state;

    return (
      <div id={styles.poll_create}>
	<Mutation mutation={ADD_POLL}>
	  {(addPoll, { data }) => (
            <div>
	      <h2>Create a poll</h2>
	      <Form
                size='large'
		onSubmit={(e) => {
		  e.preventDefault();
                  addPoll({
                    variables: {
                      description: this.state.description,
                      authorId:    this.props.userAuthorId,
                    }
                  });
                  this.setState({description: ""});
		}}
	      >
		<Segment stacked>
		  <Form.Input
		    fluid
		    placeholder='description'
		    value={description}
		    name='description'
		    onChange={this.handleChange}
		  />
		  <Button
                    className={styles.create_button}
                    fluid size='large'
                    disabled={this.state.description.length > 0 ? false : true}
                  >
                    Create
                  </Button>
		</Segment>
	      </Form>
	    </div>
         )}
        </Mutation>
      </div>
    )
  }
}

export default PollCreate;
