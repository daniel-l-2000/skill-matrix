import { useContext } from 'react';
import ReactDOM from 'react-dom';
import LoadingContext from '../../store/context/loading-context';
import LoadingSpinner from '../util/LoadingSpinner';
import ToastContainer from '../util/ToastContainer';
import MainNavigation from './MainNavigation';
import useAuth from '../../hooks/use-auth';
import Backdrop from '../util/Backdrop';

function Layout(props: { children: any }) {
  const loadingContext = useContext(LoadingContext);

  const auth = useAuth();

  return (
    <>
      {auth.isSignedIn && <MainNavigation />}
      <main className="p-2">{props.children}</main>
      {loadingContext.isLoading &&
        ReactDOM.createPortal(
          <LoadingSpinner />,
          document.getElementById('lds-root') as Element
        )}
      {ReactDOM.createPortal(
        <ToastContainer />,
        document.getElementById('toasts-root') as Element
      )}
      <Backdrop />
    </>
  );
}

export default Layout;
