import { useDispatch } from 'react-redux';
import { IconType, ShowToastData, toastActions } from '../store/redux-store';

function useToasts() {
  const dispatch = useDispatch();

  return (title: string, icon: IconType, description?: string) => {
    const toast: ShowToastData = { title, icon, description };
    dispatch(toastActions.showToast(toast));
    setTimeout(() => {
      dispatch(toastActions.popToast());
    }, 3000);
  };
}

export default useToasts;
