import './App.css'
import {Image, Alert, Button, Container, Row, Col, Form, Table, Stack} from 'react-bootstrap'
import React, {useState, useEffect} from 'react'
import { baseURL } from './config'

const axios = require('axios')

const App = () => {
    const [description, setDescription] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [items, setItems] = useState([])

    useEffect(() => {
        getItems()
    }, [])

    const renderAddTodoItemContent = () => {
        return (
            <Container>
                <h1>Add Item</h1>
                <Form.Group as={Row} className="mb-3" controlId="formAddTodoItem">
                    <Form.Label column sm="2">
                        Description
                    </Form.Label>
                    <Col md="6">
                        <Form.Control
                            type="text"
                            placeholder="Enter description..."
                            value={description}
                            onChange={(event) => {setDescription(event.target.value)}}
                        />
                    </Col>
                    <Form.Label className="warning">
                        {errorMessage}
                    </Form.Label>
                </Form.Group>
                <Form.Group as={Row} className="mb-3 offset-md-2" controlId="formAddTodoItem">
                    <Stack direction="horizontal" gap={2}>
                        <Button variant="primary" data-testid='addButton' onClick={() => handleAdd()}>
                            Add Item
                        </Button>
                        <Button variant="secondary" onClick={() => handleClear()}>
                            Clear
                        </Button>
                    </Stack>
                </Form.Group>
            </Container>
        )
    }

    const renderTodoItemsContent = () => {
        return (
            <>
                <h1>
                    Showing {items.length} Item(s){' '}
                    <Button variant="primary" className="pull-right" onClick={() => getItems()}>
                        Refresh
                    </Button>
                </h1>

                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.description}</td>
                            {!item.isCompleted &&
                            <td>
                                <Button variant="warning" size="sm" onClick={() => handleMarkAsComplete(item, true)}>
                                    Mark as completed
                                </Button>
                            </td>
                            }
                            {item.isCompleted &&
                            <td>
                                <Button variant="info" size="sm" onClick={() => handleMarkAsComplete(item, false)}>
                                    Mark as incomplete
                                </Button>
                            </td>
                            }
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </>
        )
    }

    async function getItems() {
        try {
            let res = await fetch(`${baseURL}/api/todoItems/`, {
                method: "GET"
            });
            if(res.ok) {
                let json = await res.json();
                setItems(json)
            }else{
                setErrorMessage(await res.text())
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function handleAdd() {
        try {
            let res = await fetch(`${baseURL}/api/todoItems/`, {
                method: "POST",
                headers:{
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(
            {
                description,
                isCompleted: false,
            }
                ),
             });
            if(res.ok) {
                handleClear()
                await getItems()
            }else{
                setErrorMessage(await res.text())
            }
        } catch (error) {
            console.error(error)
        }
    }

    function handleClear() {
        setDescription('')
        setErrorMessage('')
    }

    async function handleMarkAsComplete(item, isCompleted) {
        try {
            let res = await fetch(`${baseURL}/api/todoItems/${item.id}`, {
                method: "PUT",
                headers:{
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        description: item.description,
                        isCompleted: isCompleted,
                    }
                ),
            });
            if(res.ok) {
                handleClear()
                await getItems()
            }else{
                setErrorMessage(await res.text())
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="App">
            <Container>
                <Row>
                    <Col>
                        <Image src="clearPointLogo.png" fluid rounded/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Alert variant="success">
                            <Alert.Heading>Todo List App</Alert.Heading>
                            Welcome to the ClearPoint frontend technical test. We like to keep things simple, yet clean
                            so your
                            task(s) are as follows:
                            <br/>
                            <br/>
                            <ol className="list-left">
                                <li>Add the ability to add (POST) a Todo Item by calling the backend API</li>
                                <li>
                                    Display (GET) all the current Todo Items in the below grid and display them in any
                                    order you wish
                                </li>
                                <li>
                                    Bonus points for completing the 'Mark as completed' button code for allowing users
                                    to update and mark
                                    a specific Todo Item as completed and for displaying any relevant validation errors/
                                    messages from the
                                    API in the UI
                                </li>
                                <li>Feel free to add unit tests and refactor the component(s) as best you see fit</li>
                            </ol>
                        </Alert>
                    </Col>
                </Row>
                <Row>
                    <Col>{renderAddTodoItemContent()}</Col>
                </Row>
                <br/>
                <Row>
                    <Col>{renderTodoItemsContent()}</Col>
                </Row>
            </Container>
            <footer className="page-footer font-small teal pt-4">
                <div className="footer-copyright text-center py-3">
                    © 2021 Copyright:
                    <a href="https://clearpoint.digital" target="_blank" rel="noreferrer">
                        clearpoint.digital
                    </a>
                </div>
            </footer>
        </div>
    )
}

export default App