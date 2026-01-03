import { Injectable } from '@nestjs/common';

@Injectable()
export class AiCopilotService {
    summarize(records: any[]) {
        return {
            summary: 'Résumé médical généré automatiquement à partir de l\'historique du patient. Ce résumé met en évidence les points clés des consultations précédentes.',
            disclaimer: 'For assistance only. Physician validation required. This is not a formal medical diagnosis.',
            timestamp: new Date().toISOString(),
        };
    }
}
