import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { QRCodeSVG } from 'qrcode.react';
import {
  XMarkIcon,
  ClipboardDocumentIcon,
  QrCodeIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

const ShareModal = ({ isOpen, onClose, url }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('qrcode'); // 'link' or 'qrcode'
  const modalRef = useRef(null);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQRCode = () => {
    if (!qrCodeRef.current) return;

    // Create a canvas element
    const canvas = document.createElement('canvas');
    const svgElement = qrCodeRef.current.querySelector('svg');
    const { width, height } = svgElement.getBoundingClientRect();

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Create a data URL from the SVG
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const DOMURL = window.URL || window.webkitURL || window;
    const img = new Image();
    const svgUrl = DOMURL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      DOMURL.revokeObjectURL(svgUrl);

      // Convert canvas to PNG and download
      const imgURI = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = imgURI;
      a.download = 'qrcode.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    img.src = svgUrl;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">Share this page</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b">
          <button
            className={`flex-1 py-3 flex justify-center items-center gap-2 
              ${activeTab === 'link' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('link')}
          >
            <ClipboardDocumentIcon className="h-5 w-5" />
            <span>Copy Link</span>
          </button>
          <button
            className={`flex-1 py-3 flex justify-center items-center gap-2 
              ${activeTab === 'qrcode' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('qrcode')}
          >
            <QrCodeIcon className="h-5 w-5" />
            <span>QR Code</span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'link' && (
            <div>
              <div className="flex items-center mb-4">
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none text-sm bg-gray-50"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-r-md ${copied ? 'bg-green-600' : 'bg-blue-600'} text-white`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-sm text-gray-500">Copy the link to share this page directly.</p>
            </div>
          )}

          {activeTab === 'qrcode' && (
            <div className="flex flex-col items-center">
              <div ref={qrCodeRef} className="mb-4 p-4 bg-white rounded-lg border">
                <QRCodeSVG
                  value={url}
                  size={200}
                  bgColor={'#ffffff'}
                  fgColor={'#000000'}
                  level={'H'}
                  includeMargin={true}
                />
              </div>

              <button
                onClick={downloadQRCode}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Download QR Code</span>
              </button>

              <p className="text-sm text-gray-500 text-center mt-4">
                Scan this QR code with a mobile device to visit this page.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ShareModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};

export default ShareModal;
