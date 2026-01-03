import { Injectable } from '@nestjs/common';

@Injectable()
export class MockDbService {
    private storage: Record<string, any[]> = {
        patients: [],
        appointments: [],
        medicalRecords: [],
        billing: [],
        products: []
    };

    async find(collection: string, query: any = {}) {
        let results = this.storage[collection] || [];
        // Basic query filtering
        Object.keys(query).forEach(key => {
            results = results.filter(item => item[key] === query[key]);
        });
        return results;
    }

    async findById(collection: string, id: string) {
        return (this.storage[collection] || []).find(item => item.id === id || item._id === id);
    }

    async insert(collection: string, data: any) {
        const newItem = {
            ...data,
            _id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        if (!this.storage[collection]) this.storage[collection] = [];
        this.storage[collection].push(newItem);
        return newItem;
    }

    async update(collection: string, id: string, data: any) {
        const idx = (this.storage[collection] || []).findIndex(item => item.id === id || item._id === id);
        if (idx === -1) return null;
        this.storage[collection][idx] = { ...this.storage[collection][idx], ...data, updatedAt: new Date() };
        return this.storage[collection][idx];
    }

    // Pre-populate with Emma Wilson data as requested
    seed() {
        if (this.storage.patients.length > 0) return;

        const emmaId = 'emma_001';
        this.storage.patients.push({
            _id: emmaId,
            id: emmaId,
            firstName: 'Emma',
            lastName: 'Wilson',
            email: 'emma.wilson@demo.com',
            phone: '+33 6 12 34 56 78',
            dateOfBirth: new Date('1988-10-15'),
            gender: 'F',
            bloodType: 'A+',
            allergies: ['Pénicilline'],
            chronicConditions: ['Hypertension légère'],
            emergencyContact: {
                name: 'John Wilson',
                phone: '+33 6 98 76 54 32',
                relationship: 'Spouse'
            },
            status: 'active'
        });

        this.storage.medicalRecords.push({
            _id: 'rec_001',
            patientId: emmaId,
            doctorId: 'dr_martin',
            visitDate: new Date(),
            chiefComplaint: 'Suivi de routine pour hypertension',
            clinicalNotes: 'La patiente se sent bien. La tension artérielle est stable.',
            vitals: {
                weight: 64,
                height: 168,
                bloodPressure: '125/82',
                temperature: 36.7,
                heartRate: 72
            },
            diagnosis: ['Hypertension artérielle Grade 1 (E11.9)'],
            prescriptions: [
                { medication: 'Amlodipine', dosage: '5mg', frequency: '1x/jour', duration: '3 mois' }
            ]
        });

        this.storage.appointments.push({
            _id: 'app_001',
            patientId: emmaId,
            dateTime: new Date(Date.now() + 86400000 * 7),
            duration: 30,
            status: 'scheduled',
            type: 'follow-up',
            reason: 'Contrôle tension'
        });

        console.log('✅ Mock Clinical Data Seeded');
    }
}
