import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { Redirect } from "react-router-dom";
import styles from './SignIn.module.css';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formSubmitted: false,
      username: "",
    }
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmitForm() {
    window.localStorage.setItem("username", this.state.username);
    this.setState({formSubmitted: true});
  }

  handleChange(e, { name, value }) {
    this.setState({[name]: value});
  }

  render() {
    const { username } = this.state;

    return (
      this.state.formSubmitted
      ? 
        <Redirect to={{
            pathname: '/polls',
            state: { from: this.props.location }
        }} />
      : 
        <div id={styles.signin}>
          <Grid
            textAlign='center'
            style={{ height: '100%' }}
            verticalAlign='middle'
          >
            <Grid.Column className={styles.grid_column}>
              <Header as='h2' className={styles.header} textAlign='center'>
                Sign-in to your account
              </Header>
              <Form size='large' onSubmit={this.handleSubmitForm}>
                <Segment stacked>
                  <Form.Input
                    fluid
                    icon='user'
                    iconPosition='left'
                    placeholder='username'
                    value={username}
                    name='username'
                    onChange={this.handleChange}
                  />
                  <Button
                    className={styles.button}
                    fluid
                    size='large'
                    disabled={this.state.username.length > 0 ? false : true}
                  >
                    Sign-in
                  </Button>
                </Segment>
              </Form>
            </Grid.Column>
          </Grid>
        </div>
    )
  }
}

export default SignIn;
