import { Injectable } from '@nestjs/common';
import { ServiceNowService } from '../service-now/service-now.service';
import { GetTemplatesQueryDto } from './dtos/get-templates-query.dto';

@Injectable()
export class TemplatesService {
  constructor(private readonly serviceNowService: ServiceNowService) {}

  async getAll(params: GetTemplatesQueryDto) {
    const { search, from, skip, limit } = params;
    const extraParams: any = {
      sysparm_fields:
        'sys_id,name,short_description,u_portal_category,meta,template',
      sysparm_display_value: 'true',
      sysparm_exclude_reference_link: 'true',
      sysparm_query: 'u_ext_portal=true^active=true',
    };

    // Add query params if provided
    if (typeof limit === 'number') extraParams.sysparm_limit = limit;
    if (typeof skip === 'number') extraParams.sysparm_offset = skip;
    if (search) extraParams.sysparm_query += `^nameLIKE${search}`;

    const queryParams = new URLSearchParams(extraParams).toString();

    const res = await this.serviceNowService.fetch(
      `/api/now/table/sc_cat_item_producer?${queryParams}`,
    );

    return res.json();
  }

  async submit({ templateId, variables }: any) {
    const res = await this.serviceNowService.fetch(
      `/api/sn_sc/servicecatalog/items/${templateId}/submit_producer`,
      {
        method: 'POST',
        body: JSON.stringify({ variables }),
      },
    );

    if (!res.ok) {
      const json = await res.json();
      throw new Error(JSON.stringify(json));
    }

    return res.json();
  }
}
