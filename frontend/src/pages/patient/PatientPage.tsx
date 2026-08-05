import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";

import { AppointmentResponse, DentistUpdateRequest, PatientResponse } from "../../types";
import { usePatients } from "../../hooks/usePatient";
import { useAppointments } from "../../hooks/useAppointments";
import { useAuth } from "../../context/AuthContext";
import PacientePainel from "../../components/PatientPanel/PatientPanel";
import PacienteCard from "../../components/PatientCarsds/PatientCard";
import Modal from "../../components/Modal/Modal";
import NovoPacienteForm from "../../components/NovoPatientForm/PatientForm";
import NovoAppointmentForm from "../../components/NovoAppointmentForm/AppointmentForm";
import AppointmentPanel from "../../components/AppointmentPanel/AppointmentPanel";
import DentistProfilePanel from "../../components/DentistProfilePanel/DentistProfilePanel";

const USE_MOCK = false;
const pageAnimations = [
  "@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Lora:wght@600;700&display=swap');",
  "* { font-family: 'DM Sans', sans-serif; }",
  ".font-display { font-family: 'Lora', serif; }",
  ".card-hover { transition: all 0.18s ease; }",
  ".card-hover:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(236,72,153,0.10); }",
  "@keyframes slideIn { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }",
  "@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }",
  "@keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }",
  "@keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }",
  ".slide-in { animation: slideIn 0.28s ease forwards; }",
  ".fade-up { animation: fadeUp 0.22s ease forwards; }",
  ".modal-content { animation: modalIn 0.25s ease forwards; }",
  ".modal-backdrop { animation: backdropIn 0.2s ease forwards; }",
].join("\n");

export default function PacientesPage() {
  const { dentist, updateDentist, logout } = useAuth();
  const navigate = useNavigate();
  const { patients, loading, error, refetch, addPatient, updatePatient } =
    usePatients();

  const [busca, setBusca] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientResponse | null>(null);
  const [openNotes, setOpenNotes] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<PatientResponse | null>(null);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [appointmentPatient, setAppointmentPatient] = useState<PatientResponse | null>(null);
  const [appointmentPanelId, setAppointmentPanelId] = useState<string | null>(null);
  const [dentistPanelOpen, setDentistPanelOpen] = useState(false);

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(busca.toLowerCase()) ||
      p.cpf.includes(busca) ||
      p.phone.includes(busca),
  );

  const {
    appointments,
    loading: loadingAppointments,
    refetch: refetchAppointments,
  } = useAppointments(selectedPatient?.id ?? null);

  function handleSelect(patient: PatientResponse) {
    const isSamePatient = selectedPatient?.id === patient.id;
    setSelectedPatient(isSamePatient ? null : patient);
    setOpenNotes(false);

    const cardElement = document.getElementById("patient-card-" + patient.id);
    cardElement?.scrollIntoView({ behavior: "smooth", block: "start" });

    if (isSamePatient === false) {
      setTimeout(() => {
        document.getElementById("patient-panel")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 180);
    }
  }

  function handleSelectAppointment(appointment: AppointmentResponse) {
    setAppointmentPanelId(appointment.id);
  }

  function handleOpenNotes(patient: PatientResponse) {
    setSelectedPatient(patient);
    setOpenNotes(true);
  }

  function handleNewPatientSuccess(newPatient: PatientResponse) {
    setModalOpen(false);
    if (USE_MOCK) {
      addPatient(newPatient);
    } else {
      refetch();
    }
    setSelectedPatient(newPatient);
  }

  function handleOpenEditPatient(patient: PatientResponse) {
    setPatientToEdit(patient);
    setEditModalOpen(true);
    setSelectedPatient(null);
    setOpenNotes(false);
  }

  function handleEditPatientSuccess(updatedPatient: PatientResponse) {
    setEditModalOpen(false);
    setPatientToEdit(null);

    if (USE_MOCK) {
      updatePatient(updatedPatient);
    } else {
      refetch();
    }

    setSelectedPatient(updatedPatient);
  }

  function handleCloseEditModal() {
    const restore = patientToEdit;
    setEditModalOpen(false);
    setPatientToEdit(null);
    if (restore) setSelectedPatient(restore);
  }

  function handleOpenNewAppointment(patient: PatientResponse) {
    setAppointmentPatient(patient);
    setAppointmentModalOpen(true);
    setOpenNotes(false);
  }

  function handleCloseNewAppointment() {
    setAppointmentModalOpen(false);
    setAppointmentPatient(null);
  }

  function handleNewAppointmentSuccess() {
    setAppointmentModalOpen(false);
    setAppointmentPatient(null);
    refetchAppointments();
  }

  async function handleDentistUpdated(updatedDentist: DentistUpdateRequest) {
    const previousEmail = dentist?.email ?? null;

    const savedDentist = await updateDentist({
      name: updatedDentist.name,
      email: updatedDentist.email,
      cro: updatedDentist.cro,
    });

    setDentistPanelOpen(false);

    if (previousEmail && savedDentist.email !== previousEmail) {
      logout();
      navigate("/login");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{pageAnimations}</style>

      <Header onToggleSidebar={() => setSidebarOpen(sidebarOpen === false)} />

      <div className="flex min-h-screen">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onEditDentist={() => setDentistPanelOpen(true)}
        />

        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-4 py-7">
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Pacientes</h1>
                  <p className="text-sm text-gray-400 mt-1">
                    {filtered.length} paciente{filtered.length === 1 ? "" : "s"}
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-2 bg-pink-400 hover:bg-pink-500 active:bg-pink-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                    <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <span className="hidden sm:inline">Novo Paciente</span>
                </button>
              </div>

              <div className="relative mb-5">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar paciente..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl text-sm text-black-700 placeholder-gray-400 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-50 transition-all"
                />
              </div>

              {loading && (
                <div className="flex justify-center py-20">
                  <div className="w-8 h-8 border-2 border-pink-300 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-400 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {error}
                </div>
              )}

              {loading === false && error == null && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered.length === 0 && (
                    <div className="text-center py-20 text-gray-300 col-span-full">
                      <svg className="mx-auto mb-4" width="44" height="44" fill="none" viewBox="0 0 24 24">
                        <path
                          d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      <p className="text-sm font-medium">Nenhum paciente encontrado</p>
                      <button
                        onClick={() => setModalOpen(true)}
                        className="mt-3 text-sm text-pink-400 hover:text-pink-600 font-medium transition-colors"
                      >
                        + Cadastrar primeiro paciente
                      </button>
                    </div>
                  )}

                  {filtered.map((patient, i) => (
                    <PacienteCard
                      key={patient.id}
                      patient={patient}
                      selected={selectedPatient?.id === patient.id}
                      onClick={() => handleSelect(patient)}
                      onAvatarClick={() => handleOpenNotes(patient)}
                      animationDelay={i * 35}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="h-full min-h-screen pt-12 pb-12">
            <PacientePainel
              patient={selectedPatient}
              appointments={appointments}
              loadingAppointments={loadingAppointments}
              onClose={() => {
                setSelectedPatient(null);
                setOpenNotes(false);
              }}
              onNewAppointment={() => handleOpenNewAppointment(selectedPatient)}
              onEdit={() => handleOpenEditPatient(selectedPatient)}
              onSelectAppointment={handleSelectAppointment}
              onPatientUpdated={(updatedPatient) => {
                updatePatient(updatedPatient);
                setSelectedPatient(updatedPatient);
              }}
              overlay
              initialNotesOpen={openNotes}
              onNotesClose={() => setOpenNotes(false)}
            />
          </div>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Novo Paciente"
      >
        <NovoPacienteForm
          onSuccess={handleNewPatientSuccess}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      <Modal isOpen={editModalOpen} onClose={handleCloseEditModal} title="Editar Paciente">
        <NovoPacienteForm
          patient={patientToEdit}
          onSuccess={handleEditPatientSuccess}
          onCancel={handleCloseEditModal}
        />
      </Modal>

      <Modal
        isOpen={appointmentModalOpen}
        onClose={handleCloseNewAppointment}
        title="Nova Consulta"
      >
        {appointmentPatient && (
          <NovoAppointmentForm
            patient={appointmentPatient}
            onSuccess={handleNewAppointmentSuccess}
            onCancel={handleCloseNewAppointment}
          />
        )}
      </Modal>

      {appointmentPanelId && (
        <AppointmentPanel
          appointmentId={appointmentPanelId}
          onClose={() => setAppointmentPanelId(null)}
          onUpdated={() => refetchAppointments()}
        />
      )}

      {dentist && (
        <DentistProfilePanel
          dentist={dentist}
          isOpen={dentistPanelOpen}
          onClose={() => setDentistPanelOpen(false)}
          onSave={handleDentistUpdated}
        />
      )}
    </div>
  );
}
