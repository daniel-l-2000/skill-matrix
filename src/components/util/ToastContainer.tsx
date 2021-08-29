import { useSelector } from 'react-redux';
import { RootState } from '../../store/redux';
import Toast from './Toast';

function ToastContainer() {
  const toasts = useSelector((state: RootState) => state.toasts.toasts);

  return (
    <div className="toast-container position-fixed before-backdrop start-0 bottom-0 p-3">
      {toasts.map((t) => (
        <Toast
          key={+t.timestamp}
          title={t.title}
          icon={t.icon}
          description={t.description}
          timestamp={t.timestamp}
        />
      ))}
    </div>
  );
}

export default ToastContainer;
