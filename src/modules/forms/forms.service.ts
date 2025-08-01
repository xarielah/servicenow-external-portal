import { Injectable } from '@nestjs/common';
import { ServiceNowService } from '../service-now/service-now.service';

@Injectable()
export class FormsService {
  constructor(private readonly serviceNowService: ServiceNowService) {}

  async getVariableSets(templateId: string) {
    const extraParams = {
      sysparm_fields: 'variable_set.sys_id,sc_cat_item.name,sc_cat_item.u_id',
      sysparm_display_value: 'true',
      sysparm_exclude_reference_link: 'true',
      sysparm_query: `sc_cat_item.active=true^sc_cat_item.ref_sc_cat_item_producer.u_id=${templateId}`,
    };

    const queryParams = new URLSearchParams(extraParams).toString();

    const res = await this.serviceNowService.fetch(
      `/api/now/table/io_set_item?${queryParams}`,
    );

    return res.json();
  }

  async getTemplateFields(templateId: string) {
    const extraParams = {
      sysparm_fields:
        'sys_id,option,mandatory,include_none,question_text,cat_item.sys_id,name,help_tag,validate_regex,type,u_external_classname',
      sysparm_display_value: 'true',
      sysparm_exclude_reference_link: 'true',
      sysparm_query: `ORDERBYorder^active=true^cat_item.active=true^cat_item.ref_sc_cat_item_producer.sys_id=${templateId}`,
    };

    const variableSets = await this.getVariableSets(templateId);

    if (variableSets.result && variableSets.result.length > 0) {
      for (let vs of variableSets.result) {
        extraParams.sysparm_query += `^NQvariable_set=${vs['variable_set.sys_id']}`;
      }
    }

    console.log(extraParams.sysparm_query);

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
