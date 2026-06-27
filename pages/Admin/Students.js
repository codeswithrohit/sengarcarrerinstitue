import React, { useState, useEffect, useMemo } from "react";
import { firebase } from "../../Firebase/config";
import AdminNav from "@/components/AdminNav";
import { useRouter } from "next/router";
import { FaUser, FaWhatsapp } from "react-icons/fa6";
import {
  FiBarChart2,
  FiPieChart,
  FiYoutube,
  FiX,
  FiBookOpen,
  FiLock,
  FiSave,
  FiEdit3,
} from "react-icons/fi";

const Students = () => {
  const router = useRouter();

  // --- AUTHENTICATION & PERMISSIONS STATE ---
  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // --- DATA STATE ---
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- EDIT PROFILE STATE ---
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [editStudentForm, setEditStudentForm] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    centerName: "",
    previousSchool: "",
    previousClass: "",
    previousResult: "",
    fatherName: "",
    fatherMobile: "",
    Batch: "",
    targetClass: "",
    Status: "",
    portalLoginEmail: "",
    password: "",
    createdAt: "",
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [targetClassFilter, setTargetClassFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const [todayCount, setTodayCount] = useState(0);
  const [isFeesModalOpen, setIsFeesModalOpen] = useState(false);

  // Enhanced Fees State
  const [totalFees, setTotalFees] = useState("");
  const [admissionFee, setAdmissionFee] = useState("");
  const [installmentCount, setInstallmentCount] = useState(1);
  const [installments, setInstallments] = useState([]);
  const [paymentDate, setPaymentDate] = useState("");

  // --- Test Stats State ---
  const [isTestStatsModalOpen, setIsTestStatsModalOpen] = useState(false);
  const [studentTestStats, setStudentTestStats] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Derived state for dynamic Target Class options
  const uniqueClasses = useMemo(() => {
    return [...new Set(students.map((s) => s.targetClass).filter(Boolean))].sort();
  }, [students]);

  const batchOptions = ["Online", "Offline"];
  const statusOptions = ["Pending", "Active"];
  const genderOptions = ["Male", "Female", "Other"];
  const centerOptions = [
    "SAI COMPLEX BENIPUR PAHARIYA",
    "NEAR NDRF BUILDING PAHARIYA",
    "DAULATPUR ROAD(OPP. PNB ATM) PANDEYPUR"
  ];

  // --- Helpers ---
  const getJsDate = (value) => {
    if (!value) return null;

    if (value?.toDate && typeof value.toDate === "function") {
      return value.toDate();
    }

    if (value?.seconds) {
      return new Date(value.seconds * 1000);
    }

    if (value instanceof Date) {
      return value;
    }

    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  };

  const formatDate = (timestamp) => {
    const date = getJsDate(timestamp);
    if (!date) return "N/A";

    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateForInput = (timestamp) => {
    const date = getJsDate(timestamp);
    if (!date) return "";

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  };

  const onlyDigits = (value) => {
    return value?.toString().replace(/\D/g, "") || "";
  };

  const makeInputDateToFirestoreDate = (dateString) => {
    if (!dateString) return null;
    const dateObj = new Date(dateString);
    dateObj.setHours(12, 0, 0, 0);
    return dateObj;
  };

  const updateLocalStudent = (studentId, updatedData) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, ...updatedData } : student
      )
    );

    setFilteredStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, ...updatedData } : student
      )
    );

    setSelectedStudent((prev) =>
      prev && prev.id === studentId ? { ...prev, ...updatedData } : prev
    );
  };

  const buildEditFormFromStudent = (student) => {
    return {
      name: student?.name || "",
      mobileNumber: student?.mobileNumber || "",
      email: student?.email || "",
      dob: student?.dob || "",
      gender: student?.gender || "",
      bloodGroup: student?.bloodGroup || "",
      centerName: student?.centerName || "",
      previousSchool: student?.previousSchool || "",
      previousClass: student?.previousClass || "",
      previousResult: student?.previousResult || "",
      fatherName: student?.fatherName || "",
      fatherMobile: student?.fatherMobile || "",
      Batch: student?.Batch || "",
      targetClass: student?.targetClass || "",
      Status: student?.Status || "Pending",
      portalLoginEmail: student?.portalLoginEmail || "",
      password: student?.password || "",
      createdAt: formatDateForInput(student?.createdAt),
    };
  };

  // --- CHECK AUTHENTICATION & FETCH LIVE PERMISSIONS ---
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/Admin/login");
        return;
      }

      try {
        const db = firebase.firestore();

        const adminSnapshot = await db
          .collection('sengarcarreradminUsers')
          .where("email", "==", user.email)
          .get();

        if (adminSnapshot.empty) {
          await firebase.auth().signOut();
          router.push("/Admin/login");
          return;
        }

        const adminData = adminSnapshot.docs[0].data();

        if (adminData.isVerified !== true) {
          await firebase.auth().signOut();
          router.push("/Admin/login");
          return;
        }

        setAdminUser({
          id: adminSnapshot.docs[0].id,
          ...adminData,
        });

        setAuthLoading(false);
      } catch (error) {
        console.error("Authorization check error:", error);
        await firebase.auth().signOut();
        router.push("/Admin/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // --- FETCH STUDENTS DATA ---
  useEffect(() => {
    if (authLoading || !adminUser || !adminUser.viewStudent) {
      return;
    }

    const fetchStudents = async () => {
      try {
        const snapshot = await firebase
          .firestore()
          .collection('sengarcarreradmissions')
          .orderBy("createdAt", "desc")
          .get();

        const studentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setStudents(studentsData);
        setFilteredStudents(studentsData);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaysStudents = studentsData.filter((student) => {
          const studentDate = getJsDate(student.createdAt);
          if (!studentDate) return false;
          return studentDate >= today;
        });

        setTodayCount(todaysStudents.length);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [authLoading, adminUser]);

  // Combined Filter Logic
  useEffect(() => {
    let result = [...students];

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();

      result = result.filter(
        (student) =>
          student.name?.toLowerCase().includes(query) ||
          student.mobileNumber?.toString().includes(query) ||
          student.fatherMobile?.toString().includes(query) ||
          student.studentid?.toLowerCase().includes(query)
      );
    }

    if (targetClassFilter !== "all") {
      result = result.filter((student) => student.targetClass === targetClassFilter);
    }

    if (batchFilter !== "all") {
      result = result.filter((student) => student.Batch === batchFilter);
    }

    if (startDate || endDate) {
      result = result.filter((student) => {
        const studentDate = getJsDate(student.createdAt);
        if (!studentDate) return false;

        studentDate.setHours(0, 0, 0, 0);

        let isAfterStart = true;
        let isBeforeEnd = true;

        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          isAfterStart = studentDate >= start;
        }

        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          isBeforeEnd = studentDate <= end;
        }

        return isAfterStart && isBeforeEnd;
      });
    }

    setFilteredStudents(result);
    setCurrentPage(1);
  }, [searchQuery, targetClassFilter, batchFilter, startDate, endDate, students]);

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / studentsPerPage));
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  // --- Profile Modal Logic ---
  const openStudentProfile = (student) => {
    setSelectedStudent(student);
    setEditStudentForm(buildEditFormFromStudent(student));
    setIsEditingProfile(false);
    setIsModalOpen(true);

    if (student.fees) {
      setTotalFees(student.fees.totalFees || "");
      setAdmissionFee(student.fees.admissionFee || "");
      setInstallments(student.fees.installments || []);
    } else {
      setTotalFees("");
      setAdmissionFee("");
      setInstallments([]);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setIsEditingProfile(false);
    setSavingProfile(false);

    setEditStudentForm({
      name: "",
      mobileNumber: "",
      email: "",
      dob: "",
      gender: "",
      bloodGroup: "",
      centerName: "",
      previousSchool: "",
      previousClass: "",
      previousResult: "",
      fatherName: "",
      fatherMobile: "",
      Batch: "",
      targetClass: "",
      Status: "",
      portalLoginEmail: "",
      password: "",
      createdAt: "",
    });

    setTotalFees("");
    setAdmissionFee("");
    setInstallments([]);
  };

  const handleEditFormChange = (field, value) => {
    setEditStudentForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveStudentProfile = async () => {
    if (!selectedStudent?.id) {
      alert("Student not selected.");
      return;
    }

    const cleanedMobile = onlyDigits(editStudentForm.mobileNumber);
    const cleanedFatherMobile = onlyDigits(editStudentForm.fatherMobile);

    if (!editStudentForm.name.trim()) {
      alert("Student name is required.");
      return;
    }

    if (cleanedMobile && cleanedMobile.length < 10) {
      alert("Student mobile number must be at least 10 digits.");
      return;
    }

    if (cleanedFatherMobile && cleanedFatherMobile.length < 10) {
      alert("Father mobile number must be at least 10 digits.");
      return;
    }

    setSavingProfile(true);

    try {
      const firestoreCreatedAt = makeInputDateToFirestoreDate(editStudentForm.createdAt);

      const updateData = {
        name: editStudentForm.name.trim(),
        mobileNumber: cleanedMobile,
        email: editStudentForm.email.trim(),
        dob: editStudentForm.dob,
        gender: editStudentForm.gender,
        bloodGroup: editStudentForm.bloodGroup.trim(),
        centerName: editStudentForm.centerName.trim(),
        previousSchool: editStudentForm.previousSchool.trim(),
        previousClass: editStudentForm.previousClass.trim(),
        previousResult: editStudentForm.previousResult,
        fatherName: editStudentForm.fatherName.trim(),
        fatherMobile: cleanedFatherMobile,
        Batch: editStudentForm.Batch,
        targetClass: editStudentForm.targetClass.trim(),
        Status: editStudentForm.Status || "Pending",
        portalLoginEmail: editStudentForm.portalLoginEmail.trim(),
        password: editStudentForm.password,
        updatedAt: new Date(),
      };

      if (firestoreCreatedAt) {
        updateData.createdAt = firestoreCreatedAt;
      }

      await firebase
        .firestore()
        .collection('sengarcarreradmissions')
        .doc(selectedStudent.id)
        .update(updateData);

      updateLocalStudent(selectedStudent.id, updateData);

      setIsEditingProfile(false);
      alert("Student profile updated successfully!");
    } catch (error) {
      console.error("Error updating student profile:", error);
      alert("Failed to update student profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const cancelEditProfile = () => {
    if (!selectedStudent) return;
    setEditStudentForm(buildEditFormFromStudent(selectedStudent));
    setIsEditingProfile(false);
  };

  // --- WhatsApp Credentials Sender ---
  const sendCredentialsViaWhatsApp = (student) => {
    if (!student) return;

    let phone = student.fatherMobile || student.mobileNumber;

    if (!phone) {
      alert("Cannot send: Mobile number is missing!");
      return;
    }

    phone = phone.toString().replace(/\D/g, "");

    if (phone.length === 10) {
      phone = "91" + phone;
    }

    const message =
      `*Sengar Carrer Institute - Student Portal Access* 🎓\n\n` +
      `Dear ${student.name},\n` +
      `Here are your portal login credentials:\n\n` +
      `*🏫 Academic Details:*\n` +
      `• *Center:* ${student.centerName || "N/A"}\n` +
      `• *Class:* ${student.targetClass || "N/A"}\n\n` +
      `*🔐 Student Portal Access:*\n` +
      `• *Login Email:* ${student.portalLoginEmail || "N/A"}\n` +
      `• *Password:* ${student.password || "N/A"}\n\n` +
      `*👉 Login Here:* https://sengarcareerinstitute.com/\n\n` +
      `*📞 Help & Support:* +91 8127140804\n\n` +
      `Thank you for choosing Sengar Carrer Institute!`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
      message
    )}`;

    const link = document.createElement("a");
    link.href = whatsappUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Test Stats Modal Logic ---
  const openTestStatsModal = async (student) => {
    setSelectedStudent(student);
    setIsTestStatsModalOpen(true);
    setIsLoadingStats(true);
    setStudentTestStats([]);

    try {
      const db = firebase.firestore();

      const stdSnapshot = await db
        .collection("sengarcarrertestseriesresult")
        .where("userId", "==", student.id)
        .get();

      const stdTests = stdSnapshot.docs.map((doc) => ({
        id: doc.id,
        testType: "Standard",
        ...doc.data(),
      }));

      const ytSnapshot = await db
        .collection("yttestseriesresult")
        .where("userId", "==", student.id)
        .get();

      const ytTests = ytSnapshot.docs.map((doc) => ({
        id: doc.id,
        testType: "YouTube",
        ...doc.data(),
      }));

      let combined = [...stdTests, ...ytTests];

      combined = combined.map((test) => {
        let bestAttempt = test;

        if (test.attempts && test.attempts.length > 0) {
          bestAttempt = test.attempts.reduce(
            (max, a) => ((a.percentage || 0) > (max.percentage || 0) ? a : max),
            test.attempts[0]
          );
        }

        const score = bestAttempt.percentage || 0;

        return {
          ...test,
          bestScore: score,
          totalAttempts: test.attempts?.length || 1,
        };
      });

      combined.sort((a, b) => {
        const dateA = getJsDate(a.createdAt)?.getTime() || 0;
        const dateB = getJsDate(b.createdAt)?.getTime() || 0;
        return dateB - dateA;
      });

      setStudentTestStats(combined);
    } catch (error) {
      console.error("Error fetching test stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const closeTestStatsModal = () => {
    setIsTestStatsModalOpen(false);
    setStudentTestStats([]);
  };

  // --- Fees Logic ---
  const openFeesModal = () => {
    setIsFeesModalOpen(true);
    const today = new Date().toISOString().split("T")[0];
    setPaymentDate(today);
  };

  const closeFeesModal = () => {
    setIsFeesModalOpen(false);
    setInstallmentCount(1);

    if (!selectedStudent?.fees) {
      setAdmissionFee("");
      setTotalFees("");
      setInstallments([]);
    }
  };

  const updateStudentStatus = async (studentId, newStatus) => {
    try {
      await firebase.firestore().collection('sengarcarreradmissions').doc(studentId).update({
        Status: newStatus,
        updatedAt: new Date(),
      });

      updateLocalStudent(studentId, {
        Status: newStatus,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating student status:", error);
      alert("Failed to update status.");
    }
  };

  const handleInstallmentChange = (e) => {
    setInstallmentCount(parseInt(e.target.value) || 1);
  };

  const handleInstallmentUpdate = (index, field, value) => {
    const newInstallments = [...installments];

    if (field === "paid") {
      const isPaid = value === "true";
      newInstallments[index].paid = isPaid;

      if (isPaid && !newInstallments[index].paidDate) {
        newInstallments[index].paidDate = new Date().toISOString().split("T")[0];
      } else if (!isPaid) {
        newInstallments[index].paidDate = "";
      }
    } else {
      newInstallments[index][field] = value;
    }

    setInstallments(newInstallments);
  };

  const generateInstallments = () => {
    const newInstallments = [];
    const total = parseFloat(totalFees) || 0;
    const admission = parseFloat(admissionFee) || 0;
    const remainingForInstallments = total - admission;
    const todayStr = new Date().toISOString().split("T")[0];

    if (total <= 0) {
      alert("Please enter a valid Total Fees amount");
      return;
    }

    if (admission > total) {
      alert("Admission fee cannot be greater than Total Fees");
      return;
    }

    if (admission > 0) {
      newInstallments.push({
        title: "Admission Fee",
        number: 0,
        amount: admission.toFixed(2),
        date: todayStr,
        mode: "Cash",
        paid: false,
        paidDate: "",
      });
    }

    if (installmentCount > 0 && remainingForInstallments > 0) {
      const amountPerInstallment = remainingForInstallments / installmentCount;

      for (let i = 0; i < installmentCount; i++) {
        newInstallments.push({
          title: `Installment ${i + 1}`,
          number: i + 1,
          amount: amountPerInstallment.toFixed(2),
          date: "",
          mode: "Cash",
          paid: false,
          paidDate: "",
        });
      }
    }

    setInstallments(newInstallments);
  };

  const submitFees = async () => {
    if (!selectedStudent?.id) return;

    try {
      const feesData = {
        totalFees: parseFloat(totalFees) || 0,
        admissionFee: parseFloat(admissionFee) || 0,
        installments,
        lastUpdated: new Date(),
      };

      await firebase.firestore().collection('sengarcarreradmissions').doc(selectedStudent.id).update({
        fees: feesData,
        updatedAt: new Date(),
      });

      updateLocalStudent(selectedStudent.id, {
        fees: feesData,
        updatedAt: new Date(),
      });

      closeFeesModal();
      alert("Fee configuration saved successfully!");
    } catch (error) {
      console.error("Error submitting fees:", error);
      alert("Failed to save fee configuration.");
    }
  };

  const markAsPaid = async (installmentIndex) => {
    if (!selectedStudent?.id || !selectedStudent?.fees?.installments) return;

    try {
      const updatedInstallments = selectedStudent.fees.installments.map((inst, idx) => {
        if (idx !== installmentIndex) return inst;

        return {
          ...inst,
          paid: true,
          paidDate: new Date().toISOString().split("T")[0],
        };
      });

      const updatedFees = {
        ...selectedStudent.fees,
        installments: updatedInstallments,
        lastUpdated: new Date(),
      };

      await firebase.firestore().collection('sengarcarreradmissions').doc(selectedStudent.id).update({
        fees: updatedFees,
        updatedAt: new Date(),
      });

      updateLocalStudent(selectedStudent.id, {
        fees: updatedFees,
        updatedAt: new Date(),
      });

      setInstallments(updatedInstallments);
      alert("Installment marked as paid!");
    } catch (error) {
      console.error("Error marking installment paid:", error);
      alert("Failed to mark installment paid.");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setTargetClassFilter("all");
    setBatchFilter("all");
    setStartDate("");
    setEndDate("");
  };

  const FieldInput = ({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
    disabled = false,
  }) => (
    <div>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100 disabled:opacity-70"
      />
    </div>
  );

  const FieldSelect = ({ label, value, onChange, options }) => (
    <div>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <select
        value={value || ""}
        onChange={onChange}
        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  // --- RENDER LOADING STATE ---
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // --- RENDER ACCESS DENIED STATE ---
  if (!adminUser?.viewStudent) {
    return (
      <div className="min-h-screen bg-slate-50 mb-36">
        <AdminNav />
        <div className="md:ml-64 px-4 py-8 flex flex-col items-center justify-center mt-20">
          <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-200 shadow-sm flex flex-col items-center max-w-md text-center">
            <FiLock className="h-12 w-12 mb-4 text-red-500" />
            <h2 className="text-xl font-black mb-2">Access Denied</h2>
            <p className="text-sm font-medium">
              You do not have permission to view the Students module. Please contact a Super Admin.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      <AdminNav />

      <div className="md:ml-64 px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Student Management
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              Manage admissions, editable profile details, fees, and test performances.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="bg-indigo-50 px-5 py-2.5 rounded-xl border border-indigo-100 flex items-center shadow-sm">
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mr-3">
                Total
              </span>
              <span className="text-xl font-black text-indigo-700 leading-none">
                {filteredStudents.length}
              </span>
            </div>

            <div className="bg-emerald-50 px-5 py-2.5 rounded-xl border border-emerald-100 flex items-center shadow-sm">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest mr-3">
                Today
              </span>
              <span className="text-xl font-black text-emerald-700 leading-none">
                {todayCount}
              </span>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-5 py-3 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                Search Name / ID / Mobile
              </label>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                Target Class
              </label>
              <select
                value={targetClassFilter}
                onChange={(e) => setTargetClassFilter(e.target.value)}
                className="w-full bg-slate-50 h-10 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-medium transition-all cursor-pointer"
              >
                <option value="all">All Classes</option>
                {uniqueClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                Batch
              </label>
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="w-full bg-slate-50 h-10 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-medium transition-all cursor-pointer"
              >
                <option value="all">All Batches</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-medium transition-all"
              />
            </div>

            <div>
              <button
                onClick={clearFilters}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-colors shadow-sm border border-slate-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Main Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Center
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Batch
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Join Date
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-slate-50">
                {currentStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-sm font-bold text-slate-400"
                    >
                      No students found matching your filters.
                    </td>
                  </tr>
                ) : (
                  currentStudents.map((student, index) => (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-[10px] text-slate-300 font-black w-5">
                            {indexOfFirstStudent + index + 1}.
                          </span>

                          <div className="flex-shrink-0 h-10 w-10">
                            {student.photoURL ? (
                              <img
                                className="h-10 w-10 rounded-xl object-cover shadow-sm border border-slate-200"
                                src={student.photoURL}
                                alt=""
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                <FaUser className="h-4 w-4 text-indigo-400" />
                              </div>
                            )}
                          </div>

                          <div className="ml-4">
                            <div className="text-sm font-bold text-slate-800">
                              {student.name || "N/A"}
                            </div>
                            <div className="text-[10px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wide">
                              ID: {student.studentid || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-700 font-semibold">
                          {student.mobileNumber || "N/A"}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 mt-0.5">
                          Father: {student.fatherMobile || "N/A"}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-slate-700 font-bold truncate max-w-[150px]" title={student.centerName}>
                          {student.centerName || "N/A"}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 inline-flex text-[10px] font-black uppercase tracking-wider rounded-md ${
                            student.Batch === "Online"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}
                        >
                          {student.Batch || "N/A"} - {student.targetClass || "N/A"}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 font-semibold">
                        {formatDate(student.createdAt)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={student.Status || "Pending"}
                          onChange={(e) => updateStudentStatus(student.id, e.target.value)}
                          className={`block w-full py-1.5 px-3 text-xs font-bold rounded-lg border-0 ring-1 outline-none cursor-pointer shadow-sm ${
                            student.Status === "Active"
                              ? "bg-indigo-50 ring-indigo-200 text-indigo-700"
                              : "bg-slate-50 ring-slate-200 text-slate-600"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Active">Active</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openStudentProfile(student)}
                            className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm"
                          >
                            Profile
                          </button>

                          <button
                            onClick={() => openTestStatsModal(student)}
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition-colors shadow-sm"
                          >
                            <FiBarChart2 className="mr-1.5" /> Stats
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredStudents.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
              <div className="text-xs font-bold text-slate-500">
                Showing{" "}
                <span className="text-slate-800">{indexOfFirstStudent + 1}</span> to{" "}
                <span className="text-slate-800">
                  {Math.min(indexOfLastStudent, filteredStudents.length)}
                </span>{" "}
                of <span className="text-slate-800">{filteredStudents.length}</span>{" "}
                students
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  Previous
                </button>

                <div className="flex items-center px-3 text-xs font-black text-slate-500">
                  Page {currentPage} of {totalPages}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- TEST STATS MODAL --- */}
      {isTestStatsModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
              onClick={closeTestStatsModal}
            ></div>

            <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all w-full max-w-6xl">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <FiPieChart className="text-indigo-500" /> Test Performance
                  </h2>
                  <p className="text-xs font-bold text-slate-500 mt-1">
                    Showing all test attempts for{" "}
                    <span className="text-indigo-600">{selectedStudent.name}</span>
                  </p>
                </div>

                <button
                  onClick={closeTestStatsModal}
                  className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-6 bg-white min-h-[400px]">
                {isLoadingStats ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-sm font-bold text-slate-500">
                      Compiling student test records...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          Total Tests
                        </p>
                        <p className="text-2xl font-black text-slate-800">
                          {studentTestStats.length}
                        </p>
                      </div>

                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex flex-col items-center justify-center">
                        <p className="text-[10px] font-black text-emerald-600/70 uppercase tracking-widest mb-1">
                          Avg Score
                        </p>
                        <p className="text-2xl font-black text-emerald-600">
                          {studentTestStats.length > 0
                            ? Math.round(
                                studentTestStats.reduce(
                                  (acc, test) => acc + test.bestScore,
                                  0
                                ) / studentTestStats.length
                              )
                            : 0}
                          %
                        </p>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Test / Topic Name
                            </th>
                            <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Type
                            </th>
                            <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Subject
                            </th>
                            <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Attempts
                            </th>
                            <th className="px-5 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Best Score
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-50 bg-white">
                          {studentTestStats.length === 0 ? (
                            <tr>
                              <td
                                colSpan="5"
                                className="px-6 py-12 text-center text-sm font-bold text-slate-400"
                              >
                                No test records found for this student.
                              </td>
                            </tr>
                          ) : (
                            studentTestStats.map((test, index) => (
                              <tr
                                key={`${test.id}-${index}`}
                                className="hover:bg-slate-50/50 transition-colors"
                              >
                                <td className="px-5 py-3">
                                  <p className="text-sm font-bold text-slate-800">
                                    {index + 1}.{" "}
                                    {test.topic ||
                                      test.lectureTitle ||
                                      test.testName ||
                                      "Assessment"}
                                  </p>
                                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                                    {formatDate(test.createdAt)}
                                  </p>
                                </td>

                                <td className="px-5 py-3">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                      test.testType === "YouTube"
                                        ? "bg-rose-50 text-rose-600 border border-rose-100"
                                        : "bg-blue-50 text-blue-600 border border-blue-100"
                                    }`}
                                  >
                                    {test.testType === "YouTube" ? (
                                      <FiYoutube />
                                    ) : (
                                      <FiBookOpen />
                                    )}{" "}
                                    {test.testType}
                                  </span>
                                </td>

                                <td className="px-5 py-3 text-xs font-semibold text-slate-600">
                                  {test.subject || "General"}
                                </td>

                                <td className="px-5 py-3 text-center text-sm font-bold text-slate-700">
                                  {test.totalAttempts}
                                </td>

                                <td className="px-5 py-3 text-right">
                                  <span
                                    className={`text-sm font-black ${
                                      test.bestScore >= 80
                                        ? "text-emerald-500"
                                        : test.bestScore >= 50
                                        ? "text-amber-500"
                                        : "text-rose-500"
                                    }`}
                                  >
                                    {Math.floor(test.bestScore)}%
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Student Profile Modal --- */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
              onClick={closeModal}
            ></div>

            <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all w-full max-w-6xl">
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 px-6 py-5 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden shadow-inner">
                    {selectedStudent.photoURL ? (
                      <img
                        className="h-full w-full object-cover"
                        src={selectedStudent.photoURL}
                        alt=""
                      />
                    ) : (
                      <FaUser className="h-8 w-8 text-white/70" />
                    )}
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-white">
                      {selectedStudent.name}
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      <span className="px-2 py-0.5 bg-white/10 border border-white/20 rounded text-indigo-100 text-[10px] font-bold tracking-wider">
                        EMAIL/PASSWORD: {selectedStudent.portalLoginEmail || "N/A"} /{" "}
                        {selectedStudent.password || "N/A"}
                      </span>
                      <span className="px-2 py-0.5 bg-white/10 border border-white/20 rounded text-indigo-100 text-[10px] font-bold uppercase tracking-wider">
                        Class: {selectedStudent.targetClass || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={closeModal}
                  className="text-white/40 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="p-6 bg-slate-50">
                {/* Editable Profile Section */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
                  <div className="px-5 py-3 bg-slate-100/80 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Editable Student Profile
                    </h3>

                    <div className="flex gap-2">
                      {!isEditingProfile ? (
                        <button
                          onClick={() => setIsEditingProfile(true)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-black rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100"
                        >
                          <FiEdit3 /> Edit Details
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={cancelEditProfile}
                            disabled={savingProfile}
                            className="px-3 py-1.5 text-xs font-black rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 disabled:opacity-50"
                          >
                            Cancel
                          </button>

                          <button
                            onClick={saveStudentProfile}
                            disabled={savingProfile}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-black rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                          >
                            <FiSave />
                            {savingProfile ? "Saving..." : "Save Changes"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {!isEditingProfile ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm text-left border-collapse">
                        <tbody>
                          <tr className="border-b border-slate-100">
                            <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 w-1/4 border-r border-slate-100 text-xs">
                              Date of Birth
                            </th>
                            <td className="px-5 py-3 font-semibold text-slate-800 w-1/4 border-r border-slate-100">
                              {selectedStudent.dob || "N/A"}
                            </td>
                            <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 w-1/4 border-r border-slate-100 text-xs">
                              Gender
                            </th>
                            <td className="px-5 py-3 font-semibold text-slate-800 w-1/4">
                              {selectedStudent.gender || "N/A"}
                            </td>
                          </tr>

                          <tr className="border-b border-slate-100">
                            <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">
                              Blood Group
                            </th>
                            <td className="px-5 py-3 font-semibold text-slate-800 border-r border-slate-100">
                              {selectedStudent.bloodGroup || "N/A"}
                            </td>
                            <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">
                              Gov ID Ref
                            </th>
                            <td className="px-5 py-3 font-semibold text-slate-800">
                              {selectedStudent.aadharNumber ? "[Aadhaar Redacted]" : "N/A"}
                            </td>
                          </tr>

                          <tr className="border-b border-slate-200">
                            <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">
                              Mobile Number
                            </th>
                            <td className="px-5 py-3 font-bold text-indigo-600 border-r border-slate-100">
                              {selectedStudent.mobileNumber || "N/A"}
                            </td>
                            <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">
                              Email Address
                            </th>
                            <td className="px-5 py-3 font-semibold text-slate-800 truncate max-w-[200px]">
                              {selectedStudent.email || "N/A"}
                            </td>
                          </tr>

                          <tr className="border-b border-slate-100">
                            <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">
                              Previous School
                            </th>
                            <td
                              colSpan="3"
                              className="px-5 py-3 font-semibold text-slate-800"
                            >
                              {selectedStudent.previousSchool || "N/A"}
                            </td>
                          </tr>

                          <tr className="border-b border-slate-100">
                            <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">
                              Previous Class
                            </th>
                            <td className="px-5 py-3 font-semibold text-slate-800 border-r border-slate-100">
                              {selectedStudent.previousClass || "N/A"}
                            </td>
                            <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">
                              Result Percentage
                            </th>
                            <td className="px-5 py-3 font-semibold text-slate-800">
                              {selectedStudent.previousResult || "N/A"}
                              {selectedStudent.previousResult ? "%" : ""}
                            </td>
                          </tr>

                          <tr className="border-b border-slate-100">
                            <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">
                              Father's Name
                            </th>
                            <td className="px-5 py-3 font-semibold text-slate-800 border-r border-slate-100">
                              {selectedStudent.fatherName || "N/A"}
                            </td>
                            <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">
                              Father's Mobile
                            </th>
                            <td className="px-5 py-3 font-bold text-indigo-600">
                              {selectedStudent.fatherMobile || "N/A"}
                            </td>
                          </tr>

                          <tr className="border-b border-slate-100">
                            <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">
                              Admission Date
                            </th>
                            <td className="px-5 py-3 font-semibold text-slate-800 border-r border-slate-100">
                              {formatDate(selectedStudent.createdAt)}
                            </td>
                            <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">
                              Batch / Status
                            </th>
                            <td className="px-5 py-3 font-semibold text-slate-800">
                              {selectedStudent.Batch || "N/A"} /{" "}
                              {selectedStudent.Status || "Pending"}
                            </td>
                          </tr>

                          <tr>
                            <th className="px-5 py-3 bg-slate-50/50 font-bold text-slate-600 border-r border-slate-100 text-xs">
                              Center Name
                            </th>
                            <td colSpan="3" className="px-5 py-3 font-bold text-indigo-600">
                              {selectedStudent.centerName || "N/A"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FieldInput
                          label="Student Name"
                          value={editStudentForm.name}
                          onChange={(e) => handleEditFormChange("name", e.target.value)}
                        />

                        <FieldInput
                          label="Student Mobile"
                          value={editStudentForm.mobileNumber}
                          onChange={(e) =>
                            handleEditFormChange("mobileNumber", onlyDigits(e.target.value))
                          }
                        />

                        <FieldInput
                          label="Father Mobile"
                          value={editStudentForm.fatherMobile}
                          onChange={(e) =>
                            handleEditFormChange("fatherMobile", onlyDigits(e.target.value))
                          }
                        />

                        <FieldInput
                          label="Father Name"
                          value={editStudentForm.fatherName}
                          onChange={(e) =>
                            handleEditFormChange("fatherName", e.target.value)
                          }
                        />

                        <FieldInput
                          label="Email"
                          type="email"
                          value={editStudentForm.email}
                          onChange={(e) => handleEditFormChange("email", e.target.value)}
                        />

                        <FieldInput
                          label="Date of Birth"
                          type="date"
                          value={editStudentForm.dob}
                          onChange={(e) => handleEditFormChange("dob", e.target.value)}
                        />

                        <FieldSelect
                          label="Gender"
                          value={editStudentForm.gender}
                          options={genderOptions}
                          onChange={(e) => handleEditFormChange("gender", e.target.value)}
                        />

                        <FieldInput
                          label="Blood Group"
                          value={editStudentForm.bloodGroup}
                          onChange={(e) =>
                            handleEditFormChange("bloodGroup", e.target.value)
                          }
                        />

                        <FieldSelect
                          label="Center Name"
                          value={editStudentForm.centerName}
                          options={centerOptions}
                          onChange={(e) => handleEditFormChange("centerName", e.target.value)}
                        />

                        <FieldInput
                          label="Previous School"
                          value={editStudentForm.previousSchool}
                          onChange={(e) =>
                            handleEditFormChange("previousSchool", e.target.value)
                          }
                        />

                        <FieldInput
                          label="Previous Class"
                          value={editStudentForm.previousClass}
                          onChange={(e) =>
                            handleEditFormChange("previousClass", e.target.value)
                          }
                        />

                        <FieldInput
                          label="Previous Result %"
                          type="number"
                          value={editStudentForm.previousResult}
                          onChange={(e) =>
                            handleEditFormChange("previousResult", e.target.value)
                          }
                        />

                        <FieldInput
                          label="Target Class"
                          value={editStudentForm.targetClass}
                          onChange={(e) =>
                            handleEditFormChange("targetClass", e.target.value)
                          }
                        />

                        <FieldSelect
                          label="Batch"
                          value={editStudentForm.Batch}
                          options={batchOptions}
                          onChange={(e) => handleEditFormChange("Batch", e.target.value)}
                        />

                        <FieldSelect
                          label="Status"
                          value={editStudentForm.Status}
                          options={statusOptions}
                          onChange={(e) => handleEditFormChange("Status", e.target.value)}
                        />

                        <FieldInput
                          label="Admission Date"
                          type="date"
                          value={editStudentForm.createdAt}
                          onChange={(e) =>
                            handleEditFormChange("createdAt", e.target.value)
                          }
                        />

                        <FieldInput
                          label="Portal Login Email"
                          value={editStudentForm.portalLoginEmail}
                          onChange={(e) =>
                            handleEditFormChange("portalLoginEmail", e.target.value)
                          }
                        />

                        <FieldInput
                          label="Portal Password"
                          value={editStudentForm.password}
                          onChange={(e) =>
                            handleEditFormChange("password", e.target.value)
                          }
                        />
                      </div>

                      <p className="text-[11px] font-semibold text-slate-400 mt-4">
                        Note: Aadhaar / government ID is not editable or printed here for safety.
                      </p>
                    </div>
                  )}
                </div>

                {/* Fees Structure Table */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Financial Details
                    </h3>

                    {adminUser?.feesEditAccess && (
                      <button
                        onClick={openFeesModal}
                        className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-100 font-bold transition-colors shadow-sm"
                      >
                        {selectedStudent.fees ? "Manage Fees" : "Initialize Fees"}
                      </button>
                    )}
                  </div>

                  <div className="p-0">
                    {selectedStudent.fees ? (
                      <table className="min-w-full text-sm text-left">
                        <thead className="bg-white border-b border-slate-100">
                          <tr>
                            <th className="px-5 py-4 font-bold text-slate-600">
                              Total Approved Fees
                            </th>
                            <th
                              colSpan="4"
                              className="px-5 py-4 font-black text-slate-900 text-xl text-right"
                            >
                              ₹{selectedStudent.fees.totalFees}
                            </th>
                          </tr>

                          <tr className="bg-slate-50/80 text-[10px] uppercase tracking-widest text-slate-400 font-black border-y border-slate-200">
                            <th className="px-5 py-2.5">Installment Details</th>
                            <th className="px-5 py-2.5">Amount</th>
                            <th className="px-5 py-2.5">Due Date</th>
                            <th className="px-5 py-2.5 text-center">Status</th>
                            <th className="px-5 py-2.5 text-right">Action</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {selectedStudent.fees.installments?.map((inst, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-5 py-3 font-bold text-slate-800 text-xs">
                                {inst.title || `Installment ${inst.number}`}
                              </td>

                              <td className="px-5 py-3 font-bold text-slate-600 text-xs">
                                ₹{inst.amount}
                              </td>

                              <td className="px-5 py-3 text-slate-500 text-xs font-semibold">
                                {inst.date || "TBD"}
                              </td>

                              <td className="px-5 py-3 text-center">
                                {inst.paid ? (
                                  <div className="flex flex-col items-center">
                                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
                                      Paid
                                    </span>
                                    {inst.paidDate && (
                                      <span className="text-[9px] text-slate-400 mt-1">
                                        {inst.paidDate.split("T")[0]}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200">
                                    Pending
                                  </span>
                                )}
                              </td>

                              <td className="px-5 py-3 text-right">
                                {!inst.paid && adminUser?.feesEditAccess && (
                                  <button
                                    onClick={() => markAsPaid(idx)}
                                    className="text-[10px] font-black uppercase tracking-wider text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-100 transition-all shadow-sm"
                                  >
                                    Mark Paid
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-sm text-slate-400 font-bold border-2 border-dashed border-slate-100 p-4 inline-block rounded-xl">
                          No fee structure configured.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white px-6 py-4 border-t border-slate-200 flex justify-between items-center">
                <button
                  onClick={() => sendCredentialsViaWhatsApp(selectedStudent)}
                  className="px-5 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 font-bold text-sm transition-colors flex items-center shadow-sm"
                >
                  <FaWhatsapp className="mr-2 text-lg" /> Send Credentials
                </button>

                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 font-bold text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Fees Modal */}
      {isFeesModalOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
              onClick={closeFeesModal}
            ></div>

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-5 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-slate-800">
                    Fee Configuration
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-1">
                    Configure structure for{" "}
                    <span className="text-indigo-600">{selectedStudent?.name}</span>
                  </p>
                </div>

                <button
                  onClick={closeFeesModal}
                  className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-6 bg-white flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Total Fees (₹)
                    </label>
                    <input
                      type="number"
                      value={totalFees}
                      onChange={(e) => setTotalFees(e.target.value)}
                      placeholder="50000"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none font-bold text-slate-800 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Admission Fee (₹)
                    </label>
                    <input
                      type="number"
                      value={admissionFee}
                      onChange={(e) => setAdmissionFee(e.target.value)}
                      placeholder="10000"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none font-bold text-slate-800 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Installments
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min="1"
                        value={installmentCount}
                        onChange={handleInstallmentChange}
                        className="w-20 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none font-bold text-center text-slate-800"
                      />

                      <button
                        onClick={generateInstallments}
                        className="flex-1 bg-indigo-50 text-indigo-600 font-bold rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors shadow-sm text-sm"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                </div>

                {installments.length > 0 && (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-100 text-sm whitespace-nowrap">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Installment
                            </th>
                            <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Amount (₹)
                            </th>
                            <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Due Date
                            </th>
                            <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Mode
                            </th>
                            <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Status
                            </th>
                            <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Paid Date
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-50">
                          {installments.map((inst, index) => (
                            <tr key={index} className="hover:bg-slate-50/50">
                              <td className="px-5 py-3 font-bold text-slate-800 text-xs bg-slate-50/30">
                                {inst.title || `Installment ${inst.number}`}
                              </td>

                              <td className="px-5 py-3">
                                <input
                                  type="number"
                                  value={inst.amount}
                                  onChange={(e) =>
                                    handleInstallmentUpdate(index, "amount", e.target.value)
                                  }
                                  className="w-full min-w-[100px] px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 transition-all"
                                />
                              </td>

                              <td className="px-5 py-3">
                                <input
                                  type="date"
                                  value={inst.date || ""}
                                  onChange={(e) =>
                                    handleInstallmentUpdate(index, "date", e.target.value)
                                  }
                                  className="w-full min-w-[140px] px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 outline-none focus:border-indigo-400 transition-all"
                                />
                              </td>

                              <td className="px-5 py-3">
                                <select
                                  value={inst.mode}
                                  onChange={(e) =>
                                    handleInstallmentUpdate(index, "mode", e.target.value)
                                  }
                                  className="w-full min-w-[120px] px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 outline-none focus:border-indigo-400 cursor-pointer transition-all"
                                >
                                  <option value="Cash">Cash</option>
                                  <option value="Cheque">Cheque</option>
                                  <option value="Bank">Bank Transfer</option>
                                  <option value="UPI">UPI</option>
                                </select>
                              </td>

                              <td className="px-5 py-3">
                                <select
                                  value={inst.paid ? "true" : "false"}
                                  onChange={(e) =>
                                    handleInstallmentUpdate(index, "paid", e.target.value)
                                  }
                                  className={`w-full min-w-[100px] px-3 py-2 border rounded-lg text-sm font-bold outline-none cursor-pointer transition-all ${
                                    inst.paid
                                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                      : "bg-amber-50 border-amber-200 text-amber-700"
                                  }`}
                                >
                                  <option value="false">Pending</option>
                                  <option value="true">Paid</option>
                                </select>
                              </td>

                              <td className="px-5 py-3">
                                <input
                                  type="date"
                                  value={inst.paidDate ? inst.paidDate.split("T")[0] : ""}
                                  onChange={(e) =>
                                    handleInstallmentUpdate(index, "paidDate", e.target.value)
                                  }
                                  disabled={!inst.paid}
                                  className="w-full min-w-[140px] px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 outline-none focus:border-indigo-400 disabled:opacity-40 disabled:bg-slate-100 transition-all"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  onClick={closeFeesModal}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 font-bold text-sm transition-colors shadow-sm"
                >
                  Cancel
                </button>

                <button
                  onClick={submitFees}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold text-sm transition-colors shadow-sm"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;