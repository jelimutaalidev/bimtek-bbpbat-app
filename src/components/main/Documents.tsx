import React, { useState, useEffect } from 'react';
import { FileText, Upload, CheckCircle, AlertCircle, Download, X } from 'lucide-react';

interface DocumentsProps {
  userData: {
    name: string;
    institution: string;
    profileComplete: boolean;
    documentsComplete: boolean;
  };
  uploadedFiles: Record<string, File | null>;
  updateUserData: (data: any) => void;
  updateUploadedFiles: (files: Record<string, File | null>) => void;
}

const Documents: React.FC<DocumentsProps> = ({ userData, uploadedFiles, updateUserData, updateUploadedFiles }) => {
  const [localUploadedFiles, setLocalUploadedFiles] = useState<Record<string, File | null>>(uploadedFiles);

  // Sync dengan global state saat component mount
  useEffect(() => {
    setLocalUploadedFiles(uploadedFiles);
  }, [uploadedFiles]);

  const requiredDocuments = [
    {
      id: 'ktp',
      name: 'KTP',
      description: 'Kartu Tanda Penduduk yang masih berlaku',
      required: true,
      accept: '.pdf,.jpg,.jpeg,.png'
    },
    {
      id: 'ktm',
      name: 'KTM/KTS',
      description: 'Kartu Tanda Mahasiswa atau Kartu Tanda Siswa',
      required: true,
      accept: '.pdf,.jpg,.jpeg,.png'
    },
    {
      id: 'kk',
      name: 'Kartu Keluarga',
      description: 'Kartu Keluarga terbaru',
      required: true,
      accept: '.pdf,.jpg,.jpeg,.png'
    },
    {
      id: 'photo',
      name: 'Pas Photo',
      description: 'Foto formal ukuran 3x4 atau 4x6',
      required: true,
      accept: '.jpg,.jpeg,.png'
    },
    {
      id: 'proposal',
      name: 'Proposal',
      description: 'Proposal kegiatan PKL/magang',
      required: true,
      accept: '.pdf,.doc,.docx'
    },
    {
      id: 'nilai',
      name: 'Format Nilai Sekolah/Universitas',
      description: 'Transkrip nilai atau rapor terbaru',
      required: true,
      accept: '.pdf,.jpg,.jpeg,.png'
    },
    {
      id: 'sertifikat',
      name: 'Format Sertifikat',
      description: 'Template sertifikat dari institusi (jika ada)',
      required: false,
      accept: '.pdf,.doc,.docx'
    },
    {
      id: 'pernyataan',
      name: 'Surat Pernyataan Pertanggungjawaban',
      description: 'Surat pernyataan bermaterai',
      required: true,
      accept: '.pdf,.jpg,.jpeg,.png'
    }
  ];

  const handleFileUpload = (documentId: string, file: File) => {
    const newFiles = {
      ...localUploadedFiles,
      [documentId]: file
    };
    
    setLocalUploadedFiles(newFiles);
    updateUploadedFiles(newFiles);
    
    // Check if documents are complete
    checkDocumentsCompletion(newFiles);
  };

  const handleFileRemove = (documentId: string) => {
    const newFiles = {
      ...localUploadedFiles,
      [documentId]: null
    };
    
    setLocalUploadedFiles(newFiles);
    updateUploadedFiles(newFiles);
    
    // Check if documents are complete
    checkDocumentsCompletion(newFiles);
  };

  const checkDocumentsCompletion = (files: Record<string, File | null>) => {
    const requiredDocs = requiredDocuments.filter(doc => doc.required);
    const uploadedRequiredDocs = requiredDocs.filter(doc => files[doc.id]);
    
    const isComplete = uploadedRequiredDocs.length === requiredDocs.length;
    updateUserData({ documentsComplete: isComplete });
  };

  const getDocumentStatus = (documentId: string) => {
    const file = localUploadedFiles[documentId];
    if (file) {
      return 'uploaded';
    }
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded':
        return 'bg-green-50 border-green-200';
      case 'pending':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const requiredDocsCount = requiredDocuments.filter(doc => doc.required).length;
  const uploadedRequiredCount = requiredDocuments
    .filter(doc => doc.required && localUploadedFiles[doc.id])
    .length;

  const FileUploadComponent = ({ document }: { document: any }) => {
    const file = localUploadedFiles[document.id];
    const status = getDocumentStatus(document.id);

    return (
      <div className={`border-2 border-dashed rounded-lg p-6 transition-colors ${getStatusColor(status)}`}>
        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-600">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // Simulate download
                  const url = URL.createObjectURL(file);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = file.name;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="text-blue-600 hover:text-blue-700 p-1"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFileRemove(document.id)}
                className="text-red-600 hover:text-red-700 p-1"
                title="Hapus"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-2">
              Klik untuk mengunggah atau drag & drop
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Format yang didukung: {document.accept.replace(/\./g, '').toUpperCase()}
            </p>
            <input
              type="file"
              accept={document.accept}
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  handleFileUpload(document.id, selectedFile);
                }
              }}
              className="hidden"
              id={`upload-${document.id}`}
            />
            <label
              htmlFor={`upload-${document.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Pilih File
            </label>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Berkas Dokumen</h1>
        <p className="text-gray-600">Upload dan kelola dokumen yang diperlukan</p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Progress Upload</h2>
          <span className="text-sm font-medium text-gray-600">
            {uploadedRequiredCount}/{requiredDocsCount} Dokumen Wajib
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(uploadedRequiredCount / requiredDocsCount) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {uploadedRequiredCount === requiredDocsCount
            ? 'Semua dokumen wajib telah diunggah!'
            : `${requiredDocsCount - uploadedRequiredCount} dokumen wajib lagi untuk melengkapi berkas`
          }
        </p>
      </div>

      {/* Documents Grid */}
      <div className="grid gap-6">
        {requiredDocuments.map((document) => {
          const status = getDocumentStatus(document.id);
          
          return (
            <div key={document.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  {getStatusIcon(status)}
                  <div>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      {document.name}
                      {document.required && (
                        <span className="text-red-500 text-sm">*</span>
                      )}
                      {!document.required && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Opsional
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">{document.description}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  status === 'uploaded' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {status === 'uploaded' ? 'Terupload' : 'Belum Upload'}
                </span>
              </div>
              
              <FileUploadComponent document={document} />
            </div>
          );
        })}
      </div>

      {/* Information */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Informasi Penting:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Pastikan semua dokumen yang diunggah jelas dan terbaca</li>
          <li>• Ukuran maksimal file adalah 5MB per dokumen</li>
          <li>• Dokumen yang bertanda (*) wajib diunggah untuk mengakses fitur lainnya</li>
          <li>• File yang sudah diunggah dapat diunduh kembali kapan saja</li>
          <li>• Hubungi admin jika mengalami kesulitan dalam upload dokumen</li>
        </ul>
      </div>
    </div>
  );
};

export default Documents;