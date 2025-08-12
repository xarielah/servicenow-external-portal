import { Injectable } from '@nestjs/common';
import { ServiceNowService } from '../service-now/service-now.service';
import { ExtraParams } from '../templates/templates.interface';

@Injectable()
export class AnnouncementsService {
  constructor(private readonly serviceNowService: ServiceNowService) {}

  async getAnnouncements() {
    const extraParams: ExtraParams = {
      sysparm_fields: 'sys_id,name,title,summary',
      sysparm_display_value: 'true',
      sysparm_exclude_reference_link: 'true',
      // Search for announcements flagged as "External Portal = true" and their From/To date ranges fit for today.
      sysparm_query:
        'active=true^u_external_portal=true^from<=javascript:gs.endOfToday()^to>=javascript:gs.beginningOfToday()^ORtoISEMPTY',
    };

    const response = await this.serviceNowService.fetch(
      `/api/now/table/announcement?${new URLSearchParams(extraParams).toString()}`,
    );

    const responseJson = await response.json();

    if (!responseJson.result) return [];

    return responseJson.result;
  }
}
