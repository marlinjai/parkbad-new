import React, { useEffect } from 'react'
import Datenschutzerklaerung from 'customerData/Datenschutzerklaerung'
import Impressum from 'customerData/Impressum'
import Hausordnung from 'customerData/Hausordnung'

interface ModalProps {
  id: string
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ id, onClose }) => {
  // Function to prevent propagation of click events from the modal content
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  useEffect(() => {
    document.body.classList.add('disable-scrolling')
    document.documentElement.classList.add('disable-scrolling')

    return () => {
      document.body.classList.remove('disable-scrolling')
      document.documentElement.classList.remove('disable-scrolling')
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black opacity-70"></div>
      <div
        className="hide-scrollbar relative mx-4 -mb-pz15 w-vw80 overflow-y-auto rounded-3xl bg-brand-accent-2 p-pz5 shadow-lg md:w-vw60"
        style={{ maxHeight: '80vh' }} // limit height to 80% of the view height
        onClick={stopPropagation}
      >
        {/* Modal content */}
        <h3 className="mb-pz5 text-center text-4xl font-semibold text-brand-colour-light">
          {id === 'modal-2-0'
            ? `Impressum`
            : id === 'modal-2-1'
            ? `datenschutzerklärung`
            : `Hausordnung`}
        </h3>
        <div className="text-brand-colour-light">
          {id === 'modal-2-0' ? (
            <Impressum></Impressum>
          ) : id === 'modal-2-1' ? (
            <Datenschutzerklaerung />
          ) : (
            <Hausordnung></Hausordnung>
          )}
        </div>
        <button
          className="hover:bg-brand-ccent-2 mt-4 rounded-lg bg-brand-colour-dark px-4 py-2 text-white"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default Modal
