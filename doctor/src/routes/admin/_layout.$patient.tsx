import { createFileRoute } from '@tanstack/react-router'
import { store, type RootState } from '@/store/store'
import { ImageIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { setPatient } from '@/store/slices/patient.slice'
import { useSelector } from 'react-redux'
import Loader from '@/components/custom/Loader'
import AddMemoryDialog from '@/components/custom/Dialogs/AddMemoryDialog'
import { persistPatientWithMemories } from '@/utils/auth'

export const Route = createFileRoute('/admin/_layout/$patient')({
  loader: async ({ params }) => {
    const patient = await persistPatientWithMemories(params.patient)
    store.dispatch(setPatient(patient))
  },

  component: PatientHome,
  pendingComponent: () => <Loader />,
})

function PatientHome() {
  const { patient } = useSelector((state: RootState) => state.patientReducer)
  console.log(patient?.memories)

  return (
    <main className="w-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold mb-2">Patient Details</h1>
          {patient ? (
            <>
              <div className="flex justify-between items-center bg-gray-100 p-4">
                <div className="">
                  <h2 className="text-xl font-semibold">{patient.name}</h2>
                  <p className="text-gray-600">{patient.email}</p>
                </div>
                <AddMemoryDialog />
              </div>
            </>
          ) : (
            <p>No patient selected</p>
          )}
        </div>

        {/* Memories Section */}
        {patient?.memories && patient.memories.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Memories ({patient.memories.length})
            </h2>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {patient.memories.map((memory, index) => (
                <Card
                  key={memory._id || memory.vectorId}
                  className="border rounded-lg shadow-sm"
                >
                  <CardHeader>
                    <CardTitle className="text-base font-semibold text-gray-800">
                      Memory {index + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-700 text-sm">
                      {memory.text.slice(0, memory.text.length * 0.25)}...
                    </p>

                    {memory.images && memory.images.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {memory.images.map((imgUrl: string, idx: number) => (
                          <img
                            key={idx}
                            src={imgUrl}
                            alt="Memory"
                            className="w-24 h-24 object-cover rounded-md border"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <ImageIcon size={16} /> No images
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 italic">
            No memories found for this patient.
          </div>
        )}
      </div>
    </main>
  )
}
