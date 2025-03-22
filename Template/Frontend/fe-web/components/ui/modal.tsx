import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, ReactNode, Children, isValidElement, createContext, useContext } from 'react';

type ModalSize = 'sm' | 'lg' | 'xl';

interface BaseProps {
  children: ReactNode;
  className?: string;
}

interface ModalProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
}

interface ModalHeaderProps extends BaseProps {
  showCloseButton?: boolean;
}

interface ModalFooterProps extends BaseProps { }

// Create context for modal
const ModalContext = createContext<{ onClose: () => void } | null>(null);

const ModalHeader = ({ children, className = '', showCloseButton = true }: ModalHeaderProps) => {
  const context = useContext(ModalContext);

  return (
    <div className={`flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3 ${className}`}>
      <div className="font-bold text-lg">{children}</div>
      {showCloseButton && context?.onClose && (
        <button
          onClick={context.onClose}
          type="button"
          className="text-white-dark hover:text-dark transition-colors duration-200 ltr:ml-auto rtl:mr-auto"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  );
};

const ModalFooter = ({ children, className = '' }: ModalFooterProps) => {
  return (
    <div className={`flex items-center justify-end px-5 py-3 gap-2 ${className}`}>
      {children}
    </div>
  );
};

const Modal = ({ isOpen, onClose, children, size = 'lg', className = '' }: ModalProps) => {
  const maxWidthClass = {
    sm: 'max-w-sm',
    lg: 'max-w-xl',
    xl: 'max-w-5xl',
  }[size];

  // Group children by type (header, content, footer)
  const { header, footer, content } = Children.toArray(children).reduce(
    (acc, child) => {
      if (isValidElement(child)) {
        if (child.type === ModalHeader) {
          return { ...acc, header: child };
        }
        if (child.type === ModalFooter) {
          return { ...acc, footer: child };
        }
      }
      return { ...acc, content: [...acc.content, child] };
    },
    { header: null, footer: null, content: [] } as {
      header: ReactNode;
      footer: ReactNode;
      content: ReactNode[];
    }
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" open={isOpen} onClose={onClose}>
        <div className="fixed inset-0 z-[998] overflow-y-auto">
          {/* Overlay */}
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
          </TransitionChild>

          {/* Modal */}
          <div className="flex min-h-screen items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                className={`w-full ${maxWidthClass} panel border-0 p-0 rounded-lg overflow-hidden my-8 text-black dark:text-white-dark bg-white dark:bg-gray-800 shadow-xl ${className}`}
              >
                <ModalContext.Provider value={{ onClose }}>
                  {header}
                  {content.length > 0 && (
                    <div className="p-5 dark:text-white-dark/70 text-base font-medium text-[#1f2937] ltr:text-left rtl:text-right">
                      {content}
                    </div>
                  )}
                  {footer}
                </ModalContext.Provider>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

// Compound components
Modal.Header = ModalHeader;
Modal.Footer = ModalFooter;

export type { ModalProps, ModalHeaderProps, ModalFooterProps, ModalSize };
export default Modal;
