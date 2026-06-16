import React, { useState, useEffect } from "react";
import { firebase } from "../../Firebase/config"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
    FaPlus, 
    FaTrash, 
    FaUpload, 
    FaTimes, 
    FaEdit, 
    FaChevronDown, 
    FaChevronUp, 
    FaPlay, 
    FaImage, 
    FaBook, 
    FaCalculator, 
    FaMoneyBillWave, 
    FaTag,
    FaLayerGroup,
    FaFolderOpen
} from "react-icons/fa";
import AdminNav from '../../components/AdminNav';

// Unified Theme Colors
const PRIMARY_COLOR_CLASS = "bg-[#263b79]";
const PRIMARY_TEXT_CLASS = "text-[#263b79]";
const PRIMARY_HOVER_CLASS = "hover:bg-[#1a2854]"; 
const PRIMARY_FOCUS_RING = "focus:ring-[#263b79]/20";
const PRIMARY_BORDER_FOCUS = "focus:border-[#263b79]";

// --- Component Initializers ---
const createNewNumerical = () => ({
    numericalTitle: "", 
    numericalResourceType: "pdf",
    numericalImageFile: null, 
    numericalFiles: [], 
});

const createNewResource = () => ({
    title: "", 
    resourceType: "pdf",
    files: [], 
    numericals: [createNewNumerical()]
});

const createNewTopic = () => ({
    name: "",
    isExpanded: true, // Auto-expand new items so user can type
    resources: [createNewResource()]
});

const createNewChapter = () => ({
    name: "",
    isExpanded: true,
    topics: [createNewTopic()]
});

const createNewSubject = () => ({
    name: "",
    isExpanded: true,
    chapters: [createNewChapter()]
});

// --- Independent UI Components to prevent focus loss ---
const ModernInput = ({ label, type = "text", value, onChange, placeholder, icon: Icon, prefix }) => (
    <div className="flex flex-col mb-4 w-full">
        <label className="block text-gray-700 font-bold text-[11px] uppercase tracking-wider mb-2">
            {label}
        </label>
        <div className="relative flex items-center">
            {Icon && (
                <div className="absolute left-3 text-gray-400 pointer-events-none">
                    <Icon size={16} />
                </div>
            )}
            {prefix && (
                <div className={`absolute ${Icon ? 'left-9' : 'left-3'} text-gray-500 font-semibold pointer-events-none`}>
                    {prefix}
                </div>
            )}
            <input
                type={type}
                className={`w-full py-3 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 shadow-sm outline-none transition-all duration-200 focus:bg-white focus:ring-2 ${PRIMARY_FOCUS_RING} ${PRIMARY_BORDER_FOCUS}
                    ${Icon && prefix ? 'pl-14' : Icon ? 'pl-10' : prefix ? 'pl-8' : 'pl-4'}
                `}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    </div>
);

const ModernSelect = ({ label, value, onChange, options, icon: Icon }) => (
    <div className="flex flex-col mb-4 w-full">
        <label className="block text-gray-700 font-bold text-[11px] uppercase tracking-wider mb-2">
            {label}
        </label>
        <div className="relative flex items-center">
            {Icon && (
                <div className="absolute left-3 text-gray-400 pointer-events-none">
                    <Icon size={16} />
                </div>
            )}
            <select
                className={`w-full py-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 shadow-sm outline-none appearance-none transition-all duration-200 focus:bg-white focus:ring-2 ${PRIMARY_FOCUS_RING} ${PRIMARY_BORDER_FOCUS}
                    ${Icon ? 'pl-10' : 'pl-4'}
                `}
                value={value}
                onChange={onChange}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value} className="text-gray-800">
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="absolute right-3 text-gray-400 pointer-events-none">
                <FaChevronDown size={12} />
            </div>
        </div>
    </div>
);

const CustomFileInput = ({ label, type, multiple, accept, onChange, files, onRemoveFile, icon: Icon, helperText }) => (
    <div className="mb-4">
        <label className="block text-sm text-gray-700 font-semibold mb-1 flex items-center">
            {Icon && <Icon className={`mr-1.5 ${PRIMARY_TEXT_CLASS}`} size={12} />}
            {label}:
        </label>
        <input
            className={`w-full border border-gray-200 p-2 rounded-xl text-sm file:border-0 file:py-2 file:px-4 file:rounded-lg file:mr-3 file:text-white file:${PRIMARY_COLOR_CLASS} file:font-semibold transition duration-150 ease-in-out cursor-pointer hover:file:${PRIMARY_HOVER_CLASS}`}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={onChange}
        />
        <p className="text-[11px] text-gray-400 mt-1">{helperText}</p>

        {(files && files.length > 0) && (
            <div className="mt-3 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Selected files:</p>
                {files.map((file, fileIndex) => (
                    <div key={fileIndex} className={`flex justify-between items-center bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-xs shadow-sm`}>
                        <span className="flex items-center text-gray-700 truncate max-w-[80%] font-medium">
                            {type === 'video' && <FaPlay className={`mr-2 ${PRIMARY_TEXT_CLASS}`} size={10} />}
                            {type === 'image' && <FaImage className={`mr-2 ${PRIMARY_TEXT_CLASS}`} size={10} />}
                            {type === 'pdf' && <FaBook className={`mr-2 ${PRIMARY_TEXT_CLASS}`} size={10} />}
                            {typeof file === 'string' ? file.split('/').pop().split('?')[0] : file.name}
                        </span>
                        <button
                            type="button"
                            onClick={() => onRemoveFile(fileIndex)}
                            className="text-gray-400 hover:text-red-500 transition p-1"
                            title="Remove File"
                        >
                            <FaTimes size={12} />
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
);

const CustomImageFileInput = ({ label, onChange, file, onRemoveFile, helperText, disabled }) => (
    <div className="mb-4">
        <label className="block text-sm text-gray-700 font-semibold mb-1 flex items-center">
            <FaImage className={`mr-1.5 ${PRIMARY_TEXT_CLASS}`} size={12} />
            {label}:
        </label>
        <input
            className={`w-full border border-gray-200 p-2 rounded-xl text-sm file:border-0 file:py-2 file:px-4 file:rounded-lg file:mr-3 file:text-white file:${PRIMARY_COLOR_CLASS} file:font-semibold transition duration-150 ease-in-out cursor-pointer hover:file:${PRIMARY_HOVER_CLASS}`}
            type="file"
            accept="image/*"
            onChange={onChange}
            disabled={disabled}
        />
        <p className="text-[11px] text-gray-400 mt-1">{helperText}</p>

        {(file) && (
            <div className="mt-3 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Selected Image:</p>
                <div className={`flex justify-between items-center bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-xs shadow-sm`}>
                    <span className="flex items-center text-gray-700 truncate max-w-[80%] font-medium">
                        <FaImage className={`mr-2 ${PRIMARY_TEXT_CLASS}`} size={10} />
                        {typeof file === 'string' 
                            ? decodeURIComponent(file.split('/').pop().split('?')[0]) 
                            : file.name
                        }
                    </span>
                    <button
                        type="button"
                        onClick={onRemoveFile}
                        className="text-gray-400 hover:text-red-500 transition p-1"
                        title="Remove Image"
                    >
                        <FaTimes size={12} />
                    </button>
                </div>
            </div>
        )}
    </div>
);


const Course = () => {
    const [showForm, setShowForm] = useState(false);
    
    // Core Course Data
    const [courseClass, setCourseClass] = useState("");
    const [courseName, setCourseName] = useState("");
    const [price, setPrice] = useState("");
    const [offerprice, setOfferprice] = useState("");
    
    // Deeply Nested Hierarchy: Subjects -> Chapters -> Topics -> Resources -> Numericals
    const [subjects, setSubjects] = useState([]); 
    
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const [courses, setCourses] = useState([]);
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [editingCourse, setEditingCourse] = useState(null);

    // --- State Handlers (Subjects) ---
    const addSubject = () => setSubjects([...subjects, createNewSubject()]);
    const removeSubject = (sIndex) => setSubjects(subjects.filter((_, i) => i !== sIndex));
    const toggleSubject = (sIndex) => {
        const newSubjects = [...subjects];
        newSubjects[sIndex].isExpanded = !newSubjects[sIndex].isExpanded;
        setSubjects(newSubjects);
    };

    // --- State Handlers (Chapters) ---
    const addChapter = (sIndex) => {
        const newSubjects = [...subjects];
        newSubjects[sIndex].chapters.push(createNewChapter());
        newSubjects[sIndex].isExpanded = true; 
        setSubjects(newSubjects);
    };
    const removeChapter = (sIndex, cIndex) => {
        const newSubjects = [...subjects];
        newSubjects[sIndex].chapters = newSubjects[sIndex].chapters.filter((_, i) => i !== cIndex);
        setSubjects(newSubjects);
    };
    const toggleChapter = (sIndex, cIndex) => {
        const newSubjects = [...subjects];
        newSubjects[sIndex].chapters[cIndex].isExpanded = !newSubjects[sIndex].chapters[cIndex].isExpanded;
        setSubjects(newSubjects);
    };

    // --- State Handlers (Topics) ---
    const addTopic = (sIndex, cIndex) => {
        const newSubjects = [...subjects];
        newSubjects[sIndex].chapters[cIndex].topics.push(createNewTopic());
        newSubjects[sIndex].chapters[cIndex].isExpanded = true;
        setSubjects(newSubjects);
    };
    const removeTopic = (sIndex, cIndex, tIndex) => {
        const newSubjects = [...subjects];
        newSubjects[sIndex].chapters[cIndex].topics = newSubjects[sIndex].chapters[cIndex].topics.filter((_, i) => i !== tIndex);
        setSubjects(newSubjects);
    };
    const toggleTopic = (sIndex, cIndex, tIndex) => {
        const newSubjects = [...subjects];
        newSubjects[sIndex].chapters[cIndex].topics[tIndex].isExpanded = !newSubjects[sIndex].chapters[cIndex].topics[tIndex].isExpanded;
        setSubjects(newSubjects);
    };

    // --- Resource Management Functions ---
    const addResourceToTopic = (sIndex, cIndex, tIndex) => {
        const newSubjects = [...subjects];
        newSubjects[sIndex].chapters[cIndex].topics[tIndex].resources.push(createNewResource()); 
        setSubjects(newSubjects);
    };
    
    const removeResourceFromTopic = (sIndex, cIndex, tIndex, rIndex) => {
        const newSubjects = [...subjects];
        newSubjects[sIndex].chapters[cIndex].topics[tIndex].resources = newSubjects[sIndex].chapters[cIndex].topics[tIndex].resources.filter((_, i) => i !== rIndex);
        setSubjects(newSubjects);
    };
    
    const handleResourceTitleChange = (sIndex, cIndex, tIndex, rIndex, title) => {
        const newSubjects = [...subjects];
        newSubjects[sIndex].chapters[cIndex].topics[tIndex].resources[rIndex].title = title;
        setSubjects(newSubjects);
    };
    
    const handleResourceFilesChange = (sIndex, cIndex, tIndex, rIndex, newFiles) => {
        const newSubjects = [...subjects];
        const resource = newSubjects[sIndex].chapters[cIndex].topics[tIndex].resources[rIndex];
        const filesArray = Array.from(newFiles);

        if (resource.resourceType === 'pdf') {
            resource.files = filesArray.slice(0, 1);
        } else {
            const currentFiles = resource.files || [];
            resource.files = [...currentFiles, ...filesArray];
        }
        setSubjects(newSubjects);
    };
    
    const handleRemoveFileFromResource = (sIndex, cIndex, tIndex, rIndex, fileIndex) => {
        const newSubjects = [...subjects];
        newSubjects[sIndex].chapters[cIndex].topics[tIndex].resources[rIndex].files = newSubjects[sIndex].chapters[cIndex].topics[tIndex].resources[rIndex].files.filter((_, i) => i !== fileIndex);
        setSubjects(newSubjects);
    };
    
    const handleResourceTypeChange = (sIndex, cIndex, tIndex, rIndex, type) => {
        const newSubjects = [...subjects];
        newSubjects[sIndex].chapters[cIndex].topics[tIndex].resources[rIndex].resourceType = type;
        newSubjects[sIndex].chapters[cIndex].topics[tIndex].resources[rIndex].files = []; 
        setSubjects(newSubjects);
    };

    // --- Numerical Management Functions ---
    const addNumericalToResource = (sIndex, cIndex, tIndex, rIndex) => {
        const newSubjects = [...subjects];
        const numericals = newSubjects[sIndex].chapters[cIndex].topics[tIndex].resources[rIndex].numericals || [];
        newSubjects[sIndex].chapters[cIndex].topics[tIndex].resources[rIndex].numericals = [...numericals, createNewNumerical()];
        setSubjects(newSubjects);
    };
    
    const removeNumericalFromResource = (sIndex, cIndex, tIndex, rIndex, nIndex) => {
        const newSubjects = [...subjects];
        newSubjects[sIndex].chapters[cIndex].topics[tIndex].resources[rIndex].numericals = newSubjects[sIndex].chapters[cIndex].topics[tIndex].resources[rIndex].numericals.filter((_, i) => i !== nIndex);
        setSubjects(newSubjects);
    };
    
    const handleNumericalTitleChange = (sIndex, cIndex, tIndex, rIndex, nIndex, text) => {
        const newSubjects = [...subjects];
        newSubjects[sIndex].chapters[cIndex].topics[tIndex].resources[rIndex].numericals[nIndex].numericalTitle = text;
        setSubjects(newSubjects);
    };

    const handleNumericalResourceTypeChange = (sIndex, cIndex, tIndex, rIndex, nIndex, type) => {
        const newSubjects = [...subjects];
        newSubjects[sIndex].chapters[cIndex].topics[tIndex].resources[rIndex].numericals[nIndex].numericalResourceType = type;
        newSubjects[sIndex].chapters[cIndex].topics[tIndex].resources[rIndex].numericals[nIndex].numericalFiles = []; 
        setSubjects(newSubjects);
    };
    
    const handleNumericalFilesChange = (sIndex, cIndex, tIndex, rIndex, nIndex, newFiles) => {
        const newSubjects = [...subjects];
        const numerical = newSubjects[sIndex].chapters[cIndex].topics[tIndex].resources[rIndex].numericals[nIndex];
        const filesArray = Array.from(newFiles);

        if (numerical.numericalResourceType === 'pdf') {
            numerical.numericalFiles = filesArray.slice(0, 1);
        } else {
            const currentFiles = numerical.numericalFiles || [];
            numerical.numericalFiles = [...currentFiles, ...filesArray];
        }
        setSubjects(newSubjects);
    };
    
    const handleRemoveFileFromNumerical = (sIndex, cIndex, tIndex, rIndex, nIndex, fileIndex) => {
        const newSubjects = [...subjects];
        newSubjects[sIndex].chapters[cIndex].topics[tIndex].resources[rIndex].numericals[nIndex].numericalFiles = newSubjects[sIndex].chapters[cIndex].topics[tIndex].resources[rIndex].numericals[nIndex].numericalFiles.filter((_, i) => i !== fileIndex);
        setSubjects(newSubjects);
    };
    
    const handleNumericalImageFileChange = (sIndex, cIndex, tIndex, rIndex, nIndex, newFiles) => {
        const newSubjects = [...subjects];
        const file = newFiles && newFiles.length > 0 ? newFiles[0] : null;
        newSubjects[sIndex].chapters[cIndex].topics[tIndex].resources[rIndex].numericals[nIndex].numericalImageFile = file;
        setSubjects(newSubjects);
    };
    
    const handleRemoveNumericalImageFile = (sIndex, cIndex, tIndex, rIndex, nIndex) => {
        const newSubjects = [...subjects];
        newSubjects[sIndex].chapters[cIndex].topics[tIndex].resources[rIndex].numericals[nIndex].numericalImageFile = null;
        setSubjects(newSubjects);
    };

    // Upload files and submit data
    const handleSubmit = async () => {
        if (!courseClass || !courseName || !price || !offerprice || subjects.length === 0) {
            toast.error("Please fill all required basic fields and add at least one subject!");
            return;
        }

        if (!/^\d+$/.test(price) || !/^\d+$/.test(offerprice)) {
            toast.error("Price and Offer Price must be valid numbers (digits only).");
            return;
        }

        setLoading(true);
        setProgress(0);
        const db = firebase.firestore();
        const storage = firebase.storage();
        const courseRef = editingCourse ? db.collection('sengarcarrercourses').doc(editingCourse.id) : db.collection('sengarcarrercourses');
        
        let uploadedSubjects = [];

        // Traverse to count total files for progress bar
        let totalFiles = 0;
        subjects.forEach(subject => {
            subject.chapters.forEach(chapter => {
                chapter.topics.forEach(topic => {
                    topic.resources.forEach(resource => {
                        resource.files.forEach(f => { if (f && typeof f !== 'string') totalFiles++; });
                        resource.numericals?.forEach(num => {
                            num.numericalFiles.forEach(f => { if (f && typeof f !== 'string') totalFiles++; });
                            if (num.numericalImageFile && typeof num.numericalImageFile !== 'string') totalFiles++;
                        });
                    });
                });
            });
        });

        let uploadedCount = 0;

        // Traverse and upload
        for (const subject of subjects) {
            let uploadedChapters = [];

            for (const chapter of subject.chapters) {
                let uploadedTopics = [];

                for (const topic of chapter.topics) {
                    let uploadedResources = [];

                    for (const resource of topic.resources) {
                        let uploadedFileUrls = [];
                        let uploadedNumericals = [];

                        for (const file of resource.files) {
                            let uploadedFileUrl = file;
                            if (file && typeof file !== 'string') {
                                const ext = resource.resourceType === 'pdf' ? 'pdf' : file.name.split('.').pop() || 'mp4';
                                const fName = `${resource.title.replace(/\s/g, '_')}_${Date.now()}`;
                                const fileRef = storage.ref(`courses/${courseClass}/${courseName}/${subject.name}/${chapter.name}/${topic.name}/resources/${fName}.${ext}`);
                                
                                try {
                                    await fileRef.put(file);
                                    uploadedFileUrl = await fileRef.getDownloadURL();
                                    uploadedCount++;
                                    setProgress((uploadedCount / totalFiles) * 100);
                                } catch (error) {
                                    console.error("Upload failed:", error);
                                    toast.error(`Failed to upload ${file.name}`);
                                    setLoading(false); return;
                                }
                            }
                            uploadedFileUrls.push(uploadedFileUrl);
                        }

                        for (const numerical of resource.numericals || []) {
                            let upNumFiles = [];
                            let upNumImage = numerical.numericalImageFile;
                            const prefix = numerical.numericalTitle.substring(0, 20).replace(/\s/g, '_') || 'numerical';

                            if (upNumImage && typeof upNumImage !== 'string') {
                                const ext = upNumImage.name.split('.').pop() || 'jpg';
                                const fName = `${prefix}_img_${Date.now()}`;
                                const ref = storage.ref(`courses/${courseClass}/${courseName}/${subject.name}/${chapter.name}/${topic.name}/numericals/${fName}.${ext}`);
                                try {
                                    await ref.put(upNumImage);
                                    upNumImage = await ref.getDownloadURL();
                                    uploadedCount++; setProgress((uploadedCount / totalFiles) * 100);
                                } catch (error) { setLoading(false); return; }
                            }

                            for (const file of numerical.numericalFiles) {
                                let upUrl = file;
                                if (file && typeof file !== 'string') {
                                    const ext = numerical.numericalResourceType === 'pdf' ? 'pdf' : file.name.split('.').pop() || 'mp4';
                                    const fName = `${prefix}_sol_${Date.now()}`;
                                    const ref = storage.ref(`courses/${courseClass}/${courseName}/${subject.name}/${chapter.name}/${topic.name}/numericals/${fName}.${ext}`);
                                    try {
                                        await ref.put(file);
                                        upUrl = await ref.getDownloadURL();
                                        uploadedCount++; setProgress((uploadedCount / totalFiles) * 100);
                                    } catch (error) { setLoading(false); return; }
                                }
                                upNumFiles.push(upUrl);
                            }

                            uploadedNumericals.push({
                                numericalTitle: numerical.numericalTitle,
                                numericalResourceType: numerical.numericalResourceType,
                                numericalImageUrl: upNumImage,
                                numericalFileUrls: upNumFiles,
                            });
                        }

                        uploadedResources.push({
                            title: resource.title,
                            resourceType: resource.resourceType,
                            fileUrls: uploadedFileUrls,
                            numericals: uploadedNumericals, 
                        });
                    }
                    uploadedTopics.push({ name: topic.name, resources: uploadedResources });
                }
                uploadedChapters.push({ name: chapter.name, topics: uploadedTopics });
            }
            uploadedSubjects.push({ name: subject.name, chapters: uploadedChapters });
        }

        const courseData = {
            courseClass,
            courseName,
            price: parseInt(price, 10), 
            offerprice: parseInt(offerprice, 10), 
            subjects: uploadedSubjects, // Saving massive hierarchical data tree
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        };

        try {
            if (editingCourse) {
                await courseRef.update(courseData);
                toast.success("Course updated successfully!");
            } else {
                await courseRef.add(courseData);
                toast.success("Course added successfully!");
            }
        } catch (error) {
            console.error("Firestore error:", error);
            toast.error("An error occurred during save.");
        }

        setLoading(false);
        setShowForm(false);
        resetForm();
        fetchCourses();
    };

    const resetForm = () => {
        setCourseClass("");
        setCourseName("");
        setPrice("");
        setOfferprice("");
        setSubjects([]); 
        setEditingCourse(null);
    };

    const fetchCourses = async () => {
        const db = firebase.firestore();
        const snapshot = await db.collection('sengarcarrercourses').orderBy("timestamp", "desc").get();
        setCourses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    // Deep Map for Edit Mode (ensure everything defaults to collapsed `isExpanded: false`)
    const editCourse = (course) => {
        setEditingCourse(course);
        setCourseClass(course.courseClass || "");
        setCourseName(course.courseName || "");
        setPrice(String(course.price)); 
        setOfferprice(String(course.offerprice)); 

        const parsedSubjects = (course.subjects || []).map(subject => ({
            name: subject.name,
            isExpanded: false, // Default collapse
            chapters: (subject.chapters || []).map(chapter => ({
                name: chapter.name,
                isExpanded: false, // Default collapse
                topics: (chapter.topics || []).map(topic => ({
                    name: topic.name,
                    isExpanded: false, // Default collapse
                    resources: (topic.resources || []).map(resource => ({
                        title: resource.title,
                        resourceType: resource.resourceType,
                        files: resource.fileUrls || [],
                        numericals: (resource.numericals || []).map(numerical => ({
                            numericalTitle: numerical.numericalTitle,
                            numericalResourceType: numerical.numericalResourceType || 'pdf',
                            numericalImageFile: numerical.numericalImageUrl || null,
                            numericalFiles: numerical.numericalFileUrls || [],
                        }))
                    }))
                }))
            }))
        }));

        setSubjects(parsedSubjects.length > 0 ? parsedSubjects : [createNewSubject()]);
        setShowForm(true);
    };

    const deleteCourse = async (id) => {
        if (window.confirm("Are you sure you want to delete this course entirely?")) {
            await firebase.firestore().collection('sengarcarrercourses').doc(id).delete();
            toast.success("Course deleted!");
            fetchCourses();
        }
    };

    const toggleCourse = (id) => setExpandedCourse(expandedCourse === id ? null : id);

    useEffect(() => { fetchCourses(); }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="md:ml-64" >
            
            {/* Floating Add Button */}
            <div className="fixed bottom-24 right-6 z-20">
                <button
                    className={`${PRIMARY_COLOR_CLASS} text-white px-6 py-4 rounded-full flex items-center space-x-3 shadow-lg ${PRIMARY_HOVER_CLASS} transition transform hover:scale-105`}
                    onClick={() => { resetForm(); setShowForm(true); }}
                >
                    <FaPlus size={18} />
                    <span className="font-bold text-lg">Add New Course</span>
                </button>
            </div>

            {/* Course Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-gray-900/70 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-gray-50 w-full max-w-5xl max-h-[95vh] rounded-2xl shadow-2xl relative overflow-y-auto transform flex flex-col mx-auto border border-gray-200">
                        
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-white px-8 py-5 border-b border-gray-100 flex justify-between items-center shadow-sm">
                            <h2 className="text-2xl font-extrabold text-gray-900">
                                {editingCourse ? "Update Course Hierarchy" : "Create Course Hierarchy"}
                            </h2>
                            <button
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                                onClick={() => { setShowForm(false); resetForm(); }}
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 sm:p-8">
                            
                            {/* --- Level 1: Basic Info (Class & Course) --- */}
                            <div className="mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center border-b border-gray-100 pb-3">
                                    <FaTag className={`mr-2 ${PRIMARY_TEXT_CLASS}`} /> 1. Class & Course Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                    <ModernSelect
                                        label="Select Class"
                                        icon={FaBook}
                                        value={courseClass}
                                        onChange={(e) => setCourseClass(e.target.value)}
                                        options={[
                                            { value: "", label: "Select a Class" },
                                            { value: "Class 9", label: "Class 9" },
                                            { value: "Class 10", label: "Class 10" },
                                            { value: "Class 11", label: "Class 11" },
                                            { value: "Class 12", label: "Class 12" },
                                            { value: "JEE", label: "JEE" },
                                            { value: "NEET", label: "NEET" },
                                        ]}
                                    />
                                    <ModernInput
                                        label="Course Name"
                                        icon={FaBook}
                                        value={courseName}
                                        onChange={(e) => setCourseName(e.target.value)}
                                        placeholder="e.g., Crash Course 2026"
                                    />
                                    <ModernInput
                                        label="Original Price"
                                        icon={FaMoneyBillWave}
                                        prefix="₹"
                                        value={price}
                                        onChange={(e) => /^\d*$/.test(e.target.value) && setPrice(e.target.value)}
                                        placeholder="999"
                                    />
                                    <ModernInput
                                        label="Offer Price"
                                        icon={FaTag}
                                        prefix="₹"
                                        value={offerprice}
                                        onChange={(e) => /^\d*$/.test(e.target.value) && setOfferprice(e.target.value)}
                                        placeholder="499"
                                    />
                                </div>
                            </div>

                            {/* --- Level 2: Subjects --- */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                                    <FaLayerGroup className={`mr-3 ${PRIMARY_TEXT_CLASS}`} /> 
                                    2. Subjects & Content Hierarchy
                                </h3>
                                <button
                                    className={`${PRIMARY_COLOR_CLASS} text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-sm hover:opacity-90 transition`}
                                    onClick={addSubject}
                                >
                                    <FaPlus className="mr-2" /> Add Subject
                                </button>
                            </div>

                            <div className="space-y-6">
                                {subjects.map((subject, sIndex) => (
                                    <div key={sIndex} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                        
                                        {/* Subject Header (Collapsible) */}
                                        <div 
                                            className="bg-gray-100 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-200 transition"
                                            onClick={() => toggleSubject(sIndex)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span className={`transition transform ${subject.isExpanded ? 'rotate-180' : ''} text-gray-500`}>
                                                    <FaChevronDown size={16} />
                                                </span>
                                                <h4 className="text-lg font-extrabold text-gray-800">
                                                    Subject {sIndex + 1}: {subject.name || "Untitled Subject"}
                                                </h4>
                                            </div>
                                            <button
                                                className="text-gray-400 hover:text-red-600 transition p-2 rounded-full hover:bg-white"
                                                onClick={(e) => { e.stopPropagation(); removeSubject(sIndex); }}
                                                title="Delete Subject"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>

                                        {/* Subject Body (Expanded) */}
                                        {subject.isExpanded && (
                                            <div className="p-6 bg-white border-t border-gray-200">
                                                <ModernInput
                                                    label="Subject Name"
                                                    value={subject.name}
                                                    onChange={(e) => {
                                                        const newSubjects = [...subjects];
                                                        newSubjects[sIndex].name = e.target.value;
                                                        setSubjects(newSubjects);
                                                    }}
                                                    placeholder="e.g., Physics, Chemistry, Math"
                                                />

                                                {/* --- Level 3: Chapters --- */}
                                                <div className="mt-6 border-l-4 border-indigo-200 pl-4 ml-2">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h5 className="text-md font-bold text-gray-700 flex items-center">
                                                            <FaFolderOpen className="mr-2 text-indigo-400" /> Chapters
                                                        </h5>
                                                        <button
                                                            className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center"
                                                            onClick={() => addChapter(sIndex)}
                                                        >
                                                            <FaPlus className="mr-1.5" size={10} /> Add Chapter
                                                        </button>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {subject.chapters.map((chapter, cIndex) => (
                                                            <div key={cIndex} className="bg-white border border-indigo-100 rounded-xl overflow-hidden shadow-sm">
                                                                
                                                                {/* Chapter Header (Collapsible) */}
                                                                <div 
                                                                    className="bg-indigo-50/50 p-3 flex justify-between items-center cursor-pointer hover:bg-indigo-50 transition"
                                                                    onClick={() => toggleChapter(sIndex, cIndex)}
                                                                >
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className={`transition transform ${chapter.isExpanded ? 'rotate-180' : ''} text-indigo-400`}>
                                                                            <FaChevronDown size={14} />
                                                                        </span>
                                                                        <h6 className="font-bold text-indigo-900 text-sm">
                                                                            Chapter {cIndex + 1}: {chapter.name || "Untitled Chapter"}
                                                                        </h6>
                                                                    </div>
                                                                    <button
                                                                        className="text-gray-400 hover:text-red-500 transition p-1.5 rounded-md hover:bg-white"
                                                                        onClick={(e) => { e.stopPropagation(); removeChapter(sIndex, cIndex); }}
                                                                    >
                                                                        <FaTrash size={12} />
                                                                    </button>
                                                                </div>

                                                                {/* Chapter Body (Expanded) */}
                                                                {chapter.isExpanded && (
                                                                    <div className="p-5 border-t border-indigo-100">
                                                                        <ModernInput
                                                                            label="Chapter Name"
                                                                            value={chapter.name}
                                                                            onChange={(e) => {
                                                                                const newSubjects = [...subjects];
                                                                                newSubjects[sIndex].chapters[cIndex].name = e.target.value;
                                                                                setSubjects(newSubjects);
                                                                            }}
                                                                            placeholder="e.g., Kinematics"
                                                                        />

                                                                        {/* --- Level 4: Topics --- */}
                                                                        <div className="mt-5 border-l-4 border-emerald-200 pl-4 ml-2">
                                                                            <div className="flex justify-between items-center mb-4">
                                                                                <h6 className="text-sm font-bold text-gray-700 flex items-center">
                                                                                    <FaBook className="mr-2 text-emerald-400" /> Topics
                                                                                </h6>
                                                                                <button
                                                                                    className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center"
                                                                                    onClick={() => addTopic(sIndex, cIndex)}
                                                                                >
                                                                                    <FaPlus className="mr-1.5" size={10} /> Add Topic
                                                                                </button>
                                                                            </div>

                                                                            <div className="space-y-4">
                                                                                {chapter.topics.map((topic, tIndex) => (
                                                                                    <div key={tIndex} className="bg-white border border-emerald-100 rounded-lg overflow-hidden shadow-sm">
                                                                                        
                                                                                        {/* Topic Header (Collapsible) */}
                                                                                        <div 
                                                                                            className="bg-emerald-50/50 p-3 flex justify-between items-center cursor-pointer hover:bg-emerald-50 transition"
                                                                                            onClick={() => toggleTopic(sIndex, cIndex, tIndex)}
                                                                                        >
                                                                                            <div className="flex items-center space-x-2">
                                                                                                <span className={`transition transform ${topic.isExpanded ? 'rotate-180' : ''} text-emerald-500`}>
                                                                                                    <FaChevronDown size={12} />
                                                                                                </span>
                                                                                                <p className="font-bold text-emerald-900 text-sm">
                                                                                                    Topic {tIndex + 1}: {topic.name || "Untitled"}
                                                                                                </p>
                                                                                            </div>
                                                                                            <button
                                                                                                className="text-gray-400 hover:text-red-500 transition p-1.5 rounded-md hover:bg-white"
                                                                                                onClick={(e) => { e.stopPropagation(); removeTopic(sIndex, cIndex, tIndex); }}
                                                                                            >
                                                                                                <FaTrash size={12} />
                                                                                            </button>
                                                                                        </div>

                                                                                        {/* Topic Body (Expanded) */}
                                                                                        {topic.isExpanded && (
                                                                                            <div className="p-4 border-t border-emerald-100">
                                                                                                <ModernInput
                                                                                                    label="Topic Title"
                                                                                                    value={topic.name}
                                                                                                    onChange={(e) => {
                                                                                                        const newSubjects = [...subjects];
                                                                                                        newSubjects[sIndex].chapters[cIndex].topics[tIndex].name = e.target.value;
                                                                                                        setSubjects(newSubjects);
                                                                                                    }}
                                                                                                    placeholder="e.g., Intro to Motion"
                                                                                                />

                                                                                                {/* --- Level 5: Resources --- */}
                                                                                                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                                                                    <h6 className="text-xs font-bold text-gray-800 mb-4 flex items-center uppercase tracking-wider">
                                                                                                        <FaLayerGroup className="mr-2 text-gray-400" /> Resource Groups
                                                                                                    </h6>
                                                                                                    
                                                                                                    <div className="space-y-6">
                                                                                                        {topic.resources.map((resource, rIndex) => (
                                                                                                            <div key={rIndex} className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm">
                                                                                                                <div className="flex justify-between items-center mb-3">
                                                                                                                    <p className="text-xs font-extrabold text-gray-700">Group {rIndex + 1}</p>
                                                                                                                    {topic.resources.length > 1 && (
                                                                                                                        <button
                                                                                                                            className="text-gray-400 hover:text-red-500 transition p-1"
                                                                                                                            onClick={() => removeResourceFromTopic(sIndex, cIndex, tIndex, rIndex)}
                                                                                                                        >
                                                                                                                            <FaTrash size={10} />
                                                                                                                        </button>
                                                                                                                    )}
                                                                                                                </div>

                                                                                                                <ModernInput
                                                                                                                    label="Group Title"
                                                                                                                    value={resource.title}
                                                                                                                    onChange={(e) => handleResourceTitleChange(sIndex, cIndex, tIndex, rIndex, e.target.value)}
                                                                                                                    placeholder="e.g., Lecture Video"
                                                                                                                />

                                                                                                                <div className="mb-4">
                                                                                                                    <label className="block text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-2">Main File Type:</label>
                                                                                                                    <div className="flex space-x-6">
                                                                                                                        <label className="flex items-center text-xs cursor-pointer">
                                                                                                                            <input type="radio" value="pdf" checked={resource.resourceType === 'pdf'} onChange={() => handleResourceTypeChange(sIndex, cIndex, tIndex, rIndex, 'pdf')} className="mr-2 cursor-pointer" />
                                                                                                                            PDF (Single)
                                                                                                                        </label>
                                                                                                                        <label className="flex items-center text-xs cursor-pointer">
                                                                                                                            <input type="radio" value="video" checked={resource.resourceType === 'video'} onChange={() => handleResourceTypeChange(sIndex, cIndex, tIndex, rIndex, 'video')} className="mr-2 cursor-pointer" />
                                                                                                                            Video (Multiple)
                                                                                                                        </label>
                                                                                                                    </div>
                                                                                                                </div>

                                                                                                                <CustomFileInput
                                                                                                                    label={resource.resourceType === 'pdf' ? 'Upload PDF' : 'Upload Videos'}
                                                                                                                    type={resource.resourceType}
                                                                                                                    multiple={resource.resourceType === 'video'}
                                                                                                                    accept={resource.resourceType === 'pdf' ? '.pdf' : 'video/*'}
                                                                                                                    onChange={(e) => handleResourceFilesChange(sIndex, cIndex, tIndex, rIndex, e.target.files)}
                                                                                                                    files={resource.files}
                                                                                                                    onRemoveFile={(fileIndex) => handleRemoveFileFromResource(sIndex, cIndex, tIndex, rIndex, fileIndex)}
                                                                                                                    icon={resource.resourceType === 'pdf' ? FaBook : FaPlay}
                                                                                                                />

                                                                                                                {/* --- Numericals Attached --- */}
                                                                                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                                                                                    <h6 className="text-xs font-bold text-gray-600 mb-3 flex items-center">
                                                                                                                        <FaCalculator className="mr-2 text-gray-400" /> Attached Numericals
                                                                                                                    </h6>
                                                                                                                    {resource.numericals?.map((numerical, nIndex) => (
                                                                                                                        <div key={nIndex} className="p-3 mb-3 border border-gray-200 rounded bg-gray-50/50">
                                                                                                                            <div className="flex justify-between items-center mb-2">
                                                                                                                                <p className="text-[10px] font-bold text-gray-500">Numerical {nIndex + 1}</p>
                                                                                                                                <button className="text-red-400 hover:text-red-600" onClick={() => removeNumericalFromResource(sIndex, cIndex, tIndex, rIndex, nIndex)}><FaTrash size={10} /></button>
                                                                                                                            </div>
                                                                                                                            <ModernInput label="Numerical Name" value={numerical.numericalTitle} onChange={(e) => handleNumericalTitleChange(sIndex, cIndex, tIndex, rIndex, nIndex, e.target.value)} placeholder="e.g., Problem 1" />
                                                                                                                            <CustomImageFileInput label="Image/Diagram" onChange={(e) => handleNumericalImageFileChange(sIndex, cIndex, tIndex, rIndex, nIndex, e.target.files)} file={numerical.numericalImageFile} onRemoveFile={() => handleRemoveNumericalImageFile(sIndex, cIndex, tIndex, rIndex, nIndex)} disabled={numerical.numericalImageFile && typeof numerical.numericalImageFile !== 'string'} />
                                                                                                                            
                                                                                                                            <div className="mb-3 pt-2 border-t border-gray-200">
                                                                                                                                <label className="block text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-2">Solution Type:</label>
                                                                                                                                <div className="flex space-x-4">
                                                                                                                                    <label className="text-[10px] flex items-center"><input type="radio" value="pdf" checked={numerical.numericalResourceType === 'pdf'} onChange={() => handleNumericalResourceTypeChange(sIndex, cIndex, tIndex, rIndex, nIndex, 'pdf')} className="mr-1" /> PDF</label>
                                                                                                                                    <label className="text-[10px] flex items-center"><input type="radio" value="video" checked={numerical.numericalResourceType === 'video'} onChange={() => handleNumericalResourceTypeChange(sIndex, cIndex, tIndex, rIndex, nIndex, 'video')} className="mr-1" /> Video</label>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <CustomFileInput label="Solution File" type={numerical.numericalResourceType} multiple={numerical.numericalResourceType === 'video'} accept={numerical.numericalResourceType === 'pdf' ? '.pdf' : 'video/*'} onChange={(e) => handleNumericalFilesChange(sIndex, cIndex, tIndex, rIndex, nIndex, e.target.files)} files={numerical.numericalFiles} onRemoveFile={(fileIndex) => handleRemoveFileFromNumerical(sIndex, cIndex, tIndex, rIndex, nIndex, fileIndex)} icon={numerical.numericalResourceType === 'pdf' ? FaBook : FaPlay} />
                                                                                                                        </div>
                                                                                                                    ))}
                                                                                                                    <button className="mt-2 text-[#263b79] text-[11px] font-bold bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100 transition" onClick={() => addNumericalToResource(sIndex, cIndex, tIndex, rIndex)}>
                                                                                                                        + Add Numerical
                                                                                                                    </button>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        ))}
                                                                                                    </div>
                                                                                                    <button className="mt-4 w-full text-gray-600 text-xs font-bold border border-dashed border-gray-400 py-2 rounded-lg hover:bg-gray-100 transition" onClick={() => addResourceToTopic(sIndex, cIndex, tIndex)}>
                                                                                                        + Add Another Resource Group
                                                                                                    </button>
                                                                                                </div>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Submit Final Tree */}
                            <button
                                className={`${PRIMARY_COLOR_CLASS} text-white w-full py-4 mt-12 mb-6 rounded-xl flex justify-center items-center space-x-3 shadow-lg ${PRIMARY_HOVER_CLASS} transition font-bold text-xl`}
                                onClick={handleSubmit} disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <FaUpload className="animate-spin" />
                                        <span>Saving Hierarchy... {Math.round(progress)}%</span>
                                    </>
                                ) : (
                                    <span>{editingCourse ? "Update Course Hierarchy" : "Save Complete Course"}</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Courses Catalog Display (Reading Deep Structure) --- */}
            <div className="max-w-7xl mx-auto pb-24">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">📚 Complete Catalog</h2>

                {courses.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <FaBook className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No courses found</h3>
                        <p className="text-gray-500">Click the floating button to create your first nested course!</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {courses.map((course) => (
                            <div key={course.id} className="border-b border-gray-200 last:border-b-0 group">
                                <div className="p-5 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-gray-50 transition duration-150 ease-in-out gap-4" onClick={() => toggleCourse(course.id)}>
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-3.5 rounded-xl ${PRIMARY_COLOR_CLASS} text-white shadow-sm`}><FaBook size={20} /></div>
                                        <div>
                                            <h3 className={`font-extrabold text-lg sm:text-xl text-gray-900 group-hover:${PRIMARY_TEXT_CLASS} transition`}>{course.courseName}</h3>
                                            <p className="text-gray-500 font-medium text-sm mt-0.5 border border-gray-200 inline-block px-2 py-0.5 rounded-md bg-white">{course.courseClass}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-6 sm:ml-auto">
                                        <div className="text-right">
                                            <p className="text-gray-400 line-through text-xs font-semibold">₹{course.price}</p>
                                            <p className="font-extrabold text-green-600 text-lg">₹{course.offerprice}</p>
                                        </div>
                                        <div className="flex space-x-2 items-center">
                                            <button className="p-2 text-gray-400 hover:text-gray-800 transition bg-white border border-gray-200 hover:bg-gray-100 rounded-lg shadow-sm" onClick={(e) => { e.stopPropagation(); editCourse(course); }}><FaEdit size={16} /></button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 transition bg-white border border-gray-200 hover:bg-red-50 rounded-lg shadow-sm mr-4" onClick={(e) => { e.stopPropagation(); deleteCourse(course.id); }}><FaTrash size={16} /></button>
                                            <span className={`text-gray-400 transition transform ${expandedCourse === course.id ? 'rotate-180 text-gray-800' : ''}`}>
                                                {expandedCourse === course.id ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {expandedCourse === course.id && (
                                    <div className="p-6 bg-gray-50/80 border-t border-gray-200 shadow-inner">
                                        <h4 className="font-extrabold text-lg text-gray-800 mb-5 flex items-center"><FaLayerGroup className={`mr-2 ${PRIMARY_TEXT_CLASS}`} size={16} /> Course Hierarchy</h4>
                                        <div className="space-y-4">
                                            {(course.subjects || []).map((subject, sIdx) => (
                                                <div key={sIdx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                                    <div className="bg-gray-100 px-4 py-3 border-b border-gray-200"><p className="font-bold text-gray-800">📚 Subject: {subject.name}</p></div>
                                                    <div className="p-4 space-y-4">
                                                        {(subject.chapters || []).map((chapter, cIdx) => (
                                                            <div key={cIdx} className="border-l-4 border-indigo-400 pl-4">
                                                                <p className="font-bold text-indigo-900 text-sm mb-2">📁 Chapter: {chapter.name}</p>
                                                                <div className="space-y-3">
                                                                    {(chapter.topics || []).map((topic, tIdx) => (
                                                                        <div key={tIdx} className="ml-4 border border-emerald-100 rounded-lg p-3 bg-emerald-50/30">
                                                                            <p className="font-bold text-emerald-800 text-xs mb-2">📄 Topic: {topic.name}</p>
                                                                            <div className="ml-2 flex flex-wrap gap-2">
                                                                                {(topic.resources || []).map((res, rIdx) => (
                                                                                    <div key={rIdx} className="bg-white border border-gray-200 px-3 py-1.5 rounded shadow-sm text-[10px] font-bold text-gray-700 flex items-center">
                                                                                        {res.resourceType === 'video' ? <FaPlay className="mr-1.5 text-blue-500"/> : <FaBook className="mr-1.5 text-red-500"/>} 
                                                                                        {res.title} ({res.fileUrls?.length || 0} Files) | {(res.numericals || []).length} Numericals
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            </div>
            <AdminNav />
            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
};
export default Course;