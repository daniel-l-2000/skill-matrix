import { useDispatch } from 'react-redux';
import { IconType, ShowToastAction, toastActions } from '../store/redux';

function useToasts() {
  const dispatch = useDispatch();

  return (title: string, icon: IconType, description?: string) => {
    const toast: ShowToastAction = { title, icon, description };
    dispatch(toastActions.showToast(toast));
    setTimeout(() => {
      dispatch(toastActions.popToast());
    }, 3000);
  };
}

export default useToasts;
