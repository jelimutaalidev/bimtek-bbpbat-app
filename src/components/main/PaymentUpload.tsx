import React, { useState } from 'react';
import { CreditCard, Upload, CheckCircle, AlertCircle, X, Download, Info } from 'lucide-react';

interface PaymentUploadProps {
  userData: {
    name: string;
    institution: string;
    profileComplete: boolean;
    paymentComplete: boolean;
  };
  updateUserData: (data: any) => void;
}

const PaymentUpload: React.FC<PaymentUploadProps> = ({ userData, updateUserData }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Format file harus PDF, JPG, atau PNG');
        return;
      }

      setIsUploading(true);
      setUploadMessage('');

      // Simulate upload process
      setTimeout(() => {
        setUploadedFile(file);
        setIsUploading(false);
        setUploadMessage('Bukti pembayaran berhasil diunggah!');
        
        // Update payment completion status
        updateUserData({ paymentComplete: true });

        // Clear success message after 3 seconds
        setTimeout(() => {
          setUploadMessage('');
        }, 3000);
      }, 2000);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadMessage('');
    updateUserData({ paymentComplete: false });
  };

  const handleDownload = () => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = uploadedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
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
          <Info className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800 mb-3">Informasi Pembayaran</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Bank:</strong> BNI</p>
                  <p><strong>No. Rekening:</strong> 1234567890</p>
                  <p><strong>Atas Nama:</strong> BBPBAT</p>
                </div>
                <div>
                  <p><strong>Biaya Pelatihan:</strong> Rp 1.500.000</p>
                  <p><strong>Kode Unik:</strong> 001 (tambahkan di akhir)</p>
                  <p><strong>Total Transfer:</strong> Rp 1.500.001</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {uploadMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700 font-medium">{uploadMessage}</p>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          Bukti Pembayaran
        </h2>

        {uploadedFile ? (
          /* File Uploaded State */
          <div className="border-2 border-green-200 bg-green-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">File berhasil diunggah</p>
                  <p className="text-sm text-green-700">{uploadedFile.name}</p>
                  <p className="text-xs text-green-600">
                    Ukuran: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
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
          </div>
        ) : (
          /* Upload State */
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
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
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Upload Bukti Pembayaran
                </h3>
                <p className="text-gray-600 mb-4">
                  Klik untuk memilih file atau drag & drop file ke area ini
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="payment-upload"
                />
                <label
                  htmlFor="payment-upload"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 cursor-pointer transition-colors inline-flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Pilih File
                </label>
                <p className="text-xs text-gray-500 mt-3">
                  Format yang didukung: PDF, JPG, PNG (Maksimal 5MB)
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
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 font-medium text-xs">1</span>
            </div>
            <p>Lakukan transfer sesuai dengan informasi rekening di atas</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 font-medium text-xs">2</span>
            </div>
            <p>Pastikan nominal transfer sesuai dengan total yang tertera (termasuk kode unik)</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 font-medium text-xs">3</span>
            </div>
            <p>Ambil screenshot atau foto bukti transfer dari aplikasi mobile banking</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 font-medium text-xs">4</span>
            </div>
            <p>Upload file bukti pembayaran dengan format PDF, JPG, atau PNG</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 font-medium text-xs">5</span>
            </div>
            <p>Tunggu konfirmasi dari admin BBPBAT melalui WhatsApp</p>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-orange-800 mb-2">Catatan Penting:</h3>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Pastikan bukti pembayaran jelas dan terbaca</li>
              <li>• Pembayaran yang sudah masuk tidak dapat dikembalikan</li>
              <li>• Verifikasi pembayaran akan dilakukan dalam 1-3 hari kerja</li>
              <li>• Hubungi admin jika ada kendala dalam proses pembayaran</li>
              <li>• Simpan bukti pembayaran asli untuk keperluan administrasi</li>
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
    </div>
  );
};

export default PaymentUpload;