import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'
import mock from "xhr-mock";
import React from 'react';
import { baseURL } from './config'


describe('FE-tests', () => {
  const fireA = (input) => {
    fireEvent.keyUp(input, {key: 'a', code: 'a'})
  }
  beforeEach(() => {
    render(<App />)
    mock.setup()
    mock.get(`${baseURL}/api/todoItems/`, (req, res) => {
      return res.status(200).body([]);
    });
  })
test('renders the footer text', () => {
  const footerElement = screen.getByText(/clearpoint.digital/i)
  expect(footerElement).toBeInTheDocument()
})

test('should pass a description and is completed into the api', () => {
  global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  }));
  const addButton = screen.getByTestId('addButton')
  fireEvent.click(addButton)
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith( `${baseURL}/api/todoItems/`,{"body": "{\"description\":\"\",\"isCompleted\":false}", "headers": {"Content-type": "application/json"}, "method": "POST"});
})

test('should pass a description and is completed into the api', () => {
    //I would normmaly test something like this given a bit more time to set up some reusable mock functions, i would maybe do snapshot testing as well depending on the situation
    const addButton = screen.getByTestId('addButton')
    fireEvent.click(addButton)
    const setStateMock = jest.fn()
    const useStateMock = (useState) => [useState, setStateMock]
    jest.spyOn(React, 'useState').mockImplementation(useStateMock)
    mock.post(`${baseURL}/api/todoItems/`, (req, res) => {
      expect(JSON.parse(req.body())).toEqual('body')
      return res.status(400).body(JSON.stringify({ text: 'bar' }));
    });
    expect(setStateMock).toHaveBeenCalledWith('bar')
  })

  //TODO would be fairly simliar tests for is completed and the other API calls
 })