import { Injectable } from '@nestjs/common';
import { ServiceNowService } from '../service-now/service-now.service';

@Injectable()
export class FormsService {
  constructor(private readonly serviceNowService: ServiceNowService) {}

  async getTemplateFields(templateId: string) {
    const extraParams = {
      sysparm_fields:
        'sys_id,option,mandatory,include_none,question_text,name,help_tag,validate_regex,type',
      sysparm_display_value: 'true',
      sysparm_exclude_reference_link: 'true',
      sysparm_query: `cat_item=${templateId}`,
    };

    const queryParams = new URLSearchParams(extraParams).toString();

    const res = await this.serviceNowService.fetch(
      `/api/now/table/item_option_new?${queryParams}`,
    );

    return res.json();
  }

  async getOptions(variableId: string) {
    const extraParams = {
      sysparm_fields: 'sys_id,text,value,order',
      sysparm_display_value: 'true',
      sysparm_exclude_reference_link: 'true',
      sysparm_query: `question=${variableId}^ANDinactive=false`,
    };

    const queryParams = new URLSearchParams(extraParams).toString();

    const res = await this.serviceNowService.fetch(
      `/api/now/table/question_choice?${queryParams}`,
    );

    return res.json();
  }
}
