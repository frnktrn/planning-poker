import React from 'react';
import { Container, Divider, Dropdown, Grid, Header, Image, List, Menu } from 'semantic-ui-react';
import styles from './Layout.module.css';

const Layout = (props) => {
  return (
    <div id={styles.layout}>
      <Menu className={styles.menu} fixed='top'>
        <Container>
          <Image src="https://png.icons8.com/metro/50/000000/cards.png" />
          <Menu.Item header className={styles.head_container}>
            Planning Poker
          </Menu.Item>
        </Container>
      </Menu>

      <Container text className={styles.content_container}>
        {props.children({
          userAuthorId: props.userAuthorId,
        })}
      </Container>
    </div>
  )
}

export default Layout;
