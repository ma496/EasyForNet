import { useAppDispatch } from '@/store/hooks';
import { useAppSelector } from '@/store/hooks';
import { clearError } from '@/store/slices/errorSlice';
import Modal from '../ui/modal';


export function ShowError() {
  const isError = useAppSelector(s => s.error.isError)
  const errorMessage = useAppSelector(s => s.error.message)
  const errorTitle = useAppSelector(s => s.error.title)
  const dispatch = useAppDispatch()

  return (
    <div className="mb-5">
      <Modal isOpen={isError} onClose={() => dispatch(clearError())}>
        <Modal.Header>
          <pre>
            <span className="text-red-500">{errorTitle}</span>
          </pre>
        </Modal.Header>
        <pre>
          <p className="text-red-400 mt-2 text-wrap">{errorMessage}</p>
        </pre>
      </Modal>
    </div>
  )
}
