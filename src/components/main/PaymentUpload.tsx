import React, { useState, useEffect } from 'react';
import { CreditCard, Upload, CheckCircle, AlertCircle, X, Download, Info } from 'lucide-react';

interface PaymentUploadProps {
  userData: {
    name: string;
    institution: string;
    profileComplete: boolean;
    paymentComplete: boolean;
  };
  paymentFile: File | null;
  updateUserData: (data: any) => void;
  updatePaymentFile: (file: File | null) => void;
}

const PaymentUpload: React.FC<PaymentUploadProps> = ({ 
  userData, 
  paymentFile, 
  updateUserData, 
  updatePaymentFile 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Sync payment completion status with file presence
  useEffect(() => {
    const isComplete = paymentFile !== null;
    if (userData.paymentComplete !== isComplete) {
      updateUserData({ paymentComplete: isComplete });
    }
  }, [paymentFile, userData.paymentComplete, updateUserData]);

  const validateFile = (file: File): string | null => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return 'Ukuran file maksimal 5MB';
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return 'Format file harus PDF, JPG, JPEG, atau PNG';
    }

    return null;
  };

  const processFileUpload = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsUploading(true);
    setUploadMessage('');

    // Simulate upload process with more realistic timing
    setTimeout(() => {
      try {
        updatePaymentFile(file);
        setIsUploading(false);
        setUploadMessage('Bukti pembayaran berhasil diunggah!');
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setUploadMessage('');
        }, 5000);
      } catch (error) {
        setIsUploading(false);
        alert('Terjadi kesalahan saat mengunggah file. Silakan coba lagi.');
      }
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFileUpload(file);
    }
    // Reset input value to allow re-uploading same file
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleRemoveFile = () => {
    if (confirm('Apakah Anda yakin ingin menghapus bukti pembayaran ini?')) {
      updatePaymentFile(null);
      setUploadMessage('File bukti pembayaran telah dihapus');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setUploadMessage('');
      }, 3000);
    }
  };

  const handleDownload = () => {
    if (paymentFile) {
      try {
        const url = URL.createObjectURL(paymentFile);
        const a = document.createElement('a');
        a.href = url;
        a.download = paymentFile.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        alert('Terjadi kesalahan saat mengunduh file');
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Upload Bukti Pembayaran</h1>
        <p className="text-gray-600">Unggah bukti pembayaran biaya bimbingan teknis</p>
      </div>

      {/* Payment Information */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-medium text-blue-800 mb-3">Informasi Pembayaran</h3>
            <div className="space-y-3 text-sm text-blue-700">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p><strong>Bank:</strong> BNI</p>
                  <p><strong>No. Rekening:</strong> 1234567890</p>
                  <p><strong>Atas Nama:</strong> BBPBAT</p>
                </div>
                <div className="space-y-1">
                  <p><strong>Biaya Pelatihan:</strong> Rp 1.500.000</p>
                  <p><strong>Kode Unik:</strong> 001 (tambahkan di akhir)</p>
                  <p><strong>Total Transfer:</strong> <span className="font-semibold">Rp 1.500.001</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Status Message */}
      {uploadMessage && (
        <div className={`rounded-lg p-4 border ${
          uploadMessage.includes('berhasil') 
            ? 'bg-green-50 border-green-200' 
            : uploadMessage.includes('dihapus')
            ? 'bg-orange-50 border-orange-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {uploadMessage.includes('berhasil') ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : uploadMessage.includes('dihapus') ? (
              <AlertCircle className="w-5 h-5 text-orange-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <p className={`font-medium ${
              uploadMessage.includes('berhasil') 
                ? 'text-green-700' 
                : uploadMessage.includes('dihapus')
                ? 'text-orange-700'
                : 'text-red-700'
            }`}>
              {uploadMessage}
            </p>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          Bukti Pembayaran
        </h2>

        {paymentFile ? (
          /* File Uploaded State */
          <div className="border-2 border-green-200 bg-green-50 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-full p-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-green-800 mb-1">File berhasil diunggah</p>
                  <p className="text-sm text-green-700 mb-1">{paymentFile.name}</p>
                  <div className="flex items-center gap-4 text-xs text-green-600">
                    <span>Ukuran: {formatFileSize(paymentFile.size)}</span>
                    <span>Tipe: {paymentFile.type}</span>
                    <span>Diupload: {new Date().toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={handleDownload}
                  className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  title="Unduh file"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={handleRemoveFile}
                  className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Hapus file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Replace File Option */}
            <div className="mt-4 pt-4 border-t border-green-200">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="replace-payment-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="replace-payment-upload"
                className="text-sm text-green-700 hover:text-green-800 cursor-pointer underline"
              >
                Ganti dengan file lain
              </label>
            </div>
          </div>
        ) : (
          /* Upload State */
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <div>
                  <p className="text-blue-600 font-medium">Mengunggah file...</p>
                  <p className="text-sm text-gray-500">Mohon tunggu sebentar</p>
                </div>
              </div>
            ) : (
              <>
                <Upload className={`w-12 h-12 mx-auto mb-4 ${
                  dragActive ? 'text-blue-500' : 'text-gray-400'
                }`} />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {dragActive ? 'Lepaskan file di sini' : 'Upload Bukti Pembayaran'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {dragActive 
                    ? 'Lepaskan file untuk mengunggah' 
                    : 'Klik untuk memilih file atau drag & drop file ke area ini'
                  }
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="payment-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="payment-upload"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 cursor-pointer transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" />
                  Pilih File
                </label>
                <p className="text-xs text-gray-500 mt-3">
                  Format yang didukung: PDF, JPG, JPEG, PNG (Maksimal 5MB)
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Petunjuk Upload</h3>
        <div className="space-y-3 text-sm text-gray-700">
          {[
            'Lakukan transfer sesuai dengan informasi rekening di atas',
            'Pastikan nominal transfer sesuai dengan total yang tertera (termasuk kode unik)',
            'Ambil screenshot atau foto bukti transfer dari aplikasi mobile banking',
            'Upload file bukti pembayaran dengan format PDF, JPG, JPEG, atau PNG',
            'Tunggu konfirmasi dari admin BBPBAT melalui WhatsApp'
          ].map((instruction, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-medium text-xs">{index + 1}</span>
              </div>
              <p>{instruction}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-orange-800 mb-2">Catatan Penting:</h3>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Pastikan bukti pembayaran jelas dan terbaca</li>
              <li>• Pembayaran yang sudah masuk tidak dapat dikembalikan</li>
              <li>• Verifikasi pembayaran akan dilakukan dalam 1-3 hari kerja</li>
              <li>• Hubungi admin jika ada kendala dalam proses pembayaran</li>
              <li>• Simpan bukti pembayaran asli untuk keperluan administrasi</li>
              <li>• File yang diunggah akan tersimpan hingga proses verifikasi selesai</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-800 mb-2">Butuh Bantuan?</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>WhatsApp Admin:</strong> +62 812 3456 7890</p>
          <p><strong>Email:</strong> admin@bbpbat.go.id</p>
          <p><strong>Jam Operasional:</strong> Senin - Jumat, 08:00 - 16:00 WIB</p>
        </div>
      </div>

      {/* Debug Info (Remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Debug Info:</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Payment File: {paymentFile ? paymentFile.name : 'null'}</p>
            <p>Payment Complete: {userData.paymentComplete ? 'true' : 'false'}</p>
            <p>Is Uploading: {isUploading ? 'true' : 'false'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentUpload;