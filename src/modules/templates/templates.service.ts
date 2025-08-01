import { Injectable } from '@nestjs/common';
import { ServiceNowService } from '../service-now/service-now.service';
import { GetTemplatesQueryDto } from './dtos/get-templates-query.dto';
import { Template } from './templates.interface';
import { transformTemplate } from './templates.transform';

@Injectable()
export class TemplatesService {
  constructor(private readonly serviceNowService: ServiceNowService) {}

  async getAll(params: GetTemplatesQueryDto) {
    const { search, skip, limit } = params;
    const extraParams: any = {
      sysparm_fields: 'sys_id,u_id,name,short_description',
      sysparm_display_value: 'true',
      sysparm_exclude_reference_link: 'true',
      sysparm_query: 'u_external=true^active=true^u_idISNOTEMPTY',
    };

    // Add query params if provided
    if (typeof limit === 'number') extraParams.sysparm_limit = limit;
    if (typeof skip === 'number') extraParams.sysparm_offset = skip;
    if (search)
      extraParams.sysparm_query += `^nameLIKE${search}^ORmetaLIKE${search}`;

    const queryParams = new URLSearchParams(extraParams).toString();

    const res = await this.serviceNowService.fetch(
      `/api/now/table/sc_cat_item_producer?${queryParams}`,
    );

    const json = (await res.json()) as Awaited<{ result: any[] }>;
    return json.result?.map((item: any) => transformTemplate(item));
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

  async getTemplateById(templateId: string) {
    const extraParams: any = {
      sysparm_fields: 'sys_id,u_id,name,short_description',
      sysparm_display_value: 'true',
      sysparm_exclude_reference_link: 'true',
      sysparm_query: `u_external=true^active=true^u_idISNOTEMPTY^u_id=${templateId}`,
    };

    const queryParams = new URLSearchParams(extraParams).toString();

    const res = await this.serviceNowService.fetch(
      `/api/now/table/sc_cat_item_producer?${queryParams}`,
    );

    const json = (await res.json()) as Awaited<{ result: Template[] }>;
    if (!json.result || json.result.length === 0) return null;
    return transformTemplate(json.result[0]);
  }
}
