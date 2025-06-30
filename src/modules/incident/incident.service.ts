import { Injectable } from '@nestjs/common';
import { ServiceNowService } from '../service-now/service-now.service';
import { CreateNewIncidentDto } from './dtos/create-new-incident.dto';

@Injectable()
export class IncidentService {
  constructor(private readonly serviceNowService: ServiceNowService) {}

  async create({ type, payload }: CreateNewIncidentDto) {
    const res = await this.serviceNowService.fetch(
      '/api/now/table/incident?sysparm_fields=short_description,number',
      {
        method: 'POST',
        body: JSON.stringify({
          short_description: 'test',
          description: 'test',
          impact: 'test',
          urgency: 'test',
          caller_id: 'test',
          assignment_group: 'test',
          category: 'test',
          subcategory: 'test',
        }),
      },
    );

    return res.json();
  }
}
