import AddPatientsDialog from '@/components/custom/Dialogs/AddPatientsDialog'
import DeletePatientDialog from '@/components/custom/Dialogs/DeletePatientDialog'
import { Button } from '@/components/ui/button'
import type { RootState } from '@/store/store'
import { createFileRoute } from '@tanstack/react-router'
import { Plus, Trash } from 'lucide-react'
import { useSelector } from 'react-redux'

export const Route = createFileRoute('/admin/_layout/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const { patients } = useSelector((state: RootState) => state.patientReducer)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patients</h1>

        <AddPatientsDialog />
      </div>

      {/* Patients Table */}
      {patients && patients.length > 0 ? (
        <div className="overflow-x-auto rounded-md border">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 font-medium">#</th>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Memories</th>
                <th className="px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr
                  key={patient._id || index}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{patient.name}</td>
                  <td className="px-4 py-2">{patient.email}</td>
                  <td className="px-4 py-2">{patient.memories?.length ?? 0}</td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                    >
                      View
                    </Button>

                    <DeletePatientDialog id={patient._id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-md">
          <p className="text-gray-600 text-lg">No patients found</p>
          <Button className="mt-4 flex items-center gap-2">
            <Plus size={18} /> Add Patient
          </Button>
        </div>
      )}
    </div>
  )
}
