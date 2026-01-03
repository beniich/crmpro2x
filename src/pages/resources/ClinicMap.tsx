import React, { useState } from 'react';
import { DndContext, DragOverlay, DragStartEvent, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { DashboardLayout } from '@/components/DashboardLayout';
import { MapCanvas } from '@/components/map/MapCanvas';
import { WaitingRoom } from '@/components/map/WaitingRoom';
import { DraggablePatient } from '@/components/map/DraggablePatient';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Plus, LayoutTemplate, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock Data Types
export interface Patient {
    id: string;
    name: string;
    condition: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    avatar?: string;
}

export interface Room {
    id: string;
    name: string;
    type: 'standard' | 'icu' | 'vip';
    status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
    patientId?: string;
    x: number;
    y: number;
}

const INITIAL_PATIENTS: Patient[] = [
    { id: 'p1', name: 'John Doe', condition: 'Grippe Sévère', severity: 'medium' },
    { id: 'p2', name: 'Sarah Connor', condition: 'Trauma Léger', severity: 'low' },
    { id: 'p3', name: 'Robert Smith', condition: 'Post-Op Cardiaque', severity: 'critical' },
    { id: 'p4', name: 'Emily White', condition: 'Observation', severity: 'low' },
];

const INITIAL_ROOMS: Room[] = [
    { id: 'r1', name: 'Chambre 101', type: 'standard', status: 'available', x: 1, y: 1 },
    { id: 'r2', name: 'Chambre 102', type: 'standard', status: 'available', x: 2, y: 1 },
    { id: 'r3', name: 'Chambre 103', type: 'vip', status: 'cleaning', x: 3, y: 1 },
    { id: 'r4', name: 'Soins Intensifs 1', type: 'icu', status: 'available', x: 1, y: 2 },
    { id: 'r5', name: 'Soins Intensifs 2', type: 'icu', status: 'occupied', patientId: 'p5', x: 2, y: 2 },
];

const ClinicMap = () => {
    const { t } = useTranslation();
    const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
    const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
    const [activePatient, setActivePatient] = useState<Patient | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const patient = patients.find(p => p.id === active.id);
        if (patient) {
            setActivePatient(patient);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActivePatient(null);

        if (over && active.id !== over.id) {
            const roomId = over.id;
            const patientId = active.id;

            // Find room and patient
            const roomIndex = rooms.findIndex(r => r.id === roomId);
            const patientIndex = patients.findIndex(p => p.id === patientId);

            if (roomIndex !== -1 && patientIndex !== -1) {
                const room = rooms[roomIndex];

                if (room.status === 'occupied' || room.status === 'maintenance') {
                    toast({
                        title: "Impossible d'assigner",
                        description: "Cette chambre n'est pas disponible.",
                        variant: "destructive"
                    });
                    return;
                }

                // Logic to move patient to room
                const updatedRooms = [...rooms];
                updatedRooms[roomIndex] = { ...room, status: 'occupied', patientId: patientId as string };
                setRooms(updatedRooms);

                const updatedPatients = [...patients];
                updatedPatients.splice(patientIndex, 1);
                setPatients(updatedPatients);

                toast({
                    title: "Patient Assigné",
                    description: `${patients[patientIndex].name} a été transféré vers ${room.name}.`,
                    className: "bg-green-500 text-white"
                });
            }
        }
    };

    return (
        <DashboardLayout>
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="h-[calc(100vh-6rem)] flex flex-col gap-4 animate-fade-in">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                                Visual Clinic Map
                            </h1>
                            <p className="text-muted-foreground">Gestion interactive en temps réel</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2">
                                <LayoutTemplate className="h-4 w-4" />
                                Éditer le plan
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Settings className="h-4 w-4" />
                                Paramètres
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 flex gap-6 overflow-hidden">
                        {/* Main Map Area */}
                        <div className="flex-1 bg-card/50 backdrop-blur-sm rounded-xl border border-border shadow-inner p-6 overflow-auto relative">
                            <MapCanvas rooms={rooms} />
                        </div>

                        {/* Side Panel: Waiting Room */}
                        <div className="w-80 flex flex-col gap-4">
                            <WaitingRoom patients={patients} />
                        </div>
                    </div>
                </div>

                <DragOverlay>
                    {activePatient ? (
                        <DraggablePatient patient={activePatient} isOverlay />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </DashboardLayout>
    );
};

export default ClinicMap;
