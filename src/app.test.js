/*
  Test Requirements from the UI:

  1. For all delete buttons:
     a. Must have this prop: data-testid={`delete-button-${item.name}`}
  2. The add item form must have this prop: data-testid="add-form"
  3. The add item form name field must have this prop: data-testid="add-form-name"
  4. The add item form description field must have this prop: data-testid="add-form-description"
  5. The add item form must have this prop: data-testid="add-form"
  6. The update item form must have this prop: data-testid={`update-form-${item.name}`}
  7. The update item notes must have this prop: data-testid={`update-field-${item.name}`}
*/

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import faker from 'faker';
import {config} from 'dotenv';

import App from './app';

config('../.env');

// ----- MOCK SERVER ------- //

const API_SERVER = process.env.REACT_APP_API;

let items = [];

const server = setupServer(

  rest.get(`*/items`, (req, res, ctx) => {
    return res(ctx.json(items));
  }),

  rest.post(`*/items`, (req, res, ctx) => {
    const item = req.body;
    item._id = Math.random();
    items.push(item);
    return res(ctx.json(item));
  }),

  rest.put(`*/items/:id`, (req, res, ctx) => {
    const item = req.body;
    const id = parseFloat(req.params.id);
    items = items.map( i => i._id === id ? item : i);
    return res(ctx.json(item));
  }),

  rest.delete(`*/items/:id`, (req, res, ctx) => {
    const id = parseFloat(req.params.id);
    items = items.filter( item => item._id !== id );
    return res(null);
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// ----- TESTS ------- //
test('adds an item', async () => {
  render(<App />);

  const form = screen.getByTestId("add-form");
  const name = screen.getByTestId("add-form-name");
  const description = screen.getByTestId("add-form-description");

  const testName = faker.datatype.number();
  const testDescription = faker.company.catchPhrase();

  fireEvent.change(name, { target: { value: testName}});
  fireEvent.change(description, { target: { value: testDescription}});
  fireEvent.submit(form);

  await waitFor( () => {
    const itemsAdded = screen.getAllByText(testName);
    expect(itemsAdded.length).toBeGreaterThan(0);
  });
});



test('deletes an item', async () => {

  render(<App />);

  const form = screen.getByTestId("add-form");
  const name = screen.getByTestId("add-form-name");
  const description = screen.getByTestId("add-form-description");

  const testName = faker.datatype.number();
  const testDescription = faker.company.catchPhrase();

  fireEvent.change(name, { target: { value: testName } });
  fireEvent.change(description, { target: { value: testDescription } });
  fireEvent.submit(form);

  await waitFor( async () => {
    const itemsAdded = screen.getAllByText(testName);
    expect(itemsAdded.length).toBeGreaterThan(0);

    const deleteButton = await screen.findByTestId(`delete-button-${testName}`);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText(testName)).not.toBeInTheDocument();
    });

  });

});

test('updates an item', async () => {
  render(<App />);

  const form = screen.getByTestId("add-form");
  const name = screen.getByTestId("add-form-name");
  const description = screen.getByTestId("add-form-description");

  const testName = faker.datatype.number();
  const newName = faker.datatype.number();
  const testDescription = faker.company.catchPhrase();

  fireEvent.change(name, { target: { value: testName } });
  fireEvent.change(description, { target: { value: testDescription } });
  fireEvent.submit(form);

  await waitFor( async () => {
    const updateForm = screen.queryByTestId(`update-form-${testName}`);
    const updateField = screen.getByTestId(`update-field-${testName}`)
    fireEvent.change(updateField, { target: { value: newName } });
    fireEvent.submit(updateForm);

    await waitFor( async () => {
      expect(screen.getByText(newName)).toBeInTheDocument();
    })
  });
});
