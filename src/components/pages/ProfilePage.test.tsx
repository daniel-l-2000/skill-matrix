import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import store from '../../store/redux';
import ProfilePage from './ProfilePage';

jest.mock('firebase/auth', () => ({
  getAuth: () => ({ currentUser: { uid: 'QIuSXFa7lgMiWGd7rVCxXpK8FKa2' } }),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  collection: jest.fn(),
  addDoc: () => Promise.resolve({ id: '123' }),
  setDoc: () => Promise.resolve(),
  getDoc: () =>
    Promise.resolve({
      data: () => ({ name: 'Daniel' }),
      id: '123',
    }),
  updateDoc: () => Promise.resolve(),
  deleteDoc: () => Promise.resolve(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  getDownloadURL: () => Promise.resolve(''),
}));

describe('ProfilePage component', () => {
  let component: JSX.Element;

  beforeEach(() => {
    component = (
      <MemoryRouter
        initialEntries={[
          '/profiles/QIuSXFa7lgMiWGd7rVCxXpK8FKa2?allow-edit=true',
        ]}
      >
        <Provider store={store}>
          <Route path="/profiles/:userId">
            <ProfilePage></ProfilePage>
          </Route>
        </Provider>
      </MemoryRouter>
    );
  });

  test('renders Name label', async () => {
    render(component);

    const nameLabel = await screen.findByText('Name');
    expect(nameLabel).toBeInTheDocument();
  });

  test('renders toast after Save button was clicked', async () => {
    render(component);

    const saveBtn = await screen.findByText('Save');
    userEvent.click(saveBtn);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(store.getState().toasts.toasts).toHaveLength(1);
  });

  test('renders a file input with placeholder "Profile Picture"', async () => {
    render(component);

    const profilePicInput = await screen.findByPlaceholderText(
      'Profile Picture'
    );
    expect(profilePicInput).toBeInTheDocument();
  });
});
