
export default function PdfPreviewHelp({ open, handleClose, pdfUrl }) {

  return (
    <div>
      {open && (
  <div className="modal-overlay">
    <div className="custom-modal container-fluid Topnav-screen">
      <div className="custom-modal-body">

        {/* Header */}
        <div className="shadow-lg p-1 bg-light main-header-box">
          <div className="header-flex">
            <h1 className="custom-modal-title">PDF Preview</h1>

            <div className="action-wrapper">
              <div className="action-icon delete" onClick={handleClose}>
                <span className="tooltip">Close</span>
                <i className="fa-solid fa-xmark"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="shadow-lg p-3 bg-light mt-2 container-form-box">

          <div className="pdf-preview-box">

            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                title="PDF Preview"
                className="pdf-frame"
              />
            ) : (
              <p>No PDF Available</p>
            )}

          </div>

        </div>

      </div>
    </div>
  </div>
)}

    </div>
  );
}
