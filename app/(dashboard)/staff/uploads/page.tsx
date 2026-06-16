"use client";
import { useState } from 'react';
import { Upload, File, Image as ImageIcon, Film, Music, Check, Share2, Download, Trash2, X, Plus } from 'lucide-react';

interface FileAsset {
  id: number;
  name: string;
  size: string;
  project: string;
  type: 'Video' | 'Image' | 'Audio' | 'Document';
  date: string;
}

interface UploadTask {
  id: number;
  name: string;
  progress: number;
  status: 'Uploading' | 'Complete';
}

export default function FileUploads() {
  const [files, setFiles] = useState<FileAsset[]>([
    { id: 1, name: "Reebok_ZRun_RoughCut_V1.mp4", size: "245.8 MB", project: "Reebok Z-Run Ad", type: "Video", date: "2026-06-15" },
    { id: 2, name: "BMW_M5_Cinematic_ColorGrade_V3.cube", size: "4.2 MB", project: "BMW M5 Cinematic Reel", type: "Document", date: "2026-06-14" },
    { id: 3, name: "Vogue_Editorial_Raw_0045.dng", size: "48.5 MB", project: "Vogue Summer Shoot", type: "Image", date: "2026-06-12" },
    { id: 4, name: "Vogue_Editorial_Raw_0046.dng", size: "47.9 MB", project: "Vogue Summer Shoot", type: "Image", date: "2026-06-12" },
    { id: 5, name: "CocaCola_Refresh_BeatMaster.wav", size: "32.4 MB", project: "Coca-Cola Commercial", type: "Audio", date: "2026-06-10" }
  ]);

  const [uploadQueue, setUploadQueue] = useState<UploadTask[]>([]);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Video' | 'Image' | 'Audio' | 'Document'>('All');
  
  // Form input states for new upload
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'Video' | 'Image' | 'Audio' | 'Document'>('Video');
  const [newFileProject, setNewFileProject] = useState('Reebok Z-Run Ad');

  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSimulatedUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const newTaskId = Date.now();
    const cleanFileName = newFileName.includes('.') 
      ? newFileName 
      : `${newFileName}.${newFileType === 'Video' ? 'mp4' : newFileType === 'Image' ? 'jpg' : newFileType === 'Audio' ? 'wav' : 'pdf'}`;

    const newTask: UploadTask = {
      id: newTaskId,
      name: cleanFileName,
      progress: 0,
      status: 'Uploading'
    };

    setUploadQueue(prev => [...prev, newTask]);
    setNewFileName('');

    // Simulate upload progress interval
    const interval = setInterval(() => {
      setUploadQueue(prev => {
        const task = prev.find(t => t.id === newTaskId);
        if (!task) {
          clearInterval(interval);
          return prev;
        }

        if (task.progress >= 100) {
          clearInterval(interval);
          // Append to files list
          const newFile: FileAsset = {
            id: Date.now(),
            name: task.name,
            size: `${(Math.random() * 50 + 5).toFixed(1)} MB`,
            project: newFileProject,
            type: newFileType,
            date: new Date().toISOString().split('T')[0]
          };
          // Deferred state update to append file
          setTimeout(() => {
            setFiles(currentFiles => [newFile, ...currentFiles]);
            // Remove from queue after brief delay
            setUploadQueue(currentQueue => currentQueue.filter(q => q.id !== newTaskId));
            triggerNotification(`File '${task.name}' uploaded successfully!`);
          }, 500);

          return prev.map(t => t.id === newTaskId ? { ...t, progress: 100, status: 'Complete' } : t);
        }

        return prev.map(t => t.id === newTaskId ? { ...t, progress: t.progress + 20 } : t);
      });
    }, 400);
  };

  const handleDeleteFile = (id: number) => {
    const fName = files.find(f => f.id === id)?.name;
    if (confirm(`Are you sure you want to delete file '${fName}'?`)) {
      setFiles(files.filter(f => f.id !== id));
      triggerNotification(`File '${fName}' deleted.`);
    }
  };

  const handleShareFile = (name: string) => {
    // Simulate copying direct asset share link
    triggerNotification(`Copied share link for '${name}'!`);
  };

  const getFileIcon = (type: FileAsset['type']) => {
    switch (type) {
      case 'Video': return <Film className="w-5 h-5 text-orange-500" />;
      case 'Image': return <ImageIcon className="w-5 h-5 text-blue-400" />;
      case 'Audio': return <Music className="w-5 h-5 text-green-500" />;
      case 'Document': return <File className="w-5 h-5 text-purple-400" />;
    }
  };

  const filteredFiles = files.filter(f => {
    if (activeFilter === 'All') return true;
    return f.type === activeFilter;
  });

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-white">File Upload Center</h1>
        <p className="text-gray-400 text-sm mt-1">Upload raw video cuts, design assets, LUTs, and client deliverables.</p>
      </div>

      {/* Toast notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-orange-500 text-black px-4 py-3 rounded-sm font-semibold text-sm shadow-lg z-50 flex items-center gap-2">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Upload area row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Upload Box */}
        <div className="lg:col-span-2 bg-neutral-900 border border-white/5 p-6 rounded-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Upload New Media</h2>
            <form onSubmit={handleSimulatedUpload} className="space-y-4">
              
              <div className="border border-dashed border-white/10 hover:border-orange-500/20 p-8 rounded-sm bg-black/40 flex flex-col items-center justify-center cursor-pointer transition-colors relative">
                <Upload className="w-10 h-10 text-orange-500/30 mb-2 group-hover:text-orange-500" />
                <span className="text-sm font-semibold text-gray-300">Drag shoot files here, or fill form details below</span>
                <span className="text-[10px] text-gray-500 mt-1">Max upload limit: 2GB per file</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="sm:col-span-1">
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold font-bold">File Display Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Reebok_Master_Edit"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Asset Format / Type</label>
                  <select 
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value as any)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Video">Video (.mp4, .mov)</option>
                    <option value="Image">Photo / RAW (.dng, .jpg)</option>
                    <option value="Audio">Audio Mix (.wav, .mp3)</option>
                    <option value="Document">LUT / Doc (.pdf, .cube)</option>
                  </select>
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Associate Project</label>
                  <select 
                    value={newFileProject}
                    onChange={(e) => setNewFileProject(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Reebok Z-Run Ad">Reebok Z-Run Ad</option>
                    <option value="Nike India Campaign">Nike India Campaign</option>
                    <option value="Vogue Summer Shoot">Vogue Summer Shoot</option>
                    <option value="BMW M5 Cinematic Reel">BMW M5 Cinematic Reel</option>
                    <option value="Coca-Cola Commercial">Coca-Cola Commercial</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="bg-orange-500 text-black px-5 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-orange-400 transition-colors flex items-center gap-2 mt-2"
              >
                <Plus className="w-4 h-4" /> Start File Upload
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Upload Progress queue */}
        <div className="bg-neutral-900 border border-white/5 p-6 rounded-sm">
          <h2 className="text-xl font-bold text-white mb-6">Uploading Queue</h2>
          
          {uploadQueue.length === 0 ? (
            <div className="h-44 border border-white/5 border-dashed rounded-sm flex flex-col items-center justify-center text-gray-500 text-xs select-none">
              No active file transfers.
            </div>
          ) : (
            <div className="space-y-4">
              {uploadQueue.map((task) => (
                <div key={task.id} className="bg-black/50 border border-white/5 p-3 rounded-sm space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white truncate max-w-[150px]" title={task.name}>{task.name}</span>
                    <span className={`font-bold ${task.status === 'Complete' ? 'text-green-500' : 'text-orange-500'}`}>
                      {task.status === 'Complete' ? 'Complete' : `${task.progress}%`}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={`h-full transition-all duration-300 ${task.status === 'Complete' ? 'bg-green-500' : 'bg-orange-500'}`} 
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Asset Library Table */}
      <div className="bg-neutral-900 border border-white/5 rounded-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <h2 className="text-xl font-bold text-white">Asset Library</h2>
          
          {/* File filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto">
            {['All', 'Video', 'Image', 'Audio', 'Document'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeFilter === filter 
                    ? 'bg-orange-500 text-black' 
                    : 'bg-black text-gray-400 border border-white/10 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Files Grid table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider bg-black/30">
                <th className="p-4 font-semibold">File Name</th>
                <th className="p-4 font-semibold">Project Association</th>
                <th className="p-4 font-semibold">Date Uploaded</th>
                <th className="p-4 font-semibold">File Size</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-white text-sm">
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No media assets found in this format.</td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold flex items-center gap-2.5 truncate max-w-[240px]" title={file.name}>
                      {getFileIcon(file.type)}
                      {file.name}
                    </td>
                    <td className="p-4 text-xs font-medium text-orange-500">{file.project}</td>
                    <td className="p-4 text-xs text-gray-400">{file.date}</td>
                    <td className="p-4 text-xs font-semibold text-gray-300">{file.size}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase ${
                        file.type === 'Video' ? 'bg-orange-500/10 text-orange-500' :
                        file.type === 'Image' ? 'bg-blue-500/10 text-blue-500' :
                        file.type === 'Audio' ? 'bg-green-500/10 text-green-500' :
                        'bg-purple-500/10 text-purple-500'
                      }`}>
                        {file.type}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-3 text-gray-400">
                        <button 
                          onClick={() => handleShareFile(file.name)}
                          className="hover:text-white p-1" 
                          title="Copy Share Link"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => alert(`Simulating download of ${file.name}`)}
                          className="hover:text-white p-1" 
                          title="Download File"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteFile(file.id)}
                          className="hover:text-red-500 p-1 transition-colors" 
                          title="Delete file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
